const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-swipedRight -swipedLeft');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, bio, location, skills, experience, lookingFor } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, skills, experience, lookingFor },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path },
      { new: true }
    );
    res.json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.discoverUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const excludeIds = [
      req.user._id,
      ...currentUser.swipedRight,
      ...currentUser.swipedLeft,
      ...currentUser.matches
    ];

    const users = await User.find({ _id: { $nin: excludeIds } })
      .select('-swipedRight -swipedLeft -password')
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  const { q, skill } = req.query;
  try {
    const query = {};
    if (q) query.name = { $regex: q, $options: 'i' };
    if (skill) query['skills.name'] = { $regex: skill, $options: 'i' };

    const users = await User.find(query)
      .select('name avatar bio skills experience location')
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
