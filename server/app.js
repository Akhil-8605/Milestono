require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const passport = require("./config/googleAuth");
const session = require("express-session");
const { Server } = require("socket.io");
const initNotificationSocket = require("./socket/notificationSocket");
const { PORT, MONGO_URI, JWT_SECRET, FRONT_END_URL } = process.env;

// Middleware
app.use(cors({
  origin: FRONT_END_URL,
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST"]
  }
});

const notificationSocket = initNotificationSocket(io);
app.set("notificationSocket", notificationSocket);

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


// Routes
app.use('/api', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/propertyRoutes'));
app.use('/api', require('./routes/accountRoutes'));
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api', require('./routes/otherRoutes'));
app.use('/api', require('./routes/homePageRoutes'));
app.use('/api', require('./routes/enquiryRoutes'));
app.use('/api', require('./routes/feedbackRoutes'));
app.use('/api', require('./routes/projectRoutes'));
app.use('/api', require('./routes/galleryImageRoutes'));
app.use('/api', require('./routes/bankRoutes'));
app.use('/api', require('./routes/agentRoutes'));
app.use('/api', require('./routes/verifiedAgentRoutes'));
app.use('/api', require('./routes/agentDashboardRoutes'));
app.use('/api', require('./routes/allServiceRoutes'));

app.use('/api', require('./routes/vendorRoutes'));
app.use('/api', require('./routes/serviceRoutes'));

app.use('/api', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});