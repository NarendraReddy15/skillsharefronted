const router = require('express').Router();
const passport = require('passport');
const { body } = require('express-validator');
const { register, login, googleCallback, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

router.get('/me', protect, getMe);

module.exports = router;
