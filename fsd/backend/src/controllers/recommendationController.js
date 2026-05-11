const Project = require('../models/Project');
const { getRecommendedProjects } = require('../utils/matchingAlgorithm');

// @desc    Get recommended projects for current user
// @route   GET /api/projects/recommended
// @access  Private
const getRecommended = async (req, res) => {
  const recommendations = await getRecommendedProjects(req.user);
  res.json(recommendations);
};

module.exports = { getRecommended };
