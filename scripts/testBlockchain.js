const blockchain = require('../services/blockchain');

async function test() {
  try {
    await blockchain.logAction('CREATE', {
      userDid: 'did:example:123',
      keyId: 'cle123',
      actionType: 'CREATE'
    });
    console.log('✅ Log ajouté à la file blockchain avec succès');
    process.exit(0);
  } catch (err) {
    console.error('❌ Échec ajout log à la file blockchain :', err.message);
    process.exit(1);
  }
}

test();
