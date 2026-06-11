const Match = require('../models/Match');
const Message = require('../models/Message');

exports.getMatches = async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user._id })
      .populate('users', 'name avatar bio skills experience isOnline lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1, createdAt: -1 });

    const formatted = matches.map((m) => ({
      _id: m._id,
      createdAt: m.createdAt,
      lastMessage: m.lastMessage,
      lastMessageAt: m.lastMessageAt,
      user: m.users.find((u) => u._id.toString() !== req.user._id.toString())
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMatch = async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      users: req.user._id
    }).populate('users', 'name avatar bio skills experience isOnline lastSeen');

    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unmatch = async (req, res) => {
  try {
    const match = await Match.findOneAndDelete({
      _id: req.params.id,
      users: req.user._id
    });
    if (!match) return res.status(404).json({ message: 'Match not found' });
    await Message.deleteMany({ match: match._id });
    res.json({ message: 'Unmatched successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
