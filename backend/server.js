const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());



app.use(cors({ origin: 'http://localhost:3000' })); // Frontend uygulamanızın portunu belirtin


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/adminpanel', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const userRoutes = require('./routes/userRoutes'); // Ensure this path is correct

// Use user routes
app.use('/api', userRoutes); // Routes should be mounted on '/api'

// Handle invalid routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
