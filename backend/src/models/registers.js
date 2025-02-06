const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  mothername: {
    type: String,
    required: true,
    trim: true,
  },
  fathername: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  citypincode: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{6}$/.test(v); // Assuming it's a 6-digit postal code.
      },
      message: props => `${props.value} is not a valid pincode!`,
    },
  },
  contactnumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Assuming it's a 10-digit phone number.
      },
      message: props => `${props.value} is not a valid contact number!`,
    },
  },
  course: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
}, {
  timestamps: true,
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
