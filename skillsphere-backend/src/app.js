require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport);

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const swipeRoutes = require('./routes/swipe.routes');
const matchRoutes = require('./routes/match.routes');
const messageRoutes = require('./routes/message.routes');
const friendRoutes = require('./routes/friend.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.use(cors({
  origin: '*',
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'SkillShare' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
