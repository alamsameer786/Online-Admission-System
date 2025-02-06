
  
const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/student';

mongoose.connect(uri)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

