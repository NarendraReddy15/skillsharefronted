const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.swipe = async (req, res) => {
  const { targetId, direction } = req.body;
  const userId = req.user._id;

  try {
    if (userId.toString() === targetId) {
      return res.status(400).json({ message: 'Cannot swipe on yourself' });
    }

    const existing = await Swipe.findOne({ swiper: userId, swiped: targetId });
    if (existing) return res.status(400).json({ message: 'Already swiped on this user' });

    await Swipe.create({ swiper: userId, swiped: targetId, direction });

    if (direction === 'right') {
      await User.findByIdAndUpdate(userId, { $addToSet: { swipedRight: targetId } });

      const theyLikedUs = await Swipe.findOne({
        swiper: targetId,
        swiped: userId,
        direction: 'right'
      });

      if (theyLikedUs) {
        const match = await Match.create({ users: [userId, targetId] });

        await User.findByIdAndUpdate(userId, { $addToSet: { matches: targetId } });
        await User.findByIdAndUpdate(targetId, { $addToSet: { matches: userId } });

        await Notification.create([
          { user: userId, type: 'match', from: targetId, data: { matchId: match._id } },
          { user: targetId, type: 'match', from: userId, data: { matchId: match._id } }
        ]);

        const io = req.app.get('io');
        if (io) {
          io.to(targetId.toString()).emit('new_match', { matchId: match._id, userId });
          io.to(userId.toString()).emit('new_match', { matchId: match._id, userId: targetId });
        }

        return res.json({ matched: true, matchId: match._id });
      }
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { swipedLeft: targetId } });
    }

    res.json({ matched: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
