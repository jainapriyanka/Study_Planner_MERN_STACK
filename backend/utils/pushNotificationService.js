// utils/pushNotificationService.js

const webPush = require('web-push');

// Setting up VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();
webPush.setVapidDetails(
  'mailto:youremail@gmail.com',  // Replace with your email address
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Function to send a push notification
const sendPushNotification = (subscription, payload) => {
  webPush.sendNotification(subscription, payload)
    .catch(error => {
      console.error("Error sending push notification:", error);
    });
};

module.exports = { sendPushNotification };
