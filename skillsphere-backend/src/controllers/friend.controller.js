const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.sendRequest = async (req, res) => {
  const { toId } = req.body;
  try {
    if (toId === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot send request to yourself' });

    const existing = await FriendRequest.findOne({
      from: req.user._id,
      to: toId,
      status: 'pending'
    });
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    const request = await FriendRequest.create({ from: req.user._id, to: toId });

    await Notification.create({
      user: toId,
      type: 'friend_request',
      from: req.user._id,
      data: { requestId: request._id }
    });

    const io = req.app.get('io');
    if (io) io.to(toId).emit('friend_request', { from: req.user._id });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondRequest = async (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body;

  try {
    const request = await FriendRequest.findOne({ _id: requestId, to: req.user._id });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    await request.save();

    if (action === 'accept') {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { friends: request.from } });
      await User.findByIdAndUpdate(request.from, { $addToSet: { friends: req.user._id } });

      await Notification.create({
        user: request.from,
        type: 'friend_accept',
        from: req.user._id,
        data: { requestId: request._id }
      });

      const io = req.app.get('io');
      if (io) io.to(request.from.toString()).emit('friend_accepted', { by: req.user._id });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ to: req.user._id, status: 'pending' })
      .populate('from', 'name avatar skills bio');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'friends',
      'name avatar bio skills experience isOnline lastSeen'
    );
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFriend = async (req, res) => {
  const { friendId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: req.user._id } });
    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
