const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/create', protect, authorize('project_owner', 'admin'), createProject);

module.exports = router;
