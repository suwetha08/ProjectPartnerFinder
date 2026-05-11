const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['application', 'acceptance', 'rejection', 'team_invite', 'project_update'], required: true },
  title: String,
  message: String,
  read: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
