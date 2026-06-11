const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI is not defined in .env file');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (err) {
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('❌ MongoDB authentication failed!');
      console.error('   → Check your username & password in the .env MONGO_URI');
      console.error('   → Go to Atlas → Database Access to verify/reset credentials');
    } else {
      console.error(`❌ MongoDB error: ${err.message}`);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
