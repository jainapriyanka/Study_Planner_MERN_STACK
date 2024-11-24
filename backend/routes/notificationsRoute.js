const express = require('express');
const router = express.Router();
const { fetchUser } = require('../Middleware/fetchUser');  // To authenticate the user
const { getNotifications } = require('../controllers/notificationController'); // Import the controller

// Route to get notifications for the authenticated user
router.get('/notifications', fetchUser, getNotifications);

module.exports = router;
