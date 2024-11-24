const Notification = require("../models/notificationModel");

// Function to send in-app notification
exports.sendInAppNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
    });
    await notification.save();
  } catch (error) {
    console.error("Error sending in-app notification:", error);
  }
};

exports.getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user.user.id })
        .sort({ createdAt: -1 }) // Sort by most recent
        .limit(10); // Limit the number of notifications
  
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      res.status(500).json({ error: "Error fetching notifications" });
    }
  };
  

