import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { BAYS, BEAT, clamp01, smooth } from "./track";

/**
 * The world the homepage flies through, rendered live: a building plan drawn
 * on dark paper, the building rising out of it, the client rooms inside, and
 * the gold thread in the core that a lead runs along.
 *
 * Everything is a function of `t` (see track.ts). The world holds no scroll
 * state of its own, so scrubbing backwards un-builds it exactly.
 */

const HEX = {
  night: 0x0d0b09,
  paper: 0x15110d,
  gold: 0xc9974a,
  goldLight: 0xe6c894,
  cream: 0xf1ede6,
  brown: 0x3b1e0b,
  dawn: 0x3a2414,
};

const WALL_H = 6;
const TOWER_H = 24;
const CORE = new THREE.Vector3(0, 0, -36);
const CORE_R = 5.5;
const HELIX_R = 3.2;

const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

type Key = { t: number; p: THREE.Vector3; q: THREE.Vector3; linger: number };

// Shared by every hand-written shader so fog matches the built-in materials.
const FOG_GLSL = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  float fogFactor(vec3 wp) {
    float d = length(wp - cameraPosition);
    return 1.0 - exp(-uFogDensity * uFogDensity * d * d);
  }
`;

const OUT_GLSL = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

const WORLD_VERT = /* glsl */ `
  varying vec3 vW;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export type WorldOptions = { mobile: boolean; reduced: boolean };

