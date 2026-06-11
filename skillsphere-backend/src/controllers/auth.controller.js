const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'SkillShare_fallback_dev_secret_change_in_prod';

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userObj = user.toObject ? user.toObject() : { ...user._doc };
  delete userObj.password;
  res.status(statusCode).json({ token, user: userObj });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleCallback = (req, res) => {
  const token = signToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/google?token=${token}`);
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
