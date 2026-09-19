const tokens = require("./tokens");

// Student sessions: stateless signed tokens, 7-day expiry.
// Survives server restarts/redeploys (expiry lives inside the token).
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function issueStudentSession(studentId) {
  return tokens.issue({ sub: studentId }, TTL_MS);
}

function getStudentId(token) {
  const payload = tokens.verify(token);
  return payload && typeof payload.sub === "string" ? payload.sub : null;
}

function revokeStudentSession(token) {
  tokens.revoke(token);
}

function requireStudent(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const studentId = getStudentId(token);
  if (!studentId) {
    return res.status(401).json({ ok: false, message: "Student session expired. Please log in again." });
  }
  req.studentId = studentId;
  req.studentToken = token;
  next();
}

module.exports = { issueStudentSession, getStudentId, revokeStudentSession, requireStudent };
