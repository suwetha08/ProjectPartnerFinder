const Project = require('../models/Project');

/**
 * Calculate match score between user skills and project required skills
 * @param {Array} userSkills 
 * @param {Array} projectSkills 
 * @returns {Number} Match percentage (0-100)
 */
const calculateMatchScore = (userSkills, projectSkills) => {
  if (!userSkills || !projectSkills || projectSkills.length === 0) return 0;
  
  const matchedSkills = userSkills.filter(skill => 
    projectSkills.some(ps => ps.toLowerCase() === skill.toLowerCase())
  );
  
  return (matchedSkills.length / projectSkills.length) * 100;
};

/**
 * Get recommended projects based on user skills
 * @param {Object} user 
 * @returns {Promise<Array>} Recommended projects
 */
const getRecommendedProjects = async (user) => {
  const projects = await Project.find({ status: 'open' })
    .populate('owner', 'name profileImage');
    
  const scoredProjects = projects.map(project => {
    const score = calculateMatchScore(user.skills, project.requiredSkills);
    return { ...project.toObject(), matchScore: score };
  });

  return scoredProjects
    .filter(p => p.matchScore > 30) // Minimum match threshold
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
};

module.exports = {
  calculateMatchScore,
  getRecommendedProjects
};
