const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const moment = require('moment');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Initialize Express app
const app = express();
const uri = 'mongodb://127.0.0.1:27017/student';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Models
const Register = require("./models/registers");

// Define Faculty model
const Faculty = mongoose.model('Faculty', new mongoose.Schema({
  photo: String,
  name: String,
  department: String,
  designation: String
}));

// Set up view engine and static files
app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname, '../templates/views/partials'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: 'Allahisonlyoneandprophetmohammadwashisbelovedone786', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to set user in response locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Make user accessible in views
  next();
});

// Root route
app.get('/', (req, res) => {
  res.render('index'); // Ensure 'index.hbs' exists
});

// Login route
app.get('/login', (req, res) => {
  res.render('login'); // Ensure 'login.hbs' exists
});

// Registration route (GET)
app.get('/register', (req, res) => {
  res.render('register'); // Ensure 'register.hbs' exists
});

// Route for registration success page
app.get('/registration-success', (req, res) => {
  res.render('registration-success'); // Ensure this template exists
});

// Faculty route
app.get('/faculties', async (req, res) => {
  try {
    const faculties = await Faculty.find(); // Fetch faculty data from your database
    res.render('faculties', { faculties }); // Render the 'faculties.hbs' template with data
  } catch (error) {
    console.error('Error fetching faculty data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Sports clubs route
app.get('/sports-clubs', async (req, res) => {
  try {
    const faculties = await Faculty.find(); // Fetch faculty data from your database
    res.render('sports-clubs', { faculties }); // Render the 'sports-clubs.hbs' template with data
  } catch (error) {
    console.error('Error fetching sports data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Hostel facilities route
app.get('/hostel-facilities', async (req, res) => {
  try {
    const faculties = await Faculty.find(); // Fetch faculty data from your database
    res.render('hostel-facilities', { faculties }); // Render the 'sports-clubs.hbs' template with data
  } catch (error) {
    console.error('Error fetching hostel data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Cultural events route
app.get('/cultural-events', async (req, res) => {
  try {
    const faculties = await Faculty.find(); // Fetch faculty data from your database
    res.render('cultural-events', { faculties }); // Render the 'sports-clubs.hbs' template with data
  } catch (error) {
    console.error('Error fetching cultural events data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle registration form submission (POST)
app.post("/register", async (req, res) => {
  const { firstname, lastname, dob, password, confirmpassword, ...otherFields } = req.body;

  // Validate required fields
  if (!firstname || !lastname || !dob || !password || !confirmpassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if passwords match
  if (password !== confirmpassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const formattedDob = moment(dob, 'DD/MM/YYYY').toDate();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const registerStudent = new Register({
      firstname,
      lastname,
      dob: formattedDob,
      password: hashedPassword,
      ...otherFields
    });

    await registerStudent.save();
    
    // Render the success page
    res.redirect('/registration-success'); // Redirect to the success page
  } catch (error) {
    console.error("Error saving student:", error);
    res.status(400).json({ error: "Failed to save student", details: error.message });
  }
});

// Handle login form submission (POST)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Successful login, save user info in session
    req.session.user = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    res.redirect('/'); // Redirecting to homepage on successful login
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.redirect('/'); // Redirect to homepage after logout
  });
});

// About route (GET)
app.get('/about', (req, res) => {
  res.render('about'); // Ensure 'about.hbs' exists
});

// Optional: Handle contact form submission (POST)
app.post('/about', (req, res) => {
  const { name, email, message } = req.body;

  // Process the data (e.g., save to database or send an email)
  console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

  // Send a response back to the client
  res.send('Thank you for your message! We will get back to you soon.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
