const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const {
  sendRequest,
  respondRequest,
  getPendingRequests,
  getFriends,
  removeFriend
} = require('../controllers/friend.controller');

router.get('/', protect, getFriends);
router.get('/requests', protect, getPendingRequests);
router.post('/request', protect, sendRequest);
router.put('/request/:requestId', protect, respondRequest);
router.delete('/:friendId', protect, removeFriend);

module.exports = router;
