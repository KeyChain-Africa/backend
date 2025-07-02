const authService = require('../services/authService');

exports.challengeDID = async (req, res, next) => {
  try {
    const result = await authService.challengeDID(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.rotateMasterKey = async (req, res, next) => {
  try {
    await authService.rotateMasterKey(req.user.id, req.body);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
