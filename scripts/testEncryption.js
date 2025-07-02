const encryption = require('../services/encryption');

(async () => {
  await encryption.init(); // initialiser libsodium
  
  const masterKey = encryption.generateRandomKey().toString('hex');
  const secret = 'mon secret super important';

  const encrypted = await encryption.encryptSecret(masterKey, secret);
  console.log('Encrypted:', encrypted);

  const decrypted = await encryption.decryptSecret(masterKey, encrypted.ciphertext, encrypted.iv);
  console.log('Decrypted:', decrypted);
})();
