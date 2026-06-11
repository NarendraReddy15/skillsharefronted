const Message = require('../models/Message');
const Match = require('../models/Match');
const Notification = require('../models/Notification');

exports.getMessages = async (req, res) => {
  const { matchId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 30;

  try {
    const match = await Match.findOne({ _id: matchId, users: req.user._id });
    if (!match) return res.status(403).json({ message: 'Access denied' });

    const total = await Message.countDocuments({ match: matchId });
    const messages = await Message.find({ match: matchId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    await Message.updateMany(
      { match: matchId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.json({ messages: messages.reverse(), total, page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { matchId } = req.params;
  const { content, type = 'text' } = req.body;

  try {
    const match = await Match.findOne({ _id: matchId, users: req.user._id });
    if (!match) return res.status(403).json({ message: 'Access denied' });

    const message = await Message.create({
      match: matchId,
      sender: req.user._id,
      content,
      type
    });

    await Match.findByIdAndUpdate(matchId, {
      lastMessage: message._id,
      lastMessageAt: new Date()
    });

    const populated = await message.populate('sender', 'name avatar');

    const recipientId = match.users.find((id) => id.toString() !== req.user._id.toString());
    await Notification.create({
      user: recipientId,
      type: 'message',
      from: req.user._id,
      data: { matchId, messageId: message._id, preview: content.substring(0, 50) }
    });

    const io = req.app.get('io');
    if (io) {
      // Emit only to recipient — sender already has the message from the HTTP response
      // Emitting to the whole room caused the double-message bug
      io.to(recipientId.toString()).emit('new_message', populated);
      io.to(recipientId.toString()).emit('notification', {
        type: 'message',
        from: req.user._id
      });
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
