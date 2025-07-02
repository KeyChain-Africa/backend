const vaultService = require('../services/vaultService');

exports.createVaultKey = async (req, res, next) => {
  try {
    const key = await vaultService.createVaultKey(req.user.id, req.body);
    res.status(201).json(key);
  } catch (err) {
    next(err);
  }
};

exports.listVaultKeys = async (req, res, next) => {
  try {
    const keys = await vaultService.listVaultKeys(req.user.id);
    res.json(keys);
  } catch (err) {
    next(err);
  }
};

exports.getVaultKey = async (req, res, next) => {
  try {
    const key = await vaultService.getVaultKey(req.user.id, req.params.id);
    res.json(key);
  } catch (err) {
    next(err);
  }
};

exports.updateVaultKey = async (req, res, next) => {
  try {
    const key = await vaultService.updateVaultKey(req.user.id, req.params.id, req.body);
    res.json(key);
  } catch (err) {
    next(err);
  }
};

exports.deleteVaultKey = async (req, res, next) => {
  try {
    await vaultService.deleteVaultKey(req.user.id, req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
