const crypto = require("crypto");
const config = require("../config");
const tokens = require("./tokens");

// Admin sessions: stateless signed tokens, 12h expiry.
// Survives server restarts/redeploys (expiry lives inside the token).
const TTL_MS = 12 * 60 * 60 * 1000;

function issueSession() {
  return tokens.issue({ adm: 1 }, TTL_MS);
}

function verifyToken(token) {
  if (!token) return false;
  // legacy shared key still accepted where requireAdmin allows it
  const payload = tokens.verify(token);
  return !!(payload && payload.adm === 1);
}

function revokeToken(token) {
  tokens.revoke(token);
}

// Accepts `Authorization: Bearer <token>` (dashboard login)
// or the legacy shared `x-admin-key` (scripts/exports).
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
  const legacy = req.headers["x-admin-key"] || req.query.adminKey || req.query.token;
  if ((bearer && verifyToken(bearer)) || (legacy && legacy === config.adminKey)) {
    return next();
  }
  // also allow token via query for CSV download links
  if (legacy && verifyToken(legacy)) return next();
  return res.status(401).json({ ok: false, message: "Unauthorized. Please log in as admin." });
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

module.exports = { requireAdmin, issueSession, verifyToken, revokeToken, safeEqual };
