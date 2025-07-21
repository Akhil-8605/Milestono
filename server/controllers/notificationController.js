const Notification = require("../models/notification.js");
const jwt = require("jsonwebtoken");

const getNotificationsByToken = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const notifications = await Notification.find({
      email,
      read: false
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting unread notifications:", error.message);
    res.status(400).json({ error: "Invalid token or request" });
  }
};


const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getNotificationsByToken,
  markAsRead,
};
