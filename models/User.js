const prisma = require('./index');
const bcrypt = require('bcrypt');

class User {
    /**
     * Crée un nouvel utilisateur
     * @param {Object} userData - Données utilisateur
     * @param {string} userData.did - DID de l'utilisateur
     * @param {string} userData.username - Nom d'utilisateur
     * @param {string} userData.publicKey - Clé publique
     * @param {string} userData.encryptedMasterKey - Clé maître chiffrée
     * @param {string} userData.password - Mot de passe en clair
     */
    static async create({ did, username, publicKey, encryptedMasterKey, password }) {
        const passwordHash = await bcrypt.hash(password, 10);
        return prisma.user.create({
            data: {
                did,
                username,
                publicKey,
                masterKeyEnc: encryptedMasterKey,
                passwordHash
            }
        });
    }

    /**
     * Trouve un utilisateur par son DID
     * @param {string} did - DID de l'utilisateur
     */
    static async findByDid(did) {
        return prisma.user.findUnique({
            where: { did }
        });
    }

    /**
     * Vérifie le mot de passe d'un utilisateur
     * @param {Object} user - Utilisateur
     * @param {string} password - Mot de passe en clair
     */
    static async verifyPassword(user, password) {
        return bcrypt.compare(password, user.passwordHash);
    }

    /**
     * Met à jour les paramètres utilisateur
     * @param {string} did - DID de l'utilisateur
     * @param {Object} settings - Nouveaux paramètres
     */
    static async updateSettings(did, settings) {
        const { theme, language, newPassword } = settings;
        const updateData = {};
        
        if (theme) updateData.theme = theme;
        if (language) updateData.language = language;
        
        if (newPassword) {
            updateData.passwordHash = await bcrypt.hash(newPassword, 10);
        }

        return prisma.user.update({
            where: { did },
            data: updateData
        });
    }
}

module.exports = User;