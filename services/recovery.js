const secrets = require('secrets.js-grempe');
const logger = require('../utils/logger');

class RecoveryService {
  /**
   * Génère les fragments (shards) d’un secret à l’aide du schéma de Shamir.
   * @param {string} secret - Le secret à diviser (ex: clé maître)
   * @param {number} threshold - Nombre minimal de shards pour reconstituer le secret
   * @param {number} totalShards - Nombre total de shards à générer
   * @returns {string[]} Liste des shards
   */
  generateShards(secret, threshold = 3, totalShards = 5) {
    if (typeof secret !== 'string' || !secret.trim()) {
      throw new Error('INVALID_SECRET');
    }
    if (threshold > totalShards) {
      throw new Error('INVALID_THRESHOLD');
    }

    try {
      const hexSecret = secrets.str2hex(secret);
      const shares = secrets.share(hexSecret, totalShards, threshold);
      logger.info(`🔐 Shards générés (${shares.length} total, seuil ${threshold})`);
      return shares;
    } catch (error) {
      logger.error(`❌ Échec de la génération des shards : ${error.message}`);
      throw new Error('SHARD_GENERATION_ERROR');
    }
  }

  /**
   * Reconstitue un secret à partir d’un ensemble de shards valides.
   * @param {string[]} shards - Liste de fragments à combiner
   * @returns {string} Le secret original (ex: clé maître)
   */
  recoverFromShards(shards) {
    if (!Array.isArray(shards) || shards.length < 2) {
      throw new Error('INVALID_SHARD_INPUT');
    }

    try {
      const hexSecret = secrets.combine(shards);
      const secret = secrets.hex2str(hexSecret);
      logger.info(`✅ Secret restauré à partir de ${shards.length} shards`);
      return secret;
    } catch (error) {
      logger.error(`❌ Échec de la restauration du secret : ${error.message}`);
      throw new Error('SHARD_RECOVERY_ERROR');
    }
  }

  /**
   * Vérifie si un ensemble de shards est valide pour recomposer un secret.
   * @param {string[]} shards - Liste de fragments à tester
   * @returns {boolean}
   */
  validateShards(shards) {
    try {
      secrets.combine(shards);
      return true;
    } catch (error) {
      logger.warn(`⚠️ Shards invalides pour combinaison : ${error.message}`);
      return false;
    }
  }
}

module.exports = new RecoveryService();
