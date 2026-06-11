const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getNotifications,
  markRead,
  markOneRead,
  getUnreadCount
} = require('../controllers/notification.controller');

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markRead);
router.put('/:id/read', protect, markOneRead);

module.exports = router;
