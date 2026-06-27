import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "default_auth_secret_key_987654321";

const base64UrlEncode = (str) => {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
};

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  try {
    const [salt, hash] = storedHash.split(":");
    const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === checkHash;
  } catch {
    return false;
  }
};

export const signToken = (payload) => {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadStr = base64UrlEncode(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 }));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payloadStr}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${header}.${payloadStr}.${signature}`;
};

export const verifyToken = (token) => {
  try {
    const [header, payloadStr, signature] = token.split(".");
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payloadStr}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(base64UrlDecode(payloadStr));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};
