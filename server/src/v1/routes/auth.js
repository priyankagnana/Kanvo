const router = require('express').Router();
const userController = require('../controllers/user');
const { body } = require('express-validator');
const validation = require('../handlers/validation');
const tokenHandler = require('../handlers/tokenHandler');
const User = require('../models/user');

router.post(
  '/signup',
  body('username')
    .isLength({ max: 10 })
    .withMessage('Username must be at most 10 characters')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already in use');
      }
    }),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  validation.validate,
  userController.register
);

router.post(
  '/login',
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .optional({ checkFalsy: true }),
  body('username')
    .isLength({ max: 10 })
    .withMessage('Username must be at most 10 characters')
    .optional({ checkFalsy: true }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validation.validate,
  userController.login
);

router.post('/verify-token', tokenHandler.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
