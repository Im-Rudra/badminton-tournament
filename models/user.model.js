const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: [3, 'Name must be at least 3 charecters long'],
      required: [true, 'Name is required!']
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
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Verified', 'Unverified'],
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
