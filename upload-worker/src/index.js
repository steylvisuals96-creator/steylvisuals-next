const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const R2_PUBLIC = "https://pub-28e65866cf1641928966914639cc84ef.r2.dev";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function unauthorized() {
  return json({ error: "Unauthorized" }, 401);
}

function checkAuth(request, env) {
  const header = request.headers.get("Authorization") || "";
  return header === `Bearer ${env.UPLOAD_TOKEN}`;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (!checkAuth(request, env)) return unauthorized();

    const url = new URL(request.url);
    const path = url.pathname;

    // POST /upload — upload a file
    if (request.method === "POST" && path === "/upload") {
      const formData = await request.formData();
      const file = formData.get("file");
      const folder = (formData.get("folder") || "images").replace(/^\/|\/$/g, "");

      if (!file || typeof file === "string") {
        return json({ error: "No file provided" }, 400);
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = folder ? `${folder}/${safeName}` : safeName;

      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
      });

      return json({ url: `${R2_PUBLIC}/${key}`, key });
    }

    // GET /list?folder=images — list files
    if (request.method === "GET" && path === "/list") {
      const prefix = url.searchParams.get("folder") || "";
      const listed = await env.BUCKET.list({ prefix: prefix ? `${prefix}/` : "" });
      const objects = listed.objects.map((o) => ({
        key: o.key,
        size: o.size,
        uploaded: o.uploaded,
        url: `${R2_PUBLIC}/${o.key}`,
      }));
      return json({ objects });
    }

    // DELETE /delete?key=images/foo.jpg — delete a file
    if (request.method === "DELETE" && path === "/delete") {
      const key = url.searchParams.get("key");
      if (!key) return json({ error: "key required" }, 400);
      await env.BUCKET.delete(key);
      return json({ deleted: key });
    }

    // GET /content — read site content
    if (request.method === "GET" && path === "/content") {
      const obj = await env.BUCKET.get("content.json");
      if (!obj) return json({});
      const text = await obj.text();
      return new Response(text, {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // PUT /content — save site content
    if (request.method === "PUT" && path === "/content") {
      const body = await request.text();
      JSON.parse(body); // validate JSON
      await env.BUCKET.put("content.json", body, {
        httpMetadata: { contentType: "application/json" },
      });
      return json({ saved: true });
    }

    // GET /library — read the inspiration library index
    if (request.method === "GET" && path === "/library") {
      const obj = await env.BUCKET.get("library.json");
      if (!obj) return json({ items: [] });
      const text = await obj.text();
      return new Response(text, {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // PUT /library — save the inspiration library index
    if (request.method === "PUT" && path === "/library") {
      const body = await request.text();
      JSON.parse(body); // validate JSON
      await env.BUCKET.put("library.json", body, {
        httpMetadata: { contentType: "application/json" },
      });
      return json({ saved: true });
    }

    return json({ error: "Not found" }, 404);
  },
};
