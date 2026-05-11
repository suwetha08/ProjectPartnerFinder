const Application = require('../models/Application');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Apply to a project
// @route   POST /api/applications/:id/apply
// @access  Private
const applyToProject = async (req, res) => {
  try {
    const { message } = req.body;
    const project = await Project.findById(req.params.id).populate('owner');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot apply to your own project' });
    }

    const alreadyApplied = await Application.findOne({
      project: req.params.id,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }

    const application = await Application.create({
      project: req.params.id,
      applicant: req.user._id,
      message
    });

    // Create notification for project owner
    await Notification.create({
      recipient: project.owner._id,
      type: 'application',
      title: 'New Application',
      message: `${req.user.name} applied to your project: ${project.title}`,
      relatedId: application._id
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Apply error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept/Reject application
// @route   PUT /api/applications/:id/:status
// @access  Private (Owner)
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('project');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this application' });
    }

    application.status = req.params.status;
    await application.save();

    if (req.params.status === 'accepted') {
      const project = await Project.findById(application.project._id);
      if (!project.team.includes(application.applicant)) {
        project.team.push(application.applicant);
        project.currentTeamSize += 1;
        await project.save();
      }
    }

    // Notify applicant
    await Notification.create({
      recipient: application.applicant,
      type: req.params.status === 'accepted' ? 'acceptance' : 'rejection',
      title: `Application ${req.params.status}`,
      message: `Your application for ${application.project.title} has been ${req.params.status}`,
      relatedId: application.project._id
    });

    res.json(application);
  } catch (error) {
    console.error('Update application error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications for a project
// @route   GET /api/applications/:id
// @access  Private (Owner)
const getProjectApplications = async (req, res) => {
  try {
    const applications = await Application.find({ project: req.params.id })
      .populate('applicant', 'name email skills department year profileImage');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToProject,
  updateApplicationStatus,
  getProjectApplications
};
