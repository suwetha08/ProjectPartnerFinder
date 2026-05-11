const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [String],
  teamSize: { type: Number, required: true },
  currentTeamSize: { type: Number, default: 1 },
  techStack: [String],
  domain: String,
  deadline: Date,
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'closed'], default: 'open' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
