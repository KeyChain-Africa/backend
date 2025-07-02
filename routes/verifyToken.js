const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'TON_SECRET_JWT', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });

    req.user = user; // Injecte l'utilisateur dans la requête
    next();
  });
}

module.exports = verifyToken;
