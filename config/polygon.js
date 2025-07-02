require('dotenv').config(); // Chargement des variables d'environnement

// Récupération et nettoyage de la clé privée
const privateKey = (process.env.POLYGON_PRIVATE_KEY || "")
  .trim() // Supprime les espaces avant/après
  .replace(/[^a-f0-9x]/gi, ""); // Supprime tout caractère non hexadécimal

// Debug : Affichage des infos de la clé (à désactiver en production)
console.log("[DEBUG] Clé brute:", process.env.POLYGON_PRIVATE_KEY);
console.log("[DEBUG] Clé nettoyée:", privateKey);
console.log("[DEBUG] Longueur:", privateKey.length);

// Validation stricte
if (!privateKey || !privateKey.startsWith('0x') || privateKey.length !== 66) {
  throw new Error(
    `POLYGON_PRIVATE_KEY invalide. Format attendu: 0x + 64 caractères hexadécimaux.\n` +
    `Reçu: ${privateKey || 'vide'} (${privateKey.length} caractères)`
  );
}

// Export de la configuration
module.exports = {
  rpcUrl: process.env.POLYGON_RPC_URL,
  privateKey,
  contractAddress: process.env.POLYGON_CONTRACT_ADDRESS,
  abi: require('./polygon-abi.json') // Assurez-vous que ce fichier existe
};