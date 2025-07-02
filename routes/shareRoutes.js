 const express = require('express');
const router = express.Router();
const { confirmShare, getReceivedShares, revokeShare } = require('../controllers/shareController');
const { verifyToken } = require('../middlewares/authMiddleware');

// ✅ Confirmer le paiement d'une invoice et déclencher le partage
router.post('/confirm', verifyToken, confirmShare);

// 📥 Récupérer les clés partagées reçues par l'utilisateur
router.get('/received', verifyToken, getReceivedShares);

// 🛑 Révoquer un partage existant
router.post('/revoke', verifyToken, revokeShare);

module.exports = router;