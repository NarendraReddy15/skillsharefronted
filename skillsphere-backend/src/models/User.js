const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  googleId: { type: String },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 500 },
  location: { type: String, default: '' },
  skills: [skillSchema],
  experience: {
    type: String,
    enum: ['Student', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Expert'],
    default: 'Student'
  },
  lookingFor: [String],
  swipedRight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  swipedLeft: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
