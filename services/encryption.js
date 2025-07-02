const sodium = require('libsodium-wrappers');
const logger = require('../utils/logger');
const crypto = require('crypto'); 


class EncryptionService {
  constructor() {
    this.initialized = false;
    this.initPromise = null;
    this.MASTER_KEY_BYTES = sodium.crypto_secretbox_KEYBYTES;
  }

  async init() {
    if (!this.initPromise) {
      this.initPromise = sodium.ready.then(() => {
        this.initialized = true;
        logger.info('🔐 Libsodium initialisé avec succès.');
      });
    }
    return this.initPromise;
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  async encryptSecret(masterKey, secret) {
    await this.ensureInitialized();
    try {
      const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      const ciphertext = sodium.crypto_secretbox_easy(
        sodium.from_string(secret),
        nonce,
        sodium.from_hex(masterKey)
      );

      return {
        ciphertext: sodium.to_hex(ciphertext),
        iv: sodium.to_hex(nonce)
      };
    } catch (error) {
      logger.error(`❌ Erreur chiffrement symétrique : ${error.message}`);
      throw new Error('ENCRYPTION_ERROR');
    }
  }

  async decryptSecret(masterKey, ciphertext, iv) {
    await this.ensureInitialized();
    try {
      const plaintext = sodium.crypto_secretbox_open_easy(
        sodium.from_hex(ciphertext),
        sodium.from_hex(iv),
        sodium.from_hex(masterKey)
      );

      return sodium.to_string(plaintext);
    } catch (error) {
      logger.error(`❌ Erreur déchiffrement : ${error.message}`);
      throw new Error('DECRYPTION_ERROR');
    }
  }

  async encryptForSharing(publicKey, secret) {
    await this.ensureInitialized();
    try {
      const encrypted = sodium.crypto_box_seal(
        sodium.from_string(secret),
        sodium.from_hex(publicKey)
      );
      return sodium.to_hex(encrypted);
    } catch (error) {
      logger.error(`❌ Erreur chiffrement asymétrique : ${error.message}`);
      throw new Error('ASYMMETRIC_ENCRYPTION_ERROR');
    }
  }

  async rotateMasterKey(oldKey, newKey, vaultItems) {
    await this.ensureInitialized();

    const results = [];

    for (const item of vaultItems) {
      try {
        const decrypted = await this.decryptSecret(oldKey, item.ciphertext, item.iv);
        const reencrypted = await this.encryptSecret(newKey, decrypted);

        results.push({
          ...item,
          ciphertext: reencrypted.ciphertext,
          iv: reencrypted.iv
        });

      } catch (err) {
        logger.warn(`⚠️ Rotation échouée pour clé ${item.id} : ${err.message}`);
        results.push({ ...item }); // On garde la version originale si erreur
      }
    }

    return results;
  }

  generateRandomKey() {
    return crypto.randomBytes(32); // AES-256
  }

  generateIV() {
    return crypto.randomBytes(16); // IV AES
  }

}

module.exports = new EncryptionService();
