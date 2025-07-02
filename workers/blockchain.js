// workers/blockchain.js

const { Worker } = require('bullmq');
const blockchainService = require('../services/blockchain');
const redisConfig = require('../config/redis');
const logger = require('../utils/logger');

// Création du worker
const worker = new Worker(
  'blockchain',
  async (job) => {
    try {
      logger.info(`🛠️ Traitement du job #${job.id} — Action: ${job.name}`);
      const txHash = await blockchainService.processJob(job);
      logger.info(`✅ Job #${job.id} terminé — Tx Hash: ${txHash}`);
      return txHash;
    } catch (err) {
      logger.error(`❌ Job #${job.id} échoué : ${err.message}`);
      throw err; // Laisse BullMQ gérer les tentatives automatiques
    }
  },
  {
    connection: redisConfig,
    concurrency: 2, // Nombre de jobs traités en parallèle (ajustable)
  }
);

// Gestion des erreurs globales du worker
worker.on('failed', (job, err) => {
  logger.warn(`⚠️ Job "${job.name}" a échoué après ${job.attemptsMade} tentative(s).`);
});

worker.on('completed', (job, result) => {
  logger.info(`🎯 Job "${job.name}" complété avec succès.`);
});

// Catch global des erreurs non gérées
process.on('uncaughtException', (err) => {
  logger.error('💥 Erreur non capturée dans le worker :', err);
});

process.on('unhandledRejection', (err) => {
  logger.error('💥 Promesse non gérée dans le worker :', err);
});