export class BouwplanWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private bloom: UnrealBloomPass | null = null;
  private lineMats: LineMaterial[] = [];
  private fog = { uFogColor: { value: new THREE.Color(HEX.night) }, uFogDensity: { value: 0.03 } };

  private groundU!: Record<string, THREE.IUniform>;
  private strokeU!: Record<string, THREE.IUniform>;
  private threadU!: Record<string, THREE.IUniform>;
  private skyU!: Record<string, THREE.IUniform>;
  private dustU!: Record<string, THREE.IUniform>;

  private walls: { g: THREE.Object3D; start: number; dur: number }[] = [];
  private ghostMat!: LineMaterial;
  private roofMat!: THREE.MeshStandardMaterial;
  private roofEdge!: LineMaterial;
  private titleMat!: THREE.MeshBasicMaterial;
  private screens: { g: THREE.Group; mat: THREE.MeshBasicMaterial; light: THREE.PointLight; at: number }[] = [];
  private nodes: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; u: number }[] = [];
  private thread!: THREE.CatmullRomCurve3;
  private uCore = 0.4;
  private orb!: THREE.Sprite;
  private orbLight!: THREE.PointLight;
  private coreLight!: THREE.PointLight;
  private sun!: THREE.DirectionalLight;
  private hemi!: THREE.HemisphereLight;
  private keys: Key[] = [];

  private pos = new THREE.Vector3();
  private tgt = new THREE.Vector3();
  private look = new THREE.Vector3();
  private nightC = new THREE.Color(HEX.night);
  private dawnC = new THREE.Color(HEX.dawn);
  private tmpC = new THREE.Color();

  constructor(canvas: HTMLCanvasElement, private opts: WorldOptions) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setClearColor(HEX.night, 1);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
    this.scene.background = new THREE.Color(HEX.night);
    this.scene.fog = new THREE.FogExp2(HEX.night, 0.03);

    // A soft studio reflection so brass and glass have something to catch.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.32;
    pmrem.dispose();

    this.buildLights();
    this.buildSky();
    this.buildGround();
    this.buildPlan();
    this.buildTitleBlock();
    this.buildBuilding();
    this.buildGhost();
    this.buildScreens();
    this.buildThread();
    this.buildDust();
    this.buildKeys();

    if (!opts.mobile) {
      const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
      this.composer = new EffectComposer(this.renderer, rt);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.55, 0.88);
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    }
  }

  /* ---------------------------------------------------------------- build */

  private lineMat(color: number, width: number, opacity = 1) {
    const m = new LineMaterial({ color, linewidth: width, transparent: opacity < 1, opacity, worldUnits: false });
    this.lineMats.push(m);
    return m;
  }

  private edges(geo: THREE.BufferGeometry, mat: LineMaterial) {
    const g = new LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(geo, 20));
    return new LineSegments2(g, mat);
  }

  private buildLights() {
    this.hemi = new THREE.HemisphereLight(0x5a4030, 0x0d0b09, 0.7);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffc88a, 0);
    this.sun.position.set(-30, 18, -70);
    this.scene.add(this.sun);
    this.coreLight = new THREE.PointLight(HEX.gold, 0, 22, 1.6);
    this.coreLight.position.set(CORE.x, 4, CORE.z);
    this.scene.add(this.coreLight);
  }

  private buildSky() {
    this.skyU = {
      uNight: { value: new THREE.Color(HEX.night) },
      uDawnTop: { value: new THREE.Color(0x24170f) },
      uDawnLow: { value: new THREE.Color(0xd9925a) },
      uDawn: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.skyU,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: WORLD_VERT,
      fragmentShader: /* glsl */ `
        uniform vec3 uNight, uDawnTop, uDawnLow;
        uniform float uDawn;
        varying vec3 vW;
        void main() {
          vec3 d = normalize(vW - cameraPosition);
          float h = clamp(d.y, -0.2, 1.0);
          // The sun comes up behind the tower, low and to the east.
          float east = pow(max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(-0.45, 0.0, -1.0))), 0.0), 3.0);
          float horizon = exp(-max(h, 0.0) * 7.0);
          vec3 dawn = mix(uDawnTop, uDawnLow, horizon * (0.35 + 0.65 * east));
          vec3 col = mix(uNight, dawn, uDawn);
          gl_FragColor = vec4(col, 1.0);
          ${OUT_GLSL}
        }`,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), mat);
    sky.renderOrder = -1;
    this.scene.add(sky);
  }

  private buildGround() {
    const pools = Array.from({ length: 6 }, () => new THREE.Vector4(0, 0, 1, 0));
    this.groundU = {
      ...this.fog,
      uPaper: { value: new THREE.Color(HEX.paper) },
      uLine: { value: new THREE.Color(HEX.gold) },
      uWarm: { value: new THREE.Color(HEX.goldLight) },
      uLamp: { value: new THREE.Vector3(0, 15, 8) },
      uLampI: { value: 1 },
      uPools: { value: pools },
      uDawn: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.groundU,
      vertexShader: WORLD_VERT,
      fragmentShader: /* glsl */ `
        ${FOG_GLSL}
        uniform vec3 uPaper, uLine, uWarm, uLamp;
        uniform float uLampI, uDawn;
        uniform vec4 uPools[6];
        varying vec3 vW;
        float grid(vec2 p, float s) {
          vec2 q = p / s;
          vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
          return 1.0 - min(min(g.x, g.y), 1.0);
        }
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 p = vW.xz;
          float g = grid(p, 1.0) * 0.07 + grid(p, 5.0) * 0.17;
          vec2 dl = p - uLamp.xy;
          float lamp = exp(-dot(dl, dl) / (uLamp.z * uLamp.z)) * uLampI;
          float pools = 0.0;
          for (int i = 0; i < 6; i++) {
            vec2 d = p - uPools[i].xy;
            pools += exp(-dot(d, d) / (uPools[i].z * uPools[i].z)) * uPools[i].w;
          }
          float light = 0.5 + lamp * 1.9 + pools + uDawn * 0.6;
          vec3 col = uPaper * light + uLine * g * (0.35 + lamp + pools * 0.7 + uDawn * 0.6);
          col += uWarm * pools * 0.05;
          col += (hash(floor(p * 48.0)) - 0.5) * 0.010 * light;
          col = mix(col, uFogColor, fogFactor(vW));
          gl_FragColor = vec4(col, 1.0);
          ${OUT_GLSL}
        }`,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat);
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
  }

  /**
   * The drawing on the paper. Every stroke is a thin quad carrying its own
   * draw order, and the fragment shader cuts it off at `uDraw`, which is how a
   * pen line can stop halfway along a wall.
   */
  private buildPlan() {
    type Stroke = { pts: [number, number][]; w: number; a: number; b: number; dash?: number };
    const S: Stroke[] = [];
    const rect = (x1: number, z1: number, x2: number, z2: number, w: number, a: number, b: number, dash?: number) =>
      S.push({ pts: [[x1, z1], [x2, z1], [x2, z2], [x1, z2], [x1, z1]], w, a, b, dash });
    const arc = (cx: number, cz: number, r: number, a0: number, a1: number, w: number, a: number, b: number, n = 24) => {
      const pts: [number, number][] = [];
      for (let i = 0; i <= n; i++) {
        const an = a0 + ((a1 - a0) * i) / n;
        pts.push([cx + Math.sin(an) * r, cz + Math.cos(an) * r]);
      }
      S.push({ pts, w, a, b });
    };

    // Sheet border and the lot, nearest the camera first.
    rect(-17, 23, 17, -52, 0.05, 0.0, 0.32);
    rect(-16.4, 22.4, 16.4, -51.4, 0.025, 0.04, 0.36);
    for (let i = 0; i < 14; i++) {
      const z = 22.4 - i * 5.3;
      S.push({ pts: [[-17, z], [-16.4, z]], w: 0.03, a: 0.08 + i * 0.01, b: 0.12 + i * 0.01 });
      S.push({ pts: [[16.4, z], [17, z]], w: 0.03, a: 0.08 + i * 0.01, b: 0.12 + i * 0.01 });
    }
    rect(-13, 13, 13, -48, 0.03, 0.06, 0.4, 0.5);
    // Path from the street to the door, and the parking.
    S.push({ pts: [[-2, 13], [-2, 0]], w: 0.05, a: 0.1, b: 0.28 });
    S.push({ pts: [[2, 13], [2, 0]], w: 0.05, a: 0.1, b: 0.28 });
    rect(-11, 10.5, -4.5, 3.5, 0.04, 0.14, 0.3);
    for (let i = 1; i < 4; i++) S.push({ pts: [[-11, 3.5 + i * 1.75], [-4.5, 3.5 + i * 1.75]], w: 0.025, a: 0.2, b: 0.32 });
    // North arrow.
    arc(9.5, 9.5, 1.6, 0, Math.PI * 2, 0.035, 0.12, 0.3, 40);
    S.push({ pts: [[9.5, 7.6], [9.5, 11.4]], w: 0.04, a: 0.2, b: 0.3 });
    S.push({ pts: [[8.9, 10.6], [9.5, 11.4], [10.1, 10.6]], w: 0.04, a: 0.26, b: 0.32 });
    // Dimension line along the front.
    S.push({ pts: [[-8, 2.2], [8, 2.2]], w: 0.025, a: 0.3, b: 0.45 });
    S.push({ pts: [[-8, 1.6], [-8, 2.8]], w: 0.025, a: 0.3, b: 0.33 });
    S.push({ pts: [[8, 1.6], [8, 2.8]], w: 0.025, a: 0.42, b: 0.45 });

    // The building itself.
    const wall = 0.16;
    S.push({ pts: [[-2, 0], [-8, 0], [-8, -44], [8, -44], [8, 0], [2, 0]], w: wall, a: 0.32, b: 0.72 });
    for (const z of [-7.5, -14.5, -21.5, -28.5]) {
      S.push({ pts: [[-8, z], [-4.8, z]], w: wall * 0.8, a: 0.55, b: 0.68 });
      S.push({ pts: [[8, z], [4.8, z]], w: wall * 0.8, a: 0.57, b: 0.7 });
    }
    arc(CORE.x, CORE.z, CORE_R, 0, Math.PI * 2, wall, 0.6, 0.86, 64);
    arc(CORE.x, CORE.z, HELIX_R, 0, Math.PI * 2, 0.03, 0.7, 0.9, 64);
    // Door swings and a dimension down the long side.
    arc(-2, 0, 2, Math.PI / 2, Math.PI, 0.03, 0.66, 0.74, 16);
    arc(2, 0, 2, -Math.PI / 2, -Math.PI, 0.03, 0.66, 0.74, 16);
    S.push({ pts: [[10.4, 0], [10.4, -44]], w: 0.025, a: 0.72, b: 0.95 });
    S.push({ pts: [[9.8, 0], [11, 0]], w: 0.025, a: 0.72, b: 0.75 });
    S.push({ pts: [[9.8, -44], [11, -44]], w: 0.025, a: 0.92, b: 0.95 });
    // Inlaid line down the nave: where the thread will run.
    S.push({ pts: [[0, 2], [0, -30]], w: 0.03, a: 0.74, b: 1.0, dash: 0.6 });

    const P: number[] = [];
    const O: number[] = [];
    const I: number[] = [];
    let v = 0;
    const quad = (x1: number, z1: number, x2: number, z2: number, w: number, o1: number, o2: number) => {
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.hypot(dx, dz) || 1;
      const nx = (-dz / len) * (w / 2), nz = (dx / len) * (w / 2);
      // Extend each quad by half a width so polyline corners close.
      const ex = (dx / len) * (w / 2), ez = (dz / len) * (w / 2);
      P.push(x1 + nx - ex, 0, z1 + nz - ez, x1 - nx - ex, 0, z1 - nz - ez, x2 + nx + ex, 0, z2 + nz + ez, x2 - nx + ex, 0, z2 - nz + ez);
      O.push(o1, o1, o2, o2);
      I.push(v, v + 1, v + 2, v + 2, v + 1, v + 3);
      v += 4;
    };
    for (const s of S) {
      const lens = [0];
      for (let i = 1; i < s.pts.length; i++) lens.push(lens[i - 1] + Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1]));
      const L = lens[lens.length - 1] || 1;
      const ord = (d: number) => s.a + (s.b - s.a) * (d / L);
      for (let i = 1; i < s.pts.length; i++) {
        const [x1, z1] = s.pts[i - 1], [x2, z2] = s.pts[i];
        if (!s.dash) {
          quad(x1, z1, x2, z2, s.w, ord(lens[i - 1]), ord(lens[i]));
          continue;
        }
        const seg = lens[i] - lens[i - 1];
        for (let d = 0; d < seg; d += s.dash * 2) {
          const e = Math.min(d + s.dash, seg);
          const f1 = d / seg, f2 = e / seg;
          quad(x1 + (x2 - x1) * f1, z1 + (z2 - z1) * f1, x1 + (x2 - x1) * f2, z1 + (z2 - z1) * f2, s.w, ord(lens[i - 1] + d), ord(lens[i - 1] + e));
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
    geo.setAttribute("aOrder", new THREE.Float32BufferAttribute(O, 1));
    geo.setIndex(I);

    this.strokeU = { ...this.fog, uDraw: { value: 0 }, uColor: { value: new THREE.Color(HEX.gold) }, uHot: { value: new THREE.Color(HEX.cream) } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.strokeU,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      vertexShader: /* glsl */ `
        attribute float aOrder;
        varying float vOrder;
        varying vec3 vW;
        void main() {
          vOrder = aOrder;
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${FOG_GLSL}
        uniform float uDraw;
        uniform vec3 uColor, uHot;
        varying float vOrder;
        varying vec3 vW;
        void main() {
          if (vOrder > uDraw) discard;
          // The last stretch behind the pen is still wet: hotter and brighter.
          float wet = (1.0 - smoothstep(0.0, 0.03, uDraw - vOrder)) * step(uDraw, 0.999);
          vec3 col = mix(uColor * 0.9, uHot * 2.2, wet);
          col = mix(col, uFogColor, fogFactor(vW));
          gl_FragColor = vec4(col, 1.0);
          ${OUT_GLSL}
        }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.012;
    this.scene.add(mesh);
  }

  /** The cartouche in the corner of the sheet, set in real type on a canvas. */
  private buildTitleBlock() {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 640;
    const g = c.getContext("2d")!;
    const gold = "#C9974A";
    g.strokeStyle = gold;
    g.fillStyle = gold;
    g.lineWidth = 4;
    g.strokeRect(8, 8, 1008, 624);
    g.lineWidth = 2;
    for (const y of [200, 330, 460]) {
      g.beginPath();
      g.moveTo(8, y);
      g.lineTo(1016, y);
      g.stroke();
    }
    g.beginPath();
    g.moveTo(560, 330);
    g.lineTo(560, 632);
    g.stroke();
    g.font = "800 92px Montserrat, Arial, sans-serif";
    g.fillText("Steyl.", 48, 140);
    g.font = "500 30px Poppins, Arial, sans-serif";
    const rows: [string, number, number][] = [
      ["PROJECT", 48, 250], ["Jouw website, met alles erachter", 48, 300],
      ["SCHAAL", 48, 380], ["1:1, tot op de pixel", 48, 430],
      ["BLAD", 600, 380], ["01 van 01", 600, 430],
      ["GETEKEND", 48, 510], ["SteylVisuals", 48, 560],
      ["STATUS", 600, 510], ["In opbouw", 600, 560],
    ];
    for (const [s, x, y] of rows) {
      g.globalAlpha = s === s.toUpperCase() ? 0.6 : 1;
      g.fillText(s, x, y);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.titleMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4), this.titleMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(11.6, 0.02, 17.6);
    this.scene.add(m);
  }

  private buildBuilding() {
    const glass = new THREE.MeshStandardMaterial({
      color: 0x2b2019, transparent: true, opacity: 0.34, roughness: 0.12, metalness: 0.65,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const brass = new THREE.MeshStandardMaterial({ color: HEX.gold, metalness: 0.9, roughness: 0.3, emissive: HEX.gold, emissiveIntensity: 0.06 });
    const edge = this.lineMat(HEX.goldLight, 1.3, 0.85);

    const [r0, r1] = BEAT.rise;
    const wall = (x1: number, z1: number, x2: number, z2: number, h: number, start: number) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const geo = new THREE.BoxGeometry(len, h, 0.14).translate(0, h / 2, 0);
      const g = new THREE.Group();
      const m = new THREE.Mesh(geo, glass);
      g.add(m, this.edges(geo, edge));
      g.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
      g.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      g.visible = false;
      this.scene.add(g);
      this.walls.push({ g, start, dur: 0.55 });
    };
    const span = r1 - r0 - 0.9;
    wall(-8, 0, -2, 0, WALL_H, r0);
    wall(2, 0, 8, 0, WALL_H, r0 + 0.04);
    wall(-8, 0, -8, -44, WALL_H, r0 + span * 0.15);
    wall(8, 0, 8, -44, WALL_H, r0 + span * 0.2);
    wall(-8, -44, 8, -44, WALL_H, r0 + span * 0.35);
    [-7.5, -14.5, -21.5, -28.5].forEach((z, i) => {
      wall(-8, z, -4.8, z, WALL_H, r0 + span * (0.3 + i * 0.12));
      wall(8, z, 4.8, z, WALL_H, r0 + span * (0.34 + i * 0.12));
    });
    // Brass columns at the corners and along the long walls.
    for (const x of [-8, 8]) {
      for (let z = 0; z >= -44; z -= 7.33) {
        const geo = new THREE.BoxGeometry(0.28, WALL_H + 0.2, 0.28).translate(0, (WALL_H + 0.2) / 2, 0);
        const g = new THREE.Group();
        g.add(new THREE.Mesh(geo, brass));
        g.position.set(x, 0, z);
        g.visible = false;
        this.scene.add(g);
        this.walls.push({ g, start: r0 + 0.1 + (-z / 44) * span * 0.6, dur: 0.4 });
      }
    }

    // The core: a glass tower with brass ribs and rings, the last thing to rise.
    const tower = new THREE.Group();
    const shell = new THREE.CylinderGeometry(CORE_R, CORE_R, TOWER_H, 64, 1, true).translate(0, TOWER_H / 2, 0);
    tower.add(new THREE.Mesh(shell, glass));
    const ribs = 18;
    for (let i = 0; i < ribs; i++) {
      const a = ((i + 0.5) / ribs) * Math.PI * 2;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.1, TOWER_H, 0.1).translate(0, TOWER_H / 2, 0), brass);
      rib.position.set(Math.sin(a) * CORE_R, 0, Math.cos(a) * CORE_R);
      tower.add(rib);
    }
    for (const y of [WALL_H, 12, 18, TOWER_H]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(CORE_R, 0.06, 6, 96), brass);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      tower.add(ring);
    }
    tower.position.copy(CORE);
    tower.visible = false;
    this.scene.add(tower);
    this.walls.push({ g: tower, start: r0 + span * 0.55, dur: 0.9 });

    // Roof: a glass slab with a round opening for the tower, fades in last.
    const shape = new THREE.Shape([new THREE.Vector2(-8, 0), new THREE.Vector2(8, 0), new THREE.Vector2(8, 44), new THREE.Vector2(-8, 44)]);
    const hole = new THREE.Path();
    hole.absarc(0, 36, CORE_R + 0.05, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const roofGeo = new THREE.ShapeGeometry(shape, 48);
    roofGeo.rotateX(-Math.PI / 2);
    this.roofMat = glass.clone();
    this.roofMat.opacity = 0;
    this.roofEdge = this.lineMat(HEX.goldLight, 1.3, 0);
    const roof = new THREE.Group();
    roof.add(new THREE.Mesh(roofGeo, this.roofMat), this.edges(roofGeo, this.roofEdge));
    roof.position.y = WALL_H;
    this.scene.add(roof);
  }

  /**
   * The building as it will be, sketched in the air before a single wall
   * stands: dashed, faint, gone once the real thing has risen through it.
   */
  private buildGhost() {
    const P: number[] = [];
    const seg = (a: THREE.Vector3, b: THREE.Vector3) => P.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const box: [number, number][] = [[-8, 0], [8, 0], [8, -44], [-8, -44]];
    for (let i = 0; i < 4; i++) {
      const [x1, z1] = box[i], [x2, z2] = box[(i + 1) % 4];
      seg(V(x1, WALL_H, z1), V(x2, WALL_H, z2));
      seg(V(x1, 0, z1), V(x1, WALL_H, z1));
    }
    const n = 48;
    for (const y of [0, WALL_H, 12, 18, TOWER_H]) {
      for (let i = 0; i < n; i++) {
        const a1 = (i / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2;
        seg(V(CORE.x + Math.sin(a1) * CORE_R, y, CORE.z + Math.cos(a1) * CORE_R), V(CORE.x + Math.sin(a2) * CORE_R, y, CORE.z + Math.cos(a2) * CORE_R));
      }
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x = CORE.x + Math.sin(a) * CORE_R, z = CORE.z + Math.cos(a) * CORE_R;
      seg(V(x, 0, z), V(x, TOWER_H, z));
    }
    const geo = new LineSegmentsGeometry();
    geo.setPositions(P);
    this.ghostMat = new LineMaterial({ color: HEX.goldLight, linewidth: 1, transparent: true, opacity: 0.3, dashed: true, dashSize: 0.5, gapSize: 0.45, worldUnits: false });
    this.lineMats.push(this.ghostMat);
    const ghost = new LineSegments2(geo, this.ghostMat);
    ghost.computeLineDistances();
    this.scene.add(ghost);
  }

  private buildScreens() {
    const loader = new THREE.TextureLoader();
    const frame = this.lineMat(HEX.gold, 1.6, 1);
    const backing = new THREE.MeshStandardMaterial({ color: 0x120e0b, roughness: 0.6, metalness: 0.3 });
    BAYS.forEach((bay, i) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      loader.load(bay.src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        mat.map = tex;
        mat.needsUpdate = true;
      });
      const g = new THREE.Group();
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(5.44, 3.4), mat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(5.74, 3.7, 0.12), backing);
      back.position.z = -0.08;
      const rectGeo = new THREE.PlaneGeometry(5.74, 3.7);
      const outline = this.edges(rectGeo, frame);
      outline.position.z = 0.01;
      g.add(back, screen, outline);
      const side = bay.side;
      g.position.set(side * 7.55, 2.7, bay.z);
      g.rotation.y = side < 0 ? Math.PI / 2 - 0.35 : -Math.PI / 2 + 0.35;
      this.scene.add(g);

      const light = new THREE.PointLight(HEX.goldLight, 0, 11, 1.8);
      light.position.set(side * 5.4, 2.6, bay.z + 0.6);
      this.scene.add(light);
      g.visible = false;
      this.screens.push({ g, mat, light, at: BEAT.bays[i] });
    });
  }

  private buildThread() {
    const pts: THREE.Vector3[] = [];
    for (let z = 3; z >= -30; z -= 3) pts.push(new THREE.Vector3(0, 0.035, z));
    pts.push(new THREE.Vector3(0, 0.25, -32.2));
    const turns = 1.5;
    const steps = 72;
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const a = f * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.sin(a) * HELIX_R, 0.6 + f * 22.4, CORE.z + Math.cos(a) * HELIX_R));
    }
    pts.push(new THREE.Vector3(0, TOWER_H + 0.6, CORE.z));
    this.thread = new THREE.CatmullRomCurve3(pts, false, "centripetal");

    // Where along the thread (by length) the climb starts.
    for (let u = 0; u <= 1; u += 0.0005) {
      if (this.thread.getPointAt(u).y > 0.55) {
        this.uCore = u;
        break;
      }
    }

    this.threadU = {
      ...this.fog,
      uPulse: { value: 0 },
      uLit: { value: 0 },
      uReveal: { value: -1 },
      uBrass: { value: new THREE.Color(HEX.brown) },
      uGold: { value: new THREE.Color(HEX.gold) },
      uHot: { value: new THREE.Color(HEX.cream) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.threadU,
      vertexShader: WORLD_VERT,
      fragmentShader: /* glsl */ `
        ${FOG_GLSL}
        uniform float uPulse, uLit, uReveal;
        uniform vec3 uBrass, uGold, uHot;
        varying vec2 vUv;
        varying vec3 vW;
        void main() {
          if (vW.y > uReveal) discard;
          float u = vUv.x;
          float behind = step(u, uPulse);
          float head = exp(-pow((u - uPulse) * 90.0, 2.0)) * uLit;
          float trail = behind * (0.45 + 0.55 * exp((u - uPulse) * 18.0)) * uLit;
          vec3 col = uBrass * 0.9 + uGold * trail * 0.95 + uHot * head * 2.4;
          col = mix(col, uFogColor, fogFactor(vW) * 0.7);
          gl_FragColor = vec4(col, 1.0);
          ${OUT_GLSL}
        }`,
    });
    this.scene.add(new THREE.Mesh(new THREE.TubeGeometry(this.thread, 900, 0.055, 8, false), mat));

    // One ring per step of the automation, where the pulse is at that step's beat.
    BEAT.stages.forEach((t) => {
      const u = this.pulseU(t);
      const p = this.thread.getPointAt(u);
      const tan = this.thread.getTangentAt(u);
      const mat = new THREE.MeshStandardMaterial({ color: HEX.gold, metalness: 1, roughness: 0.3, emissive: HEX.gold, emissiveIntensity: 0.05 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 12, 64), mat);
      ring.position.copy(p);
      ring.lookAt(p.clone().add(tan));
      this.scene.add(ring);
      this.nodes.push({ mesh: ring, mat, u });
    });

    // The pulse head: a soft sprite plus a real light, so it lights the tower as it climbs.
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,244,225,1)");
    grad.addColorStop(0.25, "rgba(230,200,148,0.55)");
    grad.addColorStop(1, "rgba(201,151,74,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.orb = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
    this.orb.scale.setScalar(0.7);
    this.scene.add(this.orb);
    this.orbLight = new THREE.PointLight(HEX.goldLight, 0, 9, 1.5);
    this.scene.add(this.orbLight);
  }

  private buildDust() {
    const n = this.opts.mobile ? 260 : 620;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 34;
      pos[i * 3 + 1] = Math.random() * 14 + 0.2;
      pos[i * 3 + 2] = 24 - Math.random() * 72;
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    this.dustU = { uTime: { value: 0 }, uColor: { value: new THREE.Color(HEX.goldLight) }, uScale: { value: 1 }, uAlpha: { value: 0.5 } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.dustU,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime, uScale;
        varying float vA;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.11 + aSeed * 40.0) * 0.6;
          p.y += sin(uTime * 0.07 + aSeed * 90.0) * 0.4;
          p.z += cos(uTime * 0.09 + aSeed * 20.0) * 0.6;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (2.0 + aSeed * 3.0) * uScale * (12.0 / -mv.z);
          vA = 0.25 + 0.75 * fract(aSeed * 7.31);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uAlpha;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vA * uAlpha;
          gl_FragColor = vec4(uColor * a, a);
        }`,
    });
    this.scene.add(new THREE.Points(geo, mat));
  }

  /** Camera keyframes. Leg 4 is sampled from the pulse so the camera chases it. */
  private buildKeys() {
    const K = (t: number, p: [number, number, number], q: [number, number, number], linger = 0) =>
      this.keys.push({ t, p: new THREE.Vector3(...p), q: new THREE.Vector3(...q), linger });

    // Leg 1: low over the paper, then lifting to see the whole plan.
    K(0, [3.2, 3.4, 27], [-0.6, 0, 13]);
    K(0.8, [1.4, 5.2, 23], [0, 0, 6], 0.2);
    K(1.6, [0, 14, 21], [0, 0, -13], 0.3);
    // Leg 2: swing round to a three-quarter view while it rises, then to the door.
    K(2.5, [-17, 11, 11], [0, 2.5, -16]);
    K(3.25, [-8, 5.2, 11], [0, 3, -14], 0.2);
    K(3.8, [0, 2.4, 6.5], [0, 2.4, -10], 0.3);
    // Leg 3: hold on each room, standing on the far side of the nave.
    BAYS.forEach((b, i) => {
      K(BEAT.bays[i], [-b.side * 1.7, 2.45, b.z + 5.6], [b.side * 7.5, 2.55, b.z - 0.4], 0.75);
    });
    // Into the core, then the silence.
    K(6.4, [0, 2.3, -24.5], [0, 3.2, -36], 0.4);
    K(7.0, [0, 2.6, -27.6], [0, 4, -36], 0.2);
    // Leg 4: chase the pulse up the helix.
    const [c0, c1] = BEAT.climb;
    for (let i = 0; i <= 10; i++) {
      const t = c0 + ((c1 - c0) * i) / 10;
      const p = this.thread.getPointAt(this.pulseU(t));
      // Ahead of the pulse, on the outside of the helix, looking back down at
      // it: the lit trail runs away from the lens instead of past it.
      const a = Math.atan2(p.x - CORE.x, p.z - CORE.z) + 0.75;
      K(t, [CORE.x + Math.sin(a) * 4.9, p.y + 1.9, CORE.z + Math.cos(a) * 4.9], [p.x, p.y, p.z]);
    }
    // Out of the top of the tower and back, to see the whole thing at dawn.
    K(10.3, [6, 29, -25], [0, 21, -36], 0.2);
    K(11.4, [26, 14, 14], [-11, 5, -24], 0.4);
  }

  /* --------------------------------------------------------------- update */

  /** Where the pulse is along the thread (0 to 1, by length) at track time t. */
  pulseU(t: number) {
    const [f0, f1] = BEAT.floorRun;
    const [c0, c1] = BEAT.climb;
    if (t <= f0) return 0;
    if (t <= f1) return this.uCore * Math.pow((t - f0) / (f1 - f0), 1.4);
    return this.uCore + (1 - this.uCore) * clamp01((t - c0) / (c1 - c0));
  }

  private cameraAt(t: number) {
    const k = this.keys;
    const n = k.length;
    if (t <= k[0].t) {
      this.pos.copy(k[0].p);
      this.tgt.copy(k[0].q);
      return;
    }
    if (t >= k[n - 1].t) {
      this.pos.copy(k[n - 1].p);
      this.tgt.copy(k[n - 1].q);
      return;
    }
    let i = 0;
    while (i < n - 2 && t > k[i + 1].t) i++;
    const a = k[i], b = k[i + 1];
    let u = (t - a.t) / (b.t - a.t);
    // Linger: slow into and out of a keyframe that asks for it.
    const lin = Math.max(a.linger, b.linger);
    const e = u * u * u * (u * (u * 6 - 15) + 10);
    u = u + (e - u) * lin;
    const p0 = k[Math.max(0, i - 1)], p3 = k[Math.min(n - 1, i + 2)];
    cr(p0.p, a.p, b.p, p3.p, u, this.pos);
    cr(p0.q, a.q, b.q, p3.q, u, this.tgt);
  }

  update(t: number, time: number, pointer: { x: number; y: number }) {
    const [d0, d1] = BEAT.draw;
    this.strokeU.uDraw.value = clamp01((t - d0) / (d1 - d0)) * 1.0001;
    this.titleMat.opacity = smooth(0.25, 0.9, t) * 0.9;

    this.ghostMat.opacity = 0.3 * (1 - smooth(BEAT.rise[0] + 0.2, BEAT.rise[1] - 0.2, t));
    for (const w of this.walls) {
      const s = easeOut((t - w.start) / w.dur);
      w.g.visible = s > 0.002;
      w.g.scale.y = Math.max(s, 0.002);
    }
    const roof = smooth(BEAT.rise[1] - 0.35, BEAT.rise[1] + 0.15, t);
    this.roofMat.opacity = roof * 0.2;
    this.roofEdge.opacity = roof * 0.7;

    // Screens power on as the camera reaches each room.
    const pools = this.groundU.uPools.value as THREE.Vector4[];
    const hung = easeOut((t - (BEAT.rise[1] - 0.3)) / 0.45);
    this.screens.forEach((s, i) => {
      s.g.visible = hung > 0.002;
      s.g.scale.setScalar(Math.max(hung, 0.002));
      const on = smooth(s.at - 0.75, s.at - 0.3, t);
      s.mat.color.setScalar(0.06 + on * 0.84);
      s.light.intensity = on * 26;
      const b = BAYS[i];
      pools[i].set(b.side * 6.2, b.z, 3.6, on * 0.85);
    });

    // The lead.
    const pu = this.pulseU(t);
    const live = smooth(BEAT.floorRun[0] - 0.05, BEAT.floorRun[0] + 0.05, t);
    this.threadU.uPulse.value = pu;
    this.threadU.uLit.value = live;
    const head = this.thread.getPointAt(Math.min(pu, 1));
    this.orb.position.copy(head);
    (this.orb.material as THREE.SpriteMaterial).opacity = live * 0.75 * (1 - smooth(BEAT.climb[1], BEAT.dawn[1], t) * 0.6);
    this.orbLight.position.copy(head);
    this.orbLight.intensity = live * 12;
    const tower = this.walls[this.walls.length - 1];
    const towerS = easeOut((t - tower.start) / tower.dur);
    const reveal = t < BEAT.draw[1] - 0.2 ? -1 : 0.2 + towerS * (TOWER_H + 1.5);
    this.threadU.uReveal.value = reveal;
    for (const n of this.nodes) {
      n.mesh.visible = n.mesh.position.y < reveal;
      const lit = smooth(n.u - 0.004, n.u + 0.02, pu);
      n.mat.emissiveIntensity = 0.05 + lit * 1.6;
    }
    const coreGlow = smooth(BEAT.silence[0] - 0.4, BEAT.silence[0], t) * 0.25 + live * 0.75;
    this.coreLight.intensity = coreGlow * 26;
    pools[4].set(CORE.x, CORE.z, 6.5, coreGlow * 1.1);
    pools[5].set(0, 1.5, 3.2, smooth(2.8, 3.6, t) * 0.5 * (1 - smooth(6.4, 7, t)));

    // Lamp over the drawing, then the room lights take over, then the sun.
    const dawn = smooth(BEAT.dawn[0], BEAT.dawn[1], t);
    const travel = smooth(0.8, 3.2, t);
    this.groundU.uLamp.value.set(-1, 15 - travel * 27, 11 + travel * 10);
    this.groundU.uLampI.value = (1 - travel * 0.55) * (1 - dawn);
    this.groundU.uDawn.value = dawn;
    this.skyU.uDawn.value = dawn;
    this.sun.intensity = dawn * 2.6;
    this.hemi.intensity = 0.7 + dawn * 0.8;

    this.tmpC.copy(this.nightC).lerp(this.dawnC, dawn * 0.85);
    (this.scene.background as THREE.Color).copy(this.tmpC);
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color.copy(this.tmpC);
    const inside = smooth(3.4, 4.0, t) * (1 - smooth(9.4, 10.2, t));
    fog.density = 0.028 - inside * 0.006 - dawn * 0.017;
    this.fog.uFogColor.value.copy(this.tmpC);
    this.fog.uFogDensity.value = fog.density;

    this.dustU.uTime.value = time;
    this.dustU.uAlpha.value = 0.45 + live * 0.25;

    // Camera.
    this.cameraAt(t);
    const follow = smooth(7.2, 7.45, t) * (1 - smooth(9.55, 9.95, t));
    this.look.copy(this.tgt).lerp(head, follow);
    if (!this.opts.reduced) {
      this.look.x += pointer.x * 0.45;
      this.look.y += pointer.y * 0.25;
    }
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  cameraXZ() {
    return { x: this.camera.position.x, z: this.camera.position.z };
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Portrait screens need a wider lens to keep the same world in frame.
    this.camera.fov = w / h < 0.8 ? 66 : w / h < 1.2 ? 58 : 50;
    // The closing shot puts the building beside the copy on a wide screen and
    // above it on a tall one.
    const last = this.keys[this.keys.length - 1];
    if (w / h < 0.8) last.q.set(-3, 3, -20);
    else last.q.set(-11, 5, -24);
    this.camera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    this.composer?.setSize(w, h);
    this.composer?.setPixelRatio(pr);
    this.bloom?.resolution.set(w * pr * 0.5, h * pr * 0.5);
    for (const m of this.lineMats) m.resolution.set(w * pr, h * pr);
    this.dustU.uScale.value = pr * (h / 900);
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) {
        for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
        mat.dispose();
      }
    });
    this.scene.environment?.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
  }
}

function cr(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, u: number, out: THREE.Vector3) {
  const u2 = u * u, u3 = u2 * u;
  out.set(
    0.5 * (2 * p1.x + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
    0.5 * (2 * p1.y + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3),
    0.5 * (2 * p1.z + (-p0.z + p2.z) * u + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * u2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * u3),
  );
}
