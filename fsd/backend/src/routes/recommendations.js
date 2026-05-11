const express = require('express');
const router = express.Router();
const { getRecommended } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRecommended);

module.exports = router;
