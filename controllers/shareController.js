const shareService = require('../services/shareService');

exports.createShare = async (req, res, next) => {
  try {
    const result = await shareService.createShare(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.revokeShare = async (req, res, next) => {
  try {
    await shareService.revokeShare(req.user.id, req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.listPaidShares = async (req, res, next) => {
  try {
    const shares = await shareService.listPaidShares(req.user.id);
    res.json(shares);
  } catch (err) {
    next(err);
  }
};
