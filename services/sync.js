class SyncService {
  /**
   * Résout les conflits entre les opérations du client et l’état actuel du serveur
   * @param {Array} clientOperations - Liste des opérations envoyées par le client
   * @param {Array} serverState - État actuel du serveur (VaultKey[])
   * @returns {Object} - { resolved: [], conflicts: [] }
   */
  resolveConflicts(clientOperations, serverState) {
    const resolved = [];
    const conflicts = [];

    const serverMap = new Map(serverState.map(item => [item.id, item]));

    clientOperations.forEach(clientOp => {
      const serverItem = serverMap.get(clientOp.id);

      if (!serverItem) {
        // 🔹 Nouveau mot de passe côté client
        resolved.push({ ...clientOp, action: 'create' });
        return;
      }

      if (clientOp.version > serverItem.version) {
        // ✅ Version client plus récente
        resolved.push({ ...clientOp, action: 'update' });
      } else if (clientOp.version === serverItem.version) {
        // Même version, comparer les horodatages
        if (new Date(clientOp.lastUpdated) > new Date(serverItem.lastUpdated)) {
          resolved.push({ ...clientOp, action: 'update' });
        } else {
          // ❗ Conflit sur la même version
          conflicts.push({
            id: clientOp.id,
            reason: 'Same version, but client is older',
            client: clientOp,
            server: serverItem
          });
        }
      } else {
        // ❌ Version serveur plus récente → conflit
        conflicts.push({
          id: clientOp.id,
          reason: 'Server version is newer',
          client: clientOp,
          server: serverItem
        });
      }
    });

    return { resolved, conflicts };
  }

  /**
   * Supprime les opérations inutiles ou redondantes (compression différentielle)
   * @param {Array} operations - Liste d'opérations { id, action, changes }
   * @returns {Array} - Opérations compressées
   */
  compressOperations(operations) {
    return operations.filter(op =>
      !(op.action === 'update' && (!op.changes || Object.keys(op.changes).length === 0))
    );
  }
}

module.exports = new SyncService();
