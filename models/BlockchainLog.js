const prisma = require('./index');

class BlockchainLog {
    /**
     * Crée un nouveau log blockchain
     * @param {Object} logData - Données du log
     * @param {string} logData.userDid - DID utilisateur
     * @param {string} logData.keyId - ID de la clé
     * @param {string} logData.action - Action (CREATE, UPDATE, DELETE, SHARE)
     * @param {string} [logData.txHash] - Hash de transaction
     */
    static async create({ userDid, keyId, action, txHash = null }) {
        return prisma.blockchainLog.create({
            data: {
                userDid,
                keyId,
                action,
                txHash
            }
        });
    }

    /**
     * Récupère les logs d'un utilisateur
     * @param {string} userDid - DID utilisateur
     */
    static async findByUser(userDid) {
        return prisma.blockchainLog.findMany({
            where: { userDid },
            orderBy: { createdAt: 'desc' }
        });
    }
}

module.exports = BlockchainLog;