const express = require('express');
const bcrypt = require('bcrypt');
const verifyToken = require('./verifyToken');
const app = express();
const port = 3000;

const vaultDB = [];
const blockchainLogs = [];
// Middleware
app.use(express.json());

// Stockage en mémoire (à remplacer plus tard par une base de données)
let users = [];
app.post('/keys', verifyToken, (req, res) => {
  const { name, type, ciphertext, iv } = req.body;
  const userId = req.user.id; // injecté depuis le token

  if (!name || !type || !ciphertext || !iv) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  // Création de l’entrée
  const entry = {
    id: vaultDB.length + 1,
    userId,
    name,
    type,
    ciphertext,
    iv,
    date: new Date().toISOString()
  };

  // Insertion en "BDD"
  vaultDB.push(entry);

  // Simuler un log sur blockchain
  blockchainLogs.push({
    timestamp: entry.date,
    userId,
    action: 'INSERT',
    resource: name,
    hash: hash(entry)
  });

  res.status(201).json({ message: 'Clé chiffrée enregistrée avec succès', id: entry.id });
});

// Fonction de hash simple pour simuler une empreinte
function hash(data) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

app.get('/keys', verifyToken, (req, res) => {
const userId = req.user.id; // récupéré du token

  // Filtrer toutes les clés de l’utilisateur
  const userKeys = vaultDB.filter(entry => entry.userId === userId);

  // Retourner les données sans exposer de données sensibles inutiles
  res.json(userKeys.map(({ ciphertext, iv, name, type, id, date }) => ({
    id,
    name,
    type,
    ciphertext,
    iv,
    date
  })));
});

app.get('/keys/:id', verifyToken, (req, res) => {
  const userId = req.user.id;
  const keyId = parseInt(req.params.id);

  // Chercher la clé dans la "base"
  const keyEntry = vaultDB.find(e => e.id === keyId);

  if (!keyEntry) {
    return res.status(404).json({ error: 'Clé non trouvée' });
  }

  // Vérifier que la clé appartient bien à l’utilisateur
  if (keyEntry.userId !== userId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  // Retourner la clé chiffrée
  const { id, name, type, ciphertext, iv, date } = keyEntry;
  res.json({ id, name, type, ciphertext, iv, date });
});

app.put('/keys/:id', verifyToken, (req, res) => {
  const userId = req.user.id;
  const keyId = parseInt(req.params.id);
  const { name, type, ciphertext, iv } = req.body;

  // Trouver la clé
  const keyEntry = vaultDB.find(e => e.id === keyId);

  if (!keyEntry) {
    return res.status(404).json({ error: 'Clé non trouvée' });
  }

  // Vérifier la propriété
  if (keyEntry.userId !== userId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  // Mettre à jour les champs (uniquement ceux fournis)
  if (name) keyEntry.name = name;
  if (type) keyEntry.type = type;
  if (ciphertext) keyEntry.ciphertext = ciphertext;
  if (iv) keyEntry.iv = iv;

  res.json({ message: 'Clé mise à jour', key: keyEntry });
});

app.delete('/keys/delete', verifyToken, (req, res) => {
  const userId = req.user.id;
  const keyId = parseInt(req.params.id);

  // Trouver l’index de la clé
  const index = vaultDB.findIndex(e => e.id === keyId);

  if (index === -1) {
    return res.status(404).json({ error: 'Clé non trouvée' });
  }

  // Vérifier la propriété
  if (vaultDB[index].userId !== userId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  // Supprimer la clé
  vaultDB.splice(index, 1);

  res.json({ message: 'Clé supprimée avec succès' });
});

module.exports = app;