const router = require('express').Router();
const userController = require('../controllers/user');
const { body } = require('express-validator');
const validation = require('../handlers/validation');
const tokenHandler = require('../handlers/tokenHandler');
const User = require('../models/user');

// All routes require authentication
router.use(tokenHandler.verifyToken);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put(
    '/profile',
    body('username')
        .isLength({ min: 1, max: 10 })
        .withMessage('Username must be between 1 and 10 characters'),
    validation.validate,
    userController.updateProfile
);

// Get user analytics
router.get('/analytics', userController.getAnalytics);

module.exports = router;
