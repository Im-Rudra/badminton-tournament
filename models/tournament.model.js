const { Schema, model, SchemaTypes } = require('mongoose');

const setter = (val) => new Date(val).getFullYear();

const tournamentSchema = new Schema(
  {
    tournamentName: {
      type: String,
      trim: true,
      min: [3, 'Name must be at least 3 charecters long'],
      required: [true, 'tournament name is required!']
      // unique: true
    },
    creator: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      required: true
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true
    },
    endTime: {
      type: Date,
      default: () => Date.now() + 604800000, // +7 days
      required: true
    },
    singlePlayerEntryFee: {
      type: Number,
      required: true
    },
    doublePlayerEntryFee: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    paymentPhoneNumber: {
      type: String,
      match: /^(?!.*--)[0-9-]+$/,
      required: true
    },
    tournamentYear: {
      type: String,
      default: () => new Date().getFullYear(),
      set: setter,
      required: true
    },
    totalTeams: {
      type: Number,
      default: 0,
      required: true
    },
    singleTeams: {
      type: Number,
      default: 0,
      required: true
    },
    doubleTeams: {
      type: Number,
      default: 0,
      required: true
    }
  },
  { timestamps: true }
);

const Tournament = new model('Tournament', tournamentSchema);

module.exports = Tournament;
