require('dotenv').config();

// Warn about missing optional env vars (non-fatal)
const WARN_VARS = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'CLOUDINARY_CLOUD_NAME'];
WARN_VARS.forEach((v) => {
  if (!process.env[v] || process.env[v].startsWith('your_')) {
    console.warn(`⚠️  ${v} not configured — related features will not work`);
  }
});

const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/socket/socket');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`\n🚀 SkillShare server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
