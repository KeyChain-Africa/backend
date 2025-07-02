const recovery = require('../services/recovery');

const secret = "mon super secret à partager";
const threshold = 3;
const totalShards = 5;

// Génération des shards
const shards = recovery.generateShards(secret, threshold, totalShards);
console.log("Shards générés:", shards);

// Reconstruction du secret avec un quorum de shards (ici 3)
const recoveredSecret = recovery.recoverFromShards(shards.slice(0, threshold));
console.log("Secret reconstitué:", recoveredSecret);

// Validation des shards
const isValid = recovery.validateShards(shards.slice(0, threshold));
console.log("Shards valides ?", isValid);
