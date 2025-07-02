const prisma = require('./index');

class VaultKey {
    /**
     * Crée une nouvelle clé dans le coffre
     * @param {Object} keyData - Données de la clé
     * @param {string} keyData.userId - ID utilisateur
     * @param {string} keyData.name - Nom de la clé
     * @param {string} keyData.type - Type de clé
     * @param {string} keyData.ciphertext - Clé chiffrée
     * @param {string} keyData.iv - Vecteur d'initialisation
     */
    static async create({ userId, name, type, ciphertext, iv }) {
        return prisma.vaultKey.create({
            data: {
                userId,
                name,
                type,
                ciphertext,
                iv
            }
        });
    }

    /**
     * Récupère toutes les clés d'un utilisateur
     * @param {string} userId - ID utilisateur
     */
    static async findAllByUser(userId) {
        return prisma.vaultKey.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                type: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Récupère une clé spécifique
     * @param {string} id - ID de la clé
     * @param {string} userId - ID utilisateur
     */
    static async findById(id, userId) {
        return prisma.vaultKey.findUnique({
            where: { id, userId }
        });
    }

    /**
     * Met à jour une clé existante
     * @param {string} id - ID de la clé
     * @param {string} userId - ID utilisateur
     * @param {Object} updateData - Données de mise à jour
     */
    static async update(id, userId, updateData) {
        return prisma.vaultKey.update({
            where: { id, userId },
            data: updateData
        });
    }

    /**
     * Supprime une clé
     * @param {string} id - ID de la clé
     * @param {string} userId - ID utilisateur
     */
    static async delete(id, userId) {
        return prisma.vaultKey.delete({
            where: { id, userId }
        });
    }
}

module.exports = VaultKey;