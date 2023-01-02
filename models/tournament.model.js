const { Schema, model, SchemaTypes } = require('mongoose');

const setter = (val) => new Date(val).getFullYear();

const tournamentSchema = new Schema(
  {
    tournamentName: {
      type: String,
      trim: true,
      min: [3, 'Name must be at least 3 charecters long'],
      required: [true, 'tournament name is required!'],
      unique: true
    },
    creator: {
      type: SchemaTypes.ObjectId,
      ref: 'users',
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
    endTime: Date,
    year: {
      type: Number,
      default: Date.now,
      set: setter,
      required: true
    }
  },
  { timestamps: true }
);

const Tournament = new model('Tournament', tournamentSchema);

module.exports = Tournament;
