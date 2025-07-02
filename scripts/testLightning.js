const lightning = require('../services/lightning');

(async () => {
  try {
    const invoice = await lightning.createInvoice(500, 'Test depuis Node.js');
    console.log('✅ Invoice générée :', invoice);
  } catch (err) {
    console.error('❌ Erreur Lightning :', err.message);
  }
})();
