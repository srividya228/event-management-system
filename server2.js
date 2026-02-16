require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
  event: String,
  date: String,
  time: String
});

const Booking = mongoose.model('Booking', bookingSchema);

// Route to handle event booking
app.post('/book-event', async (req, res) => {
  const { event, date, time } = req.body;

  if (!event || !date || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBooking = new Booking({ event, date, time });
    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get all bookings
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
