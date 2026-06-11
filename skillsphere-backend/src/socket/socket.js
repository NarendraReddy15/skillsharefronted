const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    socket.join(userId);

    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    io.emit('user_online', { userId });

    console.log(`🟢 User connected: ${socket.user.name} (${userId})`);

    socket.on('join_match', (matchId) => {
      socket.join(matchId);
    });

    socket.on('leave_match', (matchId) => {
      socket.leave(matchId);
    });

    socket.on('typing', ({ matchId, isTyping }) => {
      socket.to(matchId).emit('user_typing', { userId, isTyping });
    });

    // WebRTC signaling for video/voice calls
    socket.on('call_user', ({ targetId, signal, callType }) => {
      io.to(targetId).emit('incoming_call', {
        from: userId,
        signal,
        callType,
        caller: { name: socket.user.name, avatar: socket.user.avatar }
      });
    });

    socket.on('answer_call', ({ targetId, signal }) => {
      io.to(targetId).emit('call_accepted', { signal });
    });

    socket.on('end_call', ({ targetId }) => {
      io.to(targetId).emit('call_ended');
    });

    socket.on('ice_candidate', ({ targetId, candidate }) => {
      io.to(targetId).emit('ice_candidate', { candidate });
    });

    socket.on('screen_share_start', ({ targetId }) => {
      io.to(targetId).emit('screen_share_started', { from: userId });
    });

    socket.on('screen_share_stop', ({ targetId }) => {
      io.to(targetId).emit('screen_share_stopped', { from: userId });
    });

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      io.emit('user_offline', { userId });
      console.log(`🔴 User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};


const getIO = () => io;

module.exports = { initSocket, getIO };
