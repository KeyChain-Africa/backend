const didService = require('../services/did');
const crypto = require('crypto');

const challenge = didService.generateChallenge();
console.log('🧩 Challenge généré :', challenge);

const { publicKey, privateKey } = didService.generateKeyPair();
console.log('🔑 Clé publique :', publicKey);

// Créer un KeyObject privé directement avec la clé PEM
const privateKeyObject = crypto.createPrivateKey({
  key: privateKey,
  format: 'pem',
  type: 'pkcs8'
});

// Signer le challenge
const signature = crypto.sign(null, Buffer.from(challenge), privateKeyObject).toString('hex');

// La fonction verifySignature attend la clé publique en PEM, donc c'est cohérent
const isValid = didService.verifySignature(publicKey, challenge, signature);
console.log('✅ Signature valide ?', isValid);
