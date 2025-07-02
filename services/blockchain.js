const { JsonRpcProvider, Wallet, Contract } = require('ethers');
const { Queue } = require('bullmq');
const Redis = require('ioredis');
const polygonConfig = require('../config/polygon');
const redisConfig = require('../config/redis');
const logger = require('../utils/logger');

class BlockchainService {
  constructor() {
    this.provider = new JsonRpcProvider(polygonConfig.rpcUrl);
    this.wallet = new Wallet(polygonConfig.privateKey, this.provider);
    this.contract = new Contract(
      polygonConfig.contractAddress,
      polygonConfig.abi,
      this.wallet
    );

    this.redis = new Redis(redisConfig);
    this.queue = this.initQueue();

    // Test de connectivité
    this.provider.getBlockNumber().then(block => {
      logger.info(`✅ Connexion Polygon réussie — bloc #${block}`);
    }).catch(err => {
      logger.error('❌ Impossible de se connecter à Polygon :', err.message);
    });
  }

  initQueue() {
    return new Queue('blockchain', {
      connection: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }
      }
    });
  }

  async logAction(actionType, data) {
    try {
      await this.queue.add(actionType, data, {
        jobId: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      });
      logger.info(`📦 Action "${actionType}" mise en file pour la blockchain.`);
    } catch (err) {
      logger.error('❌ Erreur lors de l’ajout à la file blockchain :', err.message);
    }
  }

  async processJob(job) {
    try {
      const { userDid, keyId, actionType } = job.data;

      const tx = await this.contract.logAction(userDid, keyId, actionType);
      await tx.wait();

      logger.info(`✅ Tx blockchain confirmée : ${tx.hash}`);
      return tx.hash;

    } catch (err) {
      logger.error(`❌ Échec de la transaction blockchain : ${err.message}`);
      // Fallback : log local pour replay manuel
      await this.archiveJob(job);
      throw err;
    }
  }

  async retryFailedJobs() {
    const failedJobs = await this.queue.getFailed();
    for (const job of failedJobs) {
      if (job.attemptsMade < 3) {
        await job.retry();
      } else {
        await this.archiveJob(job);
      }
    }
  }

  async archiveJob(job) {
    const key = `failed:tx:${job.id}`;
    await this.redis.set(key, JSON.stringify(job.data));
    logger.warn(`🗂️ Transaction archivée pour replay : ${key}`);
    await job.remove();
  }
}

module.exports = new BlockchainService();
