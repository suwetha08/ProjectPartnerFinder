const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserSuggestions } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateUserProfile);
router.get('/suggestions', protect, getUserSuggestions);

module.exports = router;
