const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/verify', authenticateToken, authController.verifyToken);

// ✅ Google OAuth — token-based (from @react-oauth/google)
router.post('/google', authController.googleAuth);

module.exports = router;