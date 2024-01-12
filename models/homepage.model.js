const { Schema, model } = require('mongoose');

const homepageSchema = new Schema(
  {
    blocks: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Homepage = model('Homepage', homepageSchema);

module.exports = Homepage;
