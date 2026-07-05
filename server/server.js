const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/trade', require('./routes/trade'));
app.use('/api/stocks', require('./routes/stocks'));

// Basic route
app.get('/', (req, res) => {
  res.send('SB Stocks API is running');
});

const { MongoMemoryServer } = require('mongodb-memory-server');

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    // Try to connect to the in-memory database to avoid local installation issues
    console.log('Starting In-Memory MongoDB...');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log(`In-Memory MongoDB connected successfully at ${mongoUri}`);
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();
