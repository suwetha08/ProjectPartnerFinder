const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a project
// @route   POST /api/projects/create
// @access  Private/ProjectOwner
const createProject = async (req, res) => {
  const { title, description, requiredSkills, teamSize, techStack, domain, deadline } = req.body;

  const project = await Project.create({
    title,
    description,
    requiredSkills,
    teamSize,
    techStack,
    domain,
    deadline,
    owner: req.user._id,
    team: [req.user._id]
  });

  if (project) {
    res.status(201).json(project);
  } else {
    res.status(400).json({ message: 'Invalid project data' });
  }
};

// @desc    Get all projects (with filtering)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  const { domain, status, search } = req.query;
  let query = {};

  if (domain) query.domain = domain;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const projects = await Project.find(query).populate('owner', 'name profileImage').sort({ createdAt: -1 });
  res.json(projects);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email bio profileImage skills')
    .populate('team', 'name profileImage skills');

  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById
};
