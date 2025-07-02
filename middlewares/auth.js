const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token);
    if (!decoded?.jti) return res.status(401).json({ error: 'Token invalide' });

    // Vérifie si le token (JTI) est blacklisté
    const blacklisted = await redis.get(`blacklist:${decoded.jti}`);
    if (blacklisted) return res.status(401).json({ error: 'Token révoqué' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};
