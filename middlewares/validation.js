const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Stockage en mémoire (à remplacer plus tard par une base de données)
let users = [];
app.post('/api/vault/store', verifyToken, (req, res) => {
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

