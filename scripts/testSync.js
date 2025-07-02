// scripts/testSync.js
const syncService = require('../services/sync');

const clientOps = [
  { id: '1', version: 2, lastUpdated: 3000 },
  { id: '2', version: 1, lastUpdated: 2000 }
];

const serverState = [
  { id: '1', version: 1, lastUpdated: 1000 },
  { id: '2', version: 1, lastUpdated: 3000 }
];

const { resolved, conflicts } = syncService.resolveConflicts(clientOps, serverState);

console.log('🟢 Résolus :', resolved);
console.log('🔴 Conflits :', conflicts);
