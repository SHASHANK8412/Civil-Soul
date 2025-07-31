const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/volunteering', require('./routes/volunteering'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/mental-health', require('./routes/mentalHealth'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/counselling', require('./routes/counselling'));
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/environment', require('./routes/environment'));
app.use('/api/elderly-care', require('./routes/elderlyCare'));
app.use('/api/blood-donation', require('./routes/bloodDonation'));
app.use('/api/animal-welfare', require('./routes/animalWelfare'));
app.use('/api/contact', require('./routes/contact'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civilsoul', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
