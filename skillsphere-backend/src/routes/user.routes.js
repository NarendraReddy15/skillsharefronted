const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  discoverUsers,
  searchUsers
} = require('../controllers/user.controller');

router.get('/discover', protect, discoverUsers);
router.get('/search', protect, searchUsers);
router.get('/:id', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
