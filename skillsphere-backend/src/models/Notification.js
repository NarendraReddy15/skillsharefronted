const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['match', 'message', 'friend_request', 'friend_accept'],
    required: true
  },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed },
  read: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
