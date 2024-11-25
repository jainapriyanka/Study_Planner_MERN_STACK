const webPush = require("web-push");
const Notification = require("../models/notificationModel");
const Subscription = require('../models/subscriptionModel'); 

// Configure VAPID keys
webPush.setVapidDetails(
  "mailto:your email@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);



// Get all stored subscriptions
exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json(subscriptions);
    } catch (error) {
        res.status(500).send('Error retrieving subscriptions');
    }
};

// Save subscription
// exports.subscribe = async (req, res) => {
//   try {
//     const { userId, subscription } = req.body;

//     // Save subscription to the database
//     const newSubscription = new Subscription({
//       user: userId,
//       subscription,
//     });
//     await newSubscription.save();

//     res.status(201).json({ message: "Subscription saved successfully!" });
//   } catch (error) {
//     console.error("Subscription failed:", error);
//     res.status(500).json({ error: "Failed to save subscription" });
//   }
// };
// exports.subscribe = async (req, res) => {
//   try {
//     const { userId, subscription } = req.body;
//     // Debugging: Check request body structure
//     console.log("Received subscription:", req.body);

//     // Validate the subscription structure
//     if (
//       !subscription ||
//       !subscription.endpoint ||
//       !subscription.keys ||
//       !subscription.keys.p256dh ||
//       !subscription.keys.auth
//     ) {
//       return res.status(400).json({ error: "Invalid subscription data" });
//     }

//     // Save subscription to the database
//     const newSubscription = new Subscription({
//       user: userId,
//       subscription: {
//         endpoint: subscription.endpoint,
//         keys: {
//           p256dh: subscription.keys.p256dh,
//           auth: subscription.keys.auth,
//         },
//       },
//     });
//     await newSubscription.save();

//     res.status(201).json({ message: "Subscription saved successfully!" });
//   } catch (error) {
//     console.error("Subscription failed:", error);
//     res.status(500).json({ error: "Failed to save subscription" });
//   }
// };
// Utility function to convert array of integers or ArrayBuffer to base64 string
const arrayToBase64 = (array) => {
  console.log("Array passed to arrayToBase64", array);
  console.log("Array Length", array.length);

  // If the input is an ArrayBuffer (or a string), convert accordingly
  if (array instanceof ArrayBuffer) {
    const uint8Array = new Uint8Array(array); // Create a Uint8Array from the ArrayBuffer
    return Buffer.from(uint8Array).toString("base64");
  }

  // If the input is a string (base64 format), we can directly return it
  if (typeof array === "string") {
    return array;  // Assuming the input is already base64-encoded
  }

  // Handle invalid input cases
  return null;
};

exports.subscribe = async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    console.log("Subscription from req.body", subscription.keys);

    if (!subscription || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return res.status(400).json({ error: "Invalid subscription data" });
    }

    // Convert `p256dh` and `auth` to base64 strings
    const p256dh = arrayToBase64(subscription.keys.p256dh);
    const auth = arrayToBase64(subscription.keys.auth);

    // Check if conversion resulted in valid strings
    if (!p256dh || !auth) {
      return res.status(400).json({ error: "Invalid subscription keys" });
    }

    // Format the subscription object
    const formattedSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh,
        auth,
      },
    };
    console.log("Formatted subscription", formattedSubscription);

    // Save the subscription to the database
    const newSubscription = new Subscription({
      user: userId,
      subscription: formattedSubscription,
    });
    await newSubscription.save();

    res.status(201).json({ message: "Subscription saved successfully!" });
  } catch (error) {
    console.error("Subscription failed:", error);
    res.status(500).json({ error: "Failed to save subscription" });
  }
};



// // Send notifications   
// exports.sendNotifications = async (req, res) => {
//   try {
//     const subscriptions = await Subscription.find(); // Fetch all subscriptions
//     console.log("All Subscriptions",subscriptions);

//     subscriptions.forEach((subscription) => {
//       const payload = JSON.stringify({
//         title: 'New Task',    
//         message: 'You have a new task assigned!',
//       });

//       webPush.sendNotification(subscriptions, payload).catch((error) => {
//         console.error('Error sending notification:', error);
//       });
//     });
 
//     res.send('Notifications sent');
//   } catch (error) { 
//     console.error('Error fetching subscriptions:', error);
//     res.status(500).send('Failed to send notifications');
//   }
// }; 


exports.sendNotifications = async ({ userId, title, message }) => {
  try {
    // Fetch the subscription for the given user
    const subscriptions = await Subscription.find({ user: userId });

    // Log all subscriptions for debugging
    console.log("All Subscriptions", subscriptions);
     // Create and save notification in the database
     const notification = new Notification({
      user: userId,
      title,
      message,
    });
    await notification.save();
    console.log("Notification saved to database successfully!");

    // Send notification to each subscription
    subscriptions.forEach(async (subscription) => {
      const payload = JSON.stringify({
        title,
        message
      });

      // Ensure the subscription is structured correctly
      if (subscription && subscription.subscription && subscription.subscription.endpoint) {
        const pushSubscription = {
          endpoint: subscription.subscription.endpoint,
          keys: {
            p256dh: subscription.subscription.keys.p256dh,
            auth: subscription.subscription.keys.auth
          }
        };

        // Send the notification
        try {
          const response = await webPush.sendNotification(pushSubscription, payload);
          console.log('Notification sent successfully', response);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      } else {
        console.error('Invalid subscription object:', subscription);
      }
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw new Error('Error sending notifications');
  }
};





// Fetch user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from route parameters

    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

