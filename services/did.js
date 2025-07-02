const crypto = require('crypto');
const logger = require('../utils/logger');

class DIDService {
  // Génère un challenge aléatoire pour preuve de possession du DID
  generateChallenge() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Vérifie la signature d’un challenge avec une clé publique (ed25519)
  verifySignature(publicKeyPem, challenge, signatureHex) {
    try {
      const signatureBuffer = Buffer.from(signatureHex, 'hex');
      const messageBuffer = Buffer.from(challenge);

      const isValid = crypto.verify(
        null, // algorithme de hash null pour ed25519
        messageBuffer,
        {
          key: publicKeyPem, // clé publique PEM en string directement
          format: 'pem',
          type: 'spki'
        },
        signatureBuffer
      );

      return isValid;
    } catch (error) {
      logger.error(`❌ Échec vérification signature DID : ${error.message}`);
      return false;
    }
  }


  // Génère une paire de clés ed25519 (ex. pour tests ou outils)
  generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    return {
      publicKey: publicKey.export({ format: 'pem', type: 'spki' }),
      privateKey: privateKey.export({ format: 'pem', type: 'pkcs8' })
    };
  }

}

module.exports = new DIDService();
