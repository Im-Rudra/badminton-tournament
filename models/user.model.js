const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      min: [2, 'first name must be at least 3 charecters long'],
      required: [true, 'first name is required!']
    },
    lastName: {
      type: String,
      trim: true,
      min: [2, 'last name must be at least 3 charecters long'],
      required: [true, 'last name is required!']
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Email is required!']
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Phone is required!']
    },
    hash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Administrator', 'Moderator', 'User'],
      default: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
