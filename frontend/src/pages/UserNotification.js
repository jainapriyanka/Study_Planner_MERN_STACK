import React, { useEffect, useState } from "react";
import axios from "axios";

const UserNotifications = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve userId from localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID not found in localStorage. Please log in again.");
      return;
    }

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/${userId}`
        );
        setNotifications(response.data);
        setNotificationCount(response.data.length); 
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, [setNotificationCount]);

  return (
    <div>
      <h2>Your Notifications</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <strong>{notification.title}</strong>: {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications;
