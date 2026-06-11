const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { swipe } = require('../controllers/swipe.controller');

router.post('/', protect, swipe);

module.exports = router;
