module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
};
