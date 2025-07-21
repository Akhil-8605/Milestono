const jwt = require("jsonwebtoken");
const Notification = require("../models/notification");

const userSockets = {}; 

module.exports = function initNotificationSocket(io) {
  io.on("connection", (socket) => {

    socket.on("register", ({ token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userSockets[decoded.email] = socket.id;
      } catch (err) {
        console.error("Invalid token in register:", err.message);
      }
    });

    socket.on("mark-notification-read", async ({ notificationId }) => {
      try {
        const updated = await Notification.findByIdAndUpdate(
          notificationId,
          { read: true },
          { new: true }
        );

        socket.emit("notification-read-confirmed", updated);
      } catch (err) {
        console.error("Error marking notification as read:", err.message);
        socket.emit("error", { message: "Failed to mark notification as read" });
      }
    });

    socket.on("get-unread-notifications", async ({ token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const notifications = await Notification.find({
          email: decoded.email,
          read: false,
        }).sort({ createdAt: -1 });

        socket.emit("unread-notifications", notifications);
      } catch (err) {
        console.error("Error getting unread notifications:", err.message);
        socket.emit("error", { message: "Failed to fetch unread notifications" });
      }
    });

    socket.on("disconnect", () => {
      for (const [email, id] of Object.entries(userSockets)) {
        if (id === socket.id) {
          delete userSockets[email];
          break;
        }
      }
    });
  });

  return {
    sendNotificationToUser: async ({ email, data }) => {
      try {
        const created = await Notification.create(data);
        const socketId = userSockets[email];
        if (socketId) {
          io.to(socketId).emit("new-notification", created);
        }
      } catch (err) {
        console.error("Failed to send notification to user:", err.message);
      }
    },
  };
};
