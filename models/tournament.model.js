const { Schema, model, SchemaTypes } = require('mongoose');

const setter = (val) => new Date(val).getFullYear();

const tournamentSchema = new Schema(
  {
    tournamentName: {
      type: String,
      trim: true,
      min: [3, 'Name must be at least 3 charecters long'],
      required: [true, 'Name is required!'],
      unique: true
    },
    creatorID: {
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
    tournamentYear: {
      type: Date,
      set: setter,
      required: true
    }
  },
  { timestamps: true }
);

const Tournament = new model('Tournament', tournamentSchema);

module.exports = Tournament;
