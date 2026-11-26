const crypto = require("node:crypto");

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

const configuredUsers = () =>
  [
    {
      username: process.env.APP_USERNAME,
      password: process.env.APP_PASSWORD,
    },
    {
      username: process.env.GUEST_USERNAME,
      password: process.env.GUEST_PASSWORD,
    },
  ].filter(
    (user) =>
      typeof user.username === "string" &&
      user.username.length > 0 &&
      typeof user.password === "string" &&
      user.password.length >= 12
  );

const tokenSecret = () => {
  const secret = process.env.AUTH_TOKEN_SECRET;
  return typeof secret === "string" && secret.length >= 32
    ? secret
    : null;
};

const fixedTimeEqual = (left, right) =>
  crypto.timingSafeEqual(
    crypto.createHash("sha256").update(left).digest(),
    crypto.createHash("sha256").update(right).digest()
  );

const createToken = (username, secret) => {
  const payload = Buffer.from(
    JSON.stringify({
      sub: username,
      exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS,
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
};

const verifyToken = (token, secret) => {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  if (!fixedTimeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    if (
      typeof claims.sub !== "string" ||
      typeof claims.exp !== "number" ||
      claims.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { username: claims.sub };
  } catch {
    return null;
  }
};

const login = (req, res) => {
  const users = configuredUsers();
  const secret = tokenSecret();

  if (users.length === 0 || !secret) {
    return res.status(503).json({
      message: "Authentication is not configured on the server.",
    });
  }

  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = users.find(
    (candidate) =>
      fixedTimeEqual(username, candidate.username) &&
      fixedTimeEqual(password, candidate.password)
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  return res.json({
    token: createToken(user.username, secret),
    username: user.username,
  });
};

const requireAuth = (req, res, next) => {
  const secret = tokenSecret();
  if (!secret) {
    return res.status(503).json({
      message: "Authentication is not configured on the server.",
    });
  }

  const authorization = req.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const user = match ? verifyToken(match[1], secret) : null;

  if (!user || !configuredUsers().some(({ username }) => username === user.username)) {
    return res.status(401).json({ message: "Authentication required." });
  }

  req.auth = user;
  return next();
};

module.exports = { login, requireAuth };
