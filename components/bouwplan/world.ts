import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { BAYS, BEAT, smooth } from "./track";

/**
 * The world the homepage flies through, rendered live. It opens on a studio
 * desk where a laptop builds a real client site, walks through the gallery of
 * client rooms, and ends at an office desk in the tower where a phone and a
 * CRM screen show a lead being handled overnight.
 *
 * The device screens are real HTML, placed in the scene with a CSS3D layer
 * that follows the WebGL camera, so their type stays crisp and readable.
 * Everything is a function of `t` (see track.ts).
 */

const HEX = {
  night: 0x0d0b09,
  floor: 0x17130f,
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
const DESK_H = 0.75;
// CSS transforms lose precision at metre scale, so the CSS layer runs at x100.
const CSS_SCALE = 100;

export const STUDIO = new THREE.Vector3(0.55, 0, 6.15);
export const OFFICE = new THREE.Vector3(0, 0, -36.1);

type Key = { t: number; p: THREE.Vector3; q: THREE.Vector3; linger: number; close: boolean };

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
export type ScreenId = "laptop" | "studioPhone" | "monitor" | "officePhone";

type Screen = { el: HTMLDivElement; obj: CSS3DObject; anchor: THREE.Object3D; from: number; to: number };

export class BouwplanWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private bloom: UnrealBloomPass | null = null;
  private css: CSS3DRenderer;
  private cssScene = new THREE.Scene();
  private cssCamera = new THREE.PerspectiveCamera();
  private lineMats: LineMaterial[] = [];
  private fog = { uFogColor: { value: new THREE.Color(HEX.night) }, uFogDensity: { value: 0.03 } };

  private groundU!: Record<string, THREE.IUniform>;
  private skyU!: Record<string, THREE.IUniform>;
  private dustU!: Record<string, THREE.IUniform>;

  private bays: { g: THREE.Group; mat: THREE.MeshBasicMaterial; light: THREE.PointLight; at: number }[] = [];
  private screens = new Map<ScreenId, Screen>();
  private laptopGlow!: THREE.PointLight;
  private studioPhoneGlow!: THREE.PointLight;
  private monitorGlow!: THREE.PointLight;
  private officePhoneGlow!: THREE.PointLight;
  private sun!: THREE.DirectionalLight;
  private hemi!: THREE.HemisphereLight;
  private keys: Key[] = [];
  private portrait = false;

  private pos = new THREE.Vector3();
  private tgt = new THREE.Vector3();
  private look = new THREE.Vector3();
  private nightC = new THREE.Color(HEX.night);
  private dawnC = new THREE.Color(HEX.dawn);
  private tmpC = new THREE.Color();
  private tmpV = new THREE.Vector3();
  private tmpQ = new THREE.Quaternion();

  constructor(canvas: HTMLCanvasElement, cssHost: HTMLElement, private opts: WorldOptions) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setClearColor(HEX.night, 1);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.02, 400);
    this.scene.background = new THREE.Color(HEX.night);
    this.scene.fog = new THREE.FogExp2(HEX.night, 0.03);

    this.css = new CSS3DRenderer();
    this.css.domElement.style.position = "absolute";
    this.css.domElement.style.inset = "0";
    this.css.domElement.style.pointerEvents = "none";
    cssHost.appendChild(this.css.domElement);

    // A soft studio reflection so brass, glass and aluminium have something to catch.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.32;
    pmrem.dispose();

    this.buildLights();
    this.buildSky();
    this.buildGround();
    this.buildBuilding();
    this.buildBays();
    this.buildStudio();
    this.buildOffice();
    this.buildDust();
    this.buildKeys();

    if (!opts.mobile) {
      const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
      this.composer = new EffectComposer(this.renderer, rt);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.55, 0.9);
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    }
  }

  /** The HTML containers for each device screen; React renders into them. */
  screenHosts(): Record<ScreenId, HTMLElement> {
    const out = {} as Record<ScreenId, HTMLElement>;
    this.screens.forEach((s, id) => (out[id] = s.el));
    return out;
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

  /**
   * A device screen: an anchor in the WebGL scene (so it moves with its
   * device) mirrored by a CSS3D object holding real HTML.
   */
  private screen(id: ScreenId, parent: THREE.Object3D, local: THREE.Vector3, pxW: number, pxH: number, metresW: number, from: number, to: number) {
    const anchor = new THREE.Object3D();
    anchor.position.copy(local);
    parent.add(anchor);
    const el = document.createElement("div");
    el.style.width = `${pxW}px`;
    el.style.height = `${pxH}px`;
    el.style.overflow = "hidden";
    el.style.background = "#050404";
    el.style.backfaceVisibility = "hidden";
    const obj = new CSS3DObject(el);
    el.style.pointerEvents = "none";
    obj.scale.setScalar((metresW * CSS_SCALE) / pxW);
    this.cssScene.add(obj);
    this.screens.set(id, { el, obj, anchor, from, to });
  }

  private buildLights() {
    this.hemi = new THREE.HemisphereLight(0x5a4030, 0x0d0b09, 0.7);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffc88a, 0);
    this.sun.position.set(-30, 18, -70);
    this.scene.add(this.sun);
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
      vertexShader: WORLD_VERT,
      fragmentShader: /* glsl */ `
        uniform vec3 uNight, uDawnTop, uDawnLow;
        uniform float uDawn;
        varying vec3 vW;
        void main() {
          vec3 d = normalize(vW - cameraPosition);
          float h = clamp(d.y, -0.2, 1.0);
          float east = pow(max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(-0.45, 0.0, -1.0))), 0.0), 3.0);
          float horizon = exp(-max(h, 0.0) * 7.0);
          vec3 dawn = mix(uDawnTop, uDawnLow, horizon * (0.35 + 0.65 * east));
          gl_FragColor = vec4(mix(uNight, dawn, uDawn), 1.0);
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
      uFloor: { value: new THREE.Color(HEX.floor) },
      uLine: { value: new THREE.Color(HEX.gold) },
      uWarm: { value: new THREE.Color(HEX.goldLight) },
      uPools: { value: pools },
      uDawn: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.groundU,
      vertexShader: WORLD_VERT,
      fragmentShader: /* glsl */ `
        ${FOG_GLSL}
        uniform vec3 uFloor, uLine, uWarm;
        uniform float uDawn;
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
          // Polished concrete with a faint tile joint every metre.
          float g = grid(p, 1.0) * 0.05;
          float pools = 0.0;
          for (int i = 0; i < 6; i++) {
            vec2 d = p - uPools[i].xy;
            pools += exp(-dot(d, d) / (uPools[i].z * uPools[i].z)) * uPools[i].w;
          }
          float light = 0.42 + pools + uDawn * 0.6;
          vec3 col = uFloor * light + uLine * g * (0.25 + pools * 0.6 + uDawn * 0.4);
          col += uWarm * pools * 0.05;
          col += (hash(floor(p * 60.0)) - 0.5) * 0.012 * light;
          col = mix(col, uFogColor, fogFactor(vW));
          gl_FragColor = vec4(col, 1.0);
          ${OUT_GLSL}
        }`,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat);
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
  }

  private buildBuilding() {
    const glass = new THREE.MeshStandardMaterial({
      color: 0x2b2019, transparent: true, opacity: 0.34, roughness: 0.12, metalness: 0.65,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const brass = new THREE.MeshStandardMaterial({ color: HEX.gold, metalness: 0.9, roughness: 0.3, emissive: HEX.gold, emissiveIntensity: 0.06 });
    const edge = this.lineMat(HEX.goldLight, 1.3, 0.85);

    const wall = (x1: number, z1: number, x2: number, z2: number) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const geo = new THREE.BoxGeometry(len, WALL_H, 0.14).translate(0, WALL_H / 2, 0);
      const g = new THREE.Group();
      g.add(new THREE.Mesh(geo, glass), this.edges(geo, edge));
      g.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
      g.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      this.scene.add(g);
    };
    wall(-8, 0, -2, 0);
    wall(2, 0, 8, 0);
    wall(-8, 0, -8, -44);
    wall(8, 0, 8, -44);
    wall(-8, -44, 8, -44);
    for (const z of [-7.5, -14.5, -21.5, -28.5]) {
      wall(-8, z, -4.8, z);
      wall(8, z, 4.8, z);
    }
    for (const x of [-8, 8]) {
      for (let z = 0; z >= -44; z -= 7.33) {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.28, WALL_H + 0.2, 0.28).translate(0, (WALL_H + 0.2) / 2, 0), brass);
        col.position.set(x, 0, z);
        this.scene.add(col);
      }
    }

    // The tower: a glass drum with brass ribs. The office sits at its foot.
    const tower = new THREE.Group();
    tower.add(new THREE.Mesh(new THREE.CylinderGeometry(CORE_R, CORE_R, TOWER_H, 64, 1, true).translate(0, TOWER_H / 2, 0), glass));
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
    this.scene.add(tower);

    const shape = new THREE.Shape([new THREE.Vector2(-8, 0), new THREE.Vector2(8, 0), new THREE.Vector2(8, 44), new THREE.Vector2(-8, 44)]);
    const hole = new THREE.Path();
    hole.absarc(0, 36, CORE_R + 0.05, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const roofGeo = new THREE.ShapeGeometry(shape, 48);
    roofGeo.rotateX(-Math.PI / 2);
    const roofMat = glass.clone();
    roofMat.opacity = 0.2;
    const roof = new THREE.Group();
    roof.add(new THREE.Mesh(roofGeo, roofMat), this.edges(roofGeo, this.lineMat(HEX.goldLight, 1.3, 0.7)));
    roof.position.y = WALL_H;
    this.scene.add(roof);
  }

  private buildBays() {
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
      const back = new THREE.Mesh(new THREE.BoxGeometry(5.74, 3.7, 0.12), backing);
      back.position.z = -0.08;
      const outline = this.edges(new THREE.PlaneGeometry(5.74, 3.7), frame);
      outline.position.z = 0.01;
      g.add(back, new THREE.Mesh(new THREE.PlaneGeometry(5.44, 3.4), mat), outline);
      g.position.set(bay.side * 7.55, 2.7, bay.z);
      g.rotation.y = bay.side < 0 ? Math.PI / 2 - 0.35 : -Math.PI / 2 + 0.35;
      this.scene.add(g);
      const light = new THREE.PointLight(HEX.goldLight, 0, 11, 1.8);
      light.position.set(bay.side * 5.4, 2.6, bay.z + 0.6);
      this.scene.add(light);
      this.bays.push({ g, mat, light, at: BEAT.bays[i] });
    });
  }

  /* ----------------------------------------------------------- furniture */

  private deskMats() {
    return {
      wood: new THREE.MeshStandardMaterial({ color: 0x2e1f15, roughness: 0.5, metalness: 0.05 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x141210, roughness: 0.35, metalness: 0.8 }),
      alu: new THREE.MeshStandardMaterial({ color: 0x3b3834, roughness: 0.3, metalness: 0.85 }),
      glassBlack: new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.12, metalness: 0.4 }),
      ceramic: new THREE.MeshStandardMaterial({ color: 0xe9e2d7, roughness: 0.45 }),
      brass: new THREE.MeshStandardMaterial({ color: HEX.gold, metalness: 0.9, roughness: 0.3 }),
      paper: new THREE.MeshStandardMaterial({ color: 0xe8e0d2, roughness: 0.9 }),
      cover: new THREE.MeshStandardMaterial({ color: 0x1f1a16, roughness: 0.7 }),
    };
  }

  private desk(at: THREE.Vector3, w: number, d: number, m: ReturnType<BouwplanWorld["deskMats"]>) {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new RoundedBoxGeometry(w, 0.035, d, 2, 0.006), m.wood);
    top.position.y = DESK_H - 0.0175;
    g.add(top);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.03, DESK_H - 0.035, 0.03), m.steel);
        leg.position.set(sx * (w / 2 - 0.06), (DESK_H - 0.035) / 2, sz * (d / 2 - 0.06));
        g.add(leg);
      }
    }
    g.position.copy(at);
    this.scene.add(g);
    return g;
  }

  private lamp(at: THREE.Vector3, m: ReturnType<BouwplanWorld["deskMats"]>, intensity: number) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.015, 32), m.brass);
    base.position.y = 0.0075;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.42, 12), m.brass);
    pole.position.y = 0.22;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.26, 12), m.brass);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(0.13, 0.43, 0);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.09, 32, 1, true), m.brass);
    shade.material = m.brass.clone();
    (shade.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
    shade.position.set(0.26, 0.4, 0);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 8), new THREE.MeshBasicMaterial({ color: 0xfff1d6 }));
    bulb.position.set(0.26, 0.37, 0);
    const light = new THREE.PointLight(0xffd9a3, intensity, 3.5, 2);
    light.position.set(0.26, 0.34, 0);
    g.add(base, pole, arm, shade, bulb, light);
    g.position.copy(at);
    this.scene.add(g);
    return g;
  }

  private phone(at: THREE.Vector3, yaw: number, id: ScreenId, from: number, to: number, m: ReturnType<BouwplanWorld["deskMats"]>) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.0715, 0.0078, 0.147, 3, 0.0035), m.glassBlack);
    body.position.y = 0.0039;
    const rim = new THREE.Mesh(new RoundedBoxGeometry(0.0725, 0.0062, 0.148, 3, 0.0035), m.alu);
    rim.position.y = 0.0031;
    g.add(rim, body);
    g.position.copy(at);
    g.rotation.y = yaw;
    this.scene.add(g);
    // Screen faces up, its top edge pointing away from the camera.
    const local = new THREE.Vector3(0, 0.0081, 0);
    this.screen(id, g, local, 390, 844, 0.066, from, to);
    const s = this.screens.get(id)!;
    s.anchor.rotation.set(-Math.PI / 2, 0, 0);
    return g;
  }

  private buildStudio() {
    const m = this.deskMats();
    this.desk(STUDIO, 1.7, 0.8, m);
    const top = DESK_H;

    // Laptop, screen facing the camera (+z), lid leaning back.
    const laptop = new THREE.Group();
    laptop.position.set(STUDIO.x + 0.17, top, STUDIO.z - 0.03);
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.312, 0.011, 0.218, 2, 0.004), m.alu);
    base.position.y = 0.0055;
    const kc = document.createElement("canvas");
    kc.width = 512;
    kc.height = 200;
    const kg = kc.getContext("2d")!;
    kg.fillStyle = "#15130f";
    kg.fillRect(0, 0, 512, 200);
    kg.fillStyle = "#26231f";
    const rows = [14, 14, 13, 12, 9];
    rows.forEach((n, r) => {
      const kw = (500 - (n - 1) * 6) / n;
      for (let i = 0; i < n; i++) kg.fillRect(6 + i * (kw + 6), 8 + r * 38, kw, 32);
    });
    const ktex = new THREE.CanvasTexture(kc);
    ktex.colorSpace = THREE.SRGBColorSpace;
    const keys = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.105), new THREE.MeshStandardMaterial({ map: ktex, roughness: 0.6 }));
    keys.rotation.x = -Math.PI / 2;
    keys.position.set(0, 0.0112, -0.035);
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.068), new THREE.MeshStandardMaterial({ color: 0x34312d, roughness: 0.25, metalness: 0.6 }));
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, 0.0112, 0.064);
    const lid = new THREE.Group();
    lid.position.set(0, 0.011, -0.109);
    lid.rotation.x = -0.32;
    const shell = new THREE.Mesh(new RoundedBoxGeometry(0.312, 0.206, 0.006, 2, 0.003).translate(0, 0.103, 0), m.alu);
    const bezel = new THREE.Mesh(new THREE.PlaneGeometry(0.304, 0.198), m.glassBlack);
    bezel.position.set(0, 0.103, 0.0031);
    lid.add(shell, bezel);
    laptop.add(base, keys, pad, lid);
    this.scene.add(laptop);
    this.screen("laptop", lid, new THREE.Vector3(0, 0.106, 0.0034), 1280, 800, 0.29, -1, BEAT.studioOut);
    this.laptopGlow = new THREE.PointLight(0xfff4e6, 0.35, 1.6, 2);
    this.laptopGlow.position.set(laptop.position.x, top + 0.14, laptop.position.z + 0.12);
    this.scene.add(this.laptopGlow);

    this.phone(new THREE.Vector3(STUDIO.x - 0.27, top, STUDIO.z + 0.15), 0.22, "studioPhone", -1, BEAT.studioOut, m);
    this.studioPhoneGlow = new THREE.PointLight(0xfff4e6, 0, 0.8, 2);
    this.studioPhoneGlow.position.set(STUDIO.x - 0.27, top + 0.08, STUDIO.z + 0.15);
    this.scene.add(this.studioPhoneGlow);

    // A mug and a notebook, so the desk belongs to someone.
    const mug = new THREE.Group();
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.037, 0.095, 32, 1, true), m.ceramic);
    (cup.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.037, 32), m.ceramic);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.047;
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.04, 32), new THREE.MeshStandardMaterial({ color: 0x2a160b, roughness: 0.2 }));
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.03;
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.006, 10, 24, Math.PI * 1.2), m.ceramic);
    handle.position.set(0.045, 0, 0);
    handle.rotation.z = -Math.PI * 0.6;
    mug.add(cup, bottom, coffee, handle);
    mug.position.set(STUDIO.x + 0.58, top + 0.0475, STUDIO.z - 0.12);
    this.scene.add(mug);

    const book = new THREE.Group();
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.012, 0.21), m.cover);
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.144, 0.01, 0.204), m.paper);
    pages.position.x = 0.002;
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.14, 12), m.brass);
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.5;
    pen.position.set(0.01, 0.012, 0.02);
    book.add(cover, pages, pen);
    book.position.set(STUDIO.x - 0.55, top + 0.006, STUDIO.z + 0.02);
    book.rotation.y = -0.18;
    this.scene.add(book);

    this.lamp(new THREE.Vector3(STUDIO.x - 0.72, top, STUDIO.z - 0.22), m, 0.9);
  }

  private buildOffice() {
    const m = this.deskMats();
    this.desk(OFFICE, 1.5, 0.72, m);
    const top = DESK_H;

    // Monitor on the back edge, facing the chair (+z).
    const mon = new THREE.Group();
    mon.position.set(OFFICE.x, top, OFFICE.z - 0.2);
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.01, 0.17, 2, 0.004), m.alu);
    foot.position.y = 0.005;
    const neck = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.3, 0.018, 2, 0.006), m.alu);
    neck.position.set(0, 0.16, -0.04);
    const panel = new THREE.Group();
    panel.position.set(0, 0.38, -0.02);
    const shell = new THREE.Mesh(new RoundedBoxGeometry(0.644, 0.376, 0.014, 2, 0.004), m.alu);
    const glassFace = new THREE.Mesh(new THREE.PlaneGeometry(0.636, 0.368), m.glassBlack);
    glassFace.position.z = 0.0071;
    panel.add(shell, glassFace);
    mon.add(foot, neck, panel);
    this.scene.add(mon);
    this.screen("monitor", panel, new THREE.Vector3(0, 0, 0.0074), 1600, 900, 0.62, BEAT.officeIn, BEAT.officeOut);
    this.monitorGlow = new THREE.PointLight(0xf6efe4, 0, 2.4, 2);
    this.monitorGlow.position.set(OFFICE.x, top + 0.38, OFFICE.z + 0.25);
    this.scene.add(this.monitorGlow);

    this.phone(new THREE.Vector3(OFFICE.x + 0.42, top, OFFICE.z + 0.18), -0.16, "officePhone", BEAT.officeIn, BEAT.officeOut, m);
    this.officePhoneGlow = new THREE.PointLight(0xfff4e6, 0, 0.9, 2);
    this.officePhoneGlow.position.set(OFFICE.x + 0.42, top + 0.09, OFFICE.z + 0.18);
    this.scene.add(this.officePhoneGlow);

    this.lamp(new THREE.Vector3(OFFICE.x - 0.66, top, OFFICE.z - 0.18), m, 0.5);
  }

  private buildDust() {
    const n = this.opts.mobile ? 260 : 620;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 34;
      pos[i * 3 + 1] = Math.random() * 14 + 0.2;
      pos[i * 3 + 2] = 14 - Math.random() * 62;
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    this.dustU = { uTime: { value: 0 }, uColor: { value: new THREE.Color(HEX.goldLight) }, uScale: { value: 1 }, uAlpha: { value: 0.45 } };
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

  /** Camera keyframes. `close` frames are pulled back on a portrait screen. */
  private buildKeys() {
    const K = (t: number, p: [number, number, number], q: [number, number, number], linger = 0, close = false) =>
      this.keys.push({ t, p: new THREE.Vector3(...p), q: new THREE.Vector3(...q), linger, close });
    const S = STUDIO, O = OFFICE;

    // Leg 1-2: at the studio desk, the laptop on the right of frame.
    K(0, [S.x - 0.03, 0.99, S.z + 0.4], [S.x - 0.03, 0.84, S.z - 0.17], 0, true);
    K(0.8, [S.x + 0.01, 0.97, S.z + 0.3], [S.x + 0.01, 0.85, S.z - 0.17], 0, true);
    K(1.6, [S.x + 0.05, 0.95, S.z + 0.21], [S.x + 0.05, 0.855, S.z - 0.17], 0, true);
    K(2.5, [S.x + 0.07, 0.955, S.z + 0.18], [S.x + 0.07, 0.855, S.z - 0.17], 0.2, true);
    // Pull back to take in the phone as the site goes live.
    K(3.1, [S.x - 0.05, 1.2, S.z + 0.55], [S.x - 0.13, 0.78, S.z - 0.03], 0.5, true);
    K(3.35, [S.x - 0.09, 1.18, S.z + 0.5], [S.x - 0.17, 0.77, S.z], 0.6, true);
    // Up and into the building.
    K(3.8, [0.2, 2.0, 3.0], [0, 2.2, -6], 0.3);
    // Leg 3: hold on each room, standing on the far side of the nave.
    BAYS.forEach((b, i) => {
      K(BEAT.bays[i], [-b.side * 1.7, 2.45, b.z + 5.6], [b.side * 7.5, 2.55, b.z - 0.4], 0.75);
    });
    // Leg 4: into the tower office, then the silence.
    K(6.4, [0, 1.8, -27.4], [0, 1.0, O.z], 0.4);
    K(7.0, [0.15, 1.45, -32.6], [0.15, 0.95, O.z], 0.3);
    // The phone lights up.
    K(7.38, [O.x + 0.46, 1.05, O.z + 0.48], [O.x + 0.42, 0.755, O.z + 0.17], 0.6, true);
    // The screen comes on; hold while the steps run.
    K(7.9, [O.x + 0.06, 1.15, O.z + 0.6], [O.x - 0.13, 1.12, O.z - 0.22], 0.4, true);
    K(8.6, [O.x + 0.08, 1.14, O.z + 0.63], [O.x - 0.12, 1.12, O.z - 0.22], 0.3, true);
    K(9.2, [O.x + 0.1, 1.15, O.z + 0.6], [O.x - 0.11, 1.12, O.z - 0.22], 0.3, true);
    // 07:42: back to the phone.
    K(9.55, [O.x + 0.46, 1.05, O.z + 0.5], [O.x + 0.42, 0.755, O.z + 0.17], 0.5, true);
    K(9.9, [1.6, 2.4, -33.0], [0.2, 1.0, O.z], 0.2);
    // Out of the top of the tower and back, to see the whole thing at dawn.
    K(10.5, [6, 29, -25], [0, 18, -36], 0.2);
    K(11.4, [26, 14, 14], [-11, 5, -24], 0.4);
  }

  /* --------------------------------------------------------------- update */

  private cameraAt(t: number) {
    const k = this.keys;
    const n = k.length;
    let i = 0;
    if (t <= k[0].t) i = 0;
    else if (t >= k[n - 1].t) i = n - 2;
    else while (i < n - 2 && t > k[i + 1].t) i++;
    const a = k[i], b = k[i + 1];
    let u = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
    const lin = Math.max(a.linger, b.linger);
    const e = u * u * u * (u * (u * 6 - 15) + 10);
    u = u + (e - u) * lin;
    const p0 = k[Math.max(0, i - 1)], p3 = k[Math.min(n - 1, i + 2)];
    const P = (key: Key) => (this.portrait && key.close ? this.tmpV.copy(key.p).sub(key.q).multiplyScalar(1.9).add(key.q).clone() : key.p);
    cr(P(p0), P(a), P(b), P(p3), u, this.pos);
    cr(p0.q, a.q, b.q, p3.q, u, this.tgt);
  }

  update(t: number, time: number, pointer: { x: number; y: number }) {
    // Bay screens glow faintly from the start and come fully on as you reach them.
    const pools = this.groundU.uPools.value as THREE.Vector4[];
    this.bays.forEach((s, i) => {
      const on = smooth(s.at - 0.75, s.at - 0.3, t);
      s.mat.color.setScalar(0.22 + on * 0.68);
      s.light.intensity = on * 26;
      const b = BAYS[i];
      pools[i + 1].set(b.side * 6.2, b.z, 3.6, 0.15 + on * 0.7);
    });

    // Devices.
    const live = smooth(BEAT.phoneLive - 0.05, BEAT.phoneLive + 0.1, t);
    this.studioPhoneGlow.intensity = live * 0.25;
    pools[0].set(STUDIO.x - 0.1, STUDIO.z, 1.5, 0.75 * (1 - smooth(3.8, 4.4, t)));
    const notify = smooth(BEAT.stages[0] - 0.04, BEAT.stages[0] + 0.04, t);
    const morning = smooth(BEAT.stages[4] - 0.04, BEAT.stages[4] + 0.04, t);
    const flash = Math.max(notify * (1 - smooth(BEAT.stages[0] + 0.3, BEAT.stages[0] + 0.6, t)), morning);
    this.officePhoneGlow.intensity = flash * 0.35;
    const monitor = smooth(BEAT.monitorOn[0], BEAT.monitorOn[1], t);
    this.monitorGlow.intensity = monitor * 0.9;
    pools[5].set(OFFICE.x, OFFICE.z + 0.4, 2.4, 0.35 + monitor * 0.35);

    // Night to dawn.
    const dawn = smooth(BEAT.dawn[0], BEAT.dawn[1], t);
    this.groundU.uDawn.value = dawn;
    this.skyU.uDawn.value = dawn;
    this.sun.intensity = dawn * 2.6;
    this.hemi.intensity = 0.7 + dawn * 0.8;
    this.tmpC.copy(this.nightC).lerp(this.dawnC, dawn * 0.85);
    (this.scene.background as THREE.Color).copy(this.tmpC);
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color.copy(this.tmpC);
    const inside = smooth(3.5, 4.0, t) * (1 - smooth(9.6, 10.3, t));
    fog.density = 0.028 - inside * 0.006 - dawn * 0.017;
    this.fog.uFogColor.value.copy(this.tmpC);
    this.fog.uFogDensity.value = fog.density;
    this.dustU.uTime.value = time;

    // Camera.
    this.cameraAt(t);
    this.look.copy(this.tgt);
    if (!this.opts.reduced) {
      // Much less sway at the desks, where the frame is a hand's width away.
      const near = this.pos.distanceTo(this.tgt) < 1.5 ? 0.06 : 1;
      this.look.x += pointer.x * 0.45 * near;
      this.look.y += pointer.y * 0.25 * near;
    }
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
    this.camera.updateMatrixWorld();

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);

    // The HTML screens follow their anchors, at x100.
    this.scene.updateMatrixWorld();
    this.screens.forEach((s) => {
      const on = t > s.from && t < s.to;
      s.obj.visible = on;
      if (!on) return;
      s.anchor.getWorldPosition(this.tmpV);
      s.anchor.getWorldQuaternion(this.tmpQ);
      s.obj.position.copy(this.tmpV).multiplyScalar(CSS_SCALE);
      s.obj.quaternion.copy(this.tmpQ);
    });
    this.cssCamera.fov = this.camera.fov;
    this.cssCamera.aspect = this.camera.aspect;
    this.cssCamera.near = this.camera.near * CSS_SCALE;
    this.cssCamera.far = this.camera.far * CSS_SCALE;
    this.cssCamera.updateProjectionMatrix();
    this.cssCamera.position.copy(this.camera.position).multiplyScalar(CSS_SCALE);
    this.cssCamera.quaternion.copy(this.camera.quaternion);
    this.cssCamera.updateMatrixWorld();
    this.css.render(this.cssScene, this.cssCamera);
  }

  cameraXZ() {
    return { x: this.camera.position.x, z: this.camera.position.z };
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.css.setSize(w, h);
    this.camera.aspect = w / h;
    this.portrait = w / h < 0.8;
    this.camera.fov = this.portrait ? 66 : w / h < 1.2 ? 58 : 50;
    this.camera.updateProjectionMatrix();
    const last = this.keys[this.keys.length - 1];
    if (this.portrait) last.q.set(-3, 3, -20);
    else last.q.set(-11, 5, -24);
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
    this.css.domElement.remove();
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
