const prisma = require('../models/prismaClient'); // Prisma client
const { verifyInvoicePaid } = require('../services/lightningService');
const { encryptForRecipient } = require('../services/encryptionService');
const { logAction } = require('../services/blockchainLogger');

exports.confirmShare = async (req, res) => {
  try {
    const { keyId, invoiceId, recipientDid } = req.body;
    const senderId = req.user.id;

    const isPaid = await verifyInvoicePaid(invoiceId);
    if (!isPaid) return res.status(402).json({ error: 'Invoice non réglée.' });

    const vaultKey = await prisma.vaultKey.findUnique({ where: { id: keyId } });
    if (!vaultKey) return res.status(404).json({ error: 'Clé introuvable' });

    const recipient = await prisma.user.findUnique({ where: { did: recipientDid } });
    if (!recipient) return res.status(404).json({ error: 'Destinataire inconnu' });

    const encryptedKey = encryptForRecipient(vaultKey.ciphertext, recipient.publicKey);

    await prisma.share.updateMany({
      where: { keyId, recipientDid },
      data: {
        paid: true,
        encryptedKey
      }
    });

    await logAction(senderId, keyId, 'SHARE');

    res.json({ success: true, encryptedKey });
  } catch (error) {
    console.error('Erreur confirmShare:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getReceivedShares = async (req, res) => {
  try {
    const userDid = req.user.did;

    const shares = await prisma.share.findMany({
      where: {
        recipientDid: userDid,
        paid: true
      },
      select: {
        keyId: true,
        encryptedKey: true,
        senderId: true,
        createdAt: true
      }
    });

    res.json(shares);
  } catch (error) {
    console.error('Erreur getReceivedShares:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.revokeShare = async (req, res) => {
  try {
    const { keyId, recipientDid } = req.body;
    const senderId = req.user.id;

    const share = await prisma.share.findFirst({
      where: { keyId, recipientDid, senderId }
    });

    if (!share) return res.status(404).json({ error: 'Partage introuvable' });

    await prisma.share.delete({ where: { id: share.id } });

    await logAction(senderId, keyId, 'REVOKE');

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur revokeShare:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
