const express = require("express");
const {
  subscribe,
  sendNotifications,
  getUserNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/notification/subscribe", subscribe); // Save subscription
router.post("/send", sendNotifications); // Send push notification
router.get("/user/:userId", getUserNotifications); // Fetch user notifications

module.exports = router;
 