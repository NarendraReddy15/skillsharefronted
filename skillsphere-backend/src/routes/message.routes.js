const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { getMessages, sendMessage } = require('../controllers/message.controller');

router.get('/:matchId', protect, getMessages);
router.post('/:matchId', protect, sendMessage);

module.exports = router;
