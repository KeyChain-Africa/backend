const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Stockage en mémoire (à remplacer plus tard par une base de données)
let users = [];
app.post('/api/user', async (req, res) => {
  const { did, publicKey, masterPassword } = req.body;

  if (!did || !publicKey || !masterPassword) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  // Vérifier si le DID existe déjà
  const exists = users.find(u => u.did === did);
  if (exists) {
    return res.status(409).json({ error: 'DID déjà enregistré' });
  }

  // Hachage sécurisé du mot de passe maître
  const hashedPassword = await bcrypt.hash(masterPassword, 10);

  // Création et stockage
  const user = { did, publicKey, hashedPassword };
  users.push(user);

  res.status(201).json({ message: 'Utilisateur créé', did });
});

app.post('/api/login', async (req, res) => {
  const { did, masterPassword } = req.body;

  // Vérification des champs
  if (!did || !masterPassword) {
    return res.status(400).json({ error: 'DID et mot de passe requis' });
  }

  // Rechercher l’utilisateur par son DID
  const user = users.find(u => u.did === did);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  // Vérifier le mot de passe avec bcrypt
  const valid = await bcrypt.compare(masterPassword, user.hashedPassword);
  if (!valid) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  // Connexion réussie
  res.json({ message: 'Connexion réussie', did: user.did });
});
