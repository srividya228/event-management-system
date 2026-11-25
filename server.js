
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load local environment variables from pro.env.
// Render uses its own Environment settings.
require('dotenv').config({ path: 'pro.env' });

const app = express();

// Environment variables
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(express.json());
app.use(cors());

// Serve HTML, CSS, JavaScript, and other static files
app.use(express.static(__dirname));

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Register API
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Login API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Event Booking API
// Supports both booking URLs used in your project.
async function createBooking(req, res) {
  const { event, date, time } = req.body;

  if (!event || !date || !time) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  try {
    const newBooking = new Booking({
      event,
      date,
      time,
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Booking successful',
      bookingDetails: {
        event,
        date,
        time,
      },
    });
  } catch (error) {
    console.error('Booking error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

app.post('/api/book', createBooking);
app.post('/book-event', createBooking);

// Get All Bookings API
async function getBookings(req, res) {
  try {
    const bookings = await Booking.find();

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

app.get('/api/bookings', getBookings);
app.get('/bookings', getBookings);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    message: 'Backend is running',
  });
});

// Serve Login Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'log.html'));
});

// Serve Registration Page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Start server after connecting to MongoDB
async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is missing');
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is missing');
    }

    await mongoose.connect(MONGO_URI);

    console.log('MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
}

startServer();
