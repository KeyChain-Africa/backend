const express = require('express');
const router = express.Router();
const { confirmShare, getReceivedShares, revokeShare } = require('../controllers/shareController');
const { verifyToken } = require('../middlewares/authMiddleware');

app.post('/share/invoice', async (req, res) => {
    try {
        const { sats, description } = req.body;

        if (sats === undefined || typeof sats !== 'number' || sats <= 0) {
            return res.status(400).json({ error: 'A positive numeric `sats` value is required.' });
        }

        const invoice = await createInvoice({
            lnd: req.lnd,
            tokens: sats,
            description: description || '',
        });

        res.json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice.', details: error });
    }
});

// ✅ Confirmer le paiement d'une invoice et déclencher le partage
router.post('/confirm', verifyToken, confirmShare);

// 📥 Récupérer les clés partagées reçues par l'utilisateur
router.get('/received', verifyToken, getReceivedShares);

// 🛑 Révoquer un partage existant
router.post('/revoke', verifyToken, revokeShare);

module.exports = router;