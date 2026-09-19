const crypto = require("crypto");
const config = require("../config");

// Stateless HMAC-signed tokens (no server-side session store).
// Survives restarts/redeploys — expiry is embedded in the token itself.
// Format: v1.<base64url(JSON payload)>.<base64url(HMAC-SHA256)>
// Payload: { sub } for students, { adm: 1 } for admins, plus { exp } (ms epoch).

const revoked = new Set(); // best-effort logout list (memory only; tokens expire anyway)

function b64uEncode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function b64uDecode(s) {
  return JSON.parse(Buffer.from(String(s), "base64url").toString("utf8"));
}

function sign(data) {
  return crypto.createHmac("sha256", config.sessionSecret).update(data).digest("base64url");
}

function issue(payload, ttlMs) {
  const body = b64uEncode({ ...payload, exp: Date.now() + ttlMs });
  return `v1.${body}.${sign(body)}`;
}

function parse(token) {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const [, body, sig] = parts;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(body));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = b64uDecode(body);
  } catch {
    return null;
  }
  if (!payload || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
  return payload;
}

function verify(token) {
  if (!token || revoked.has(token)) return null;
  return parse(token);
}

function revoke(token) {
  if (token) revoked.add(token);
  // cap memory: drop oldest entries (each token expires on its own anyway)
  if (revoked.size > 5000) {
    const it = revoked.values();
    for (let i = 0; i < 1000; i++) revoked.delete(it.next().value);
  }
}

module.exports = { issue, verify, revoke };
