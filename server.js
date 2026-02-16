const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = 'your_secret_key'; // Change this to a secure secret

// 🛡️ **Middleware**
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5500', credentials: true })); 
app.use(express.static(__dirname)); 

// 🛢️ **Connect to MongoDB**
const MONGO_URI = 'mongodb://localhost:27017/Event';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 🧑‍💻 **User Schema**
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// 📅 **Booking Schema**
const bookingSchema = new mongoose.Schema({
  event: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);

// 📝 **Register API**
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: '✅ User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// 🔑 **Login API**
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: '❌ Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: '❌ Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: '✅ Login successful', token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// 🎟 **Event Booking API (NO Authentication Required)**
app.post('/api/book', async (req, res) => {
  const { event, date, time } = req.body;

  if (!event || !date || !time) {
    return res.status(400).json({ error: '❌ All fields are required' });
  }

  try {
    const newBooking = new Booking({ event, date, time });
    await newBooking.save();

    res.status(201).json({
      message: '✅ Booking successful',
      bookingDetails: { event, date, time }
    });
  } catch (error) {
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// 📋 **Get All Bookings (No Authentication Required)**
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: '❌ Internal server error' });
  }
});

// 🏠 **Serve log.html when visiting the root URL**
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'log.html'));
});

// 📌 **Serve register.html when visiting /register**
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// 🚀 **Start Server**
const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
