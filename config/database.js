const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.MONGO_URL;

mongoose.set('strictQuery', true);

const connectDB = async () => {
  const mongoOpt = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  try {
    await mongoose.connect(mongoURL, mongoOpt, () => {
      console.log('mongoDB connection successful!');
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
