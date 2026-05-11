const express = require('express');
const router = express.Router();
const { applyToProject, updateApplicationStatus, getProjectApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.post('/:id/apply', protect, applyToProject);
router.get('/:id', protect, getProjectApplications);
router.put('/:id/:status', protect, updateApplicationStatus);

module.exports = router;
