const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { getMatches, getMatch, unmatch } = require('../controllers/match.controller');

router.get('/', protect, getMatches);
router.get('/:id', protect, getMatch);
router.delete('/:id', protect, unmatch);

module.exports = router;
