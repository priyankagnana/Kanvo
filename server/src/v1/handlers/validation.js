const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        param: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

exports.isObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ObjectId format');
  }
  return true;
};
