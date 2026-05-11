const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    user.github = req.body.github || user.github;
    user.portfolio = req.body.portfolio || user.portfolio;
    user.department = req.body.department || user.department;
    user.year = req.body.year || user.year;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: req.headers.authorization.split(' ')[1]
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user suggestions (skill-based)
// @route   GET /api/users/suggestions
// @access  Private
const getUserSuggestions = async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Find other users with similar skills
  const suggestions = await User.find({
    _id: { $ne: user._id },
    skills: { $in: user.skills }
  }).select('name profileImage skills bio').limit(5);

  res.json(suggestions);
};

module.exports = {
  updateUserProfile,
  getUserSuggestions
};
