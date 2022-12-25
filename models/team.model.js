const { Schema, SchemaTypes, model } = require('mongoose');

const setter = (val) => new Date(val).getFullYear();

const teamSchema = new Schema(
  {
    teamName: {
      type: String,
      trim: true,
      min: [3, 'Name must be at least 3 charecters long'],
      required: [true, 'Name is required!']
    },
    teamType: {
      type: String,
      enum: ['Single', 'Double'],
      required: true
    },
    players: {
      type: [
        {
          type: SchemaTypes.ObjectId,
          ref: 'user',
          required: true
        }
      ],
      max: 2,
      min: 1,
      required: true
    },
    // playerOne: {
    //   type: SchemaTypes.ObjectId,
    //   ref: 'users',
    //   required: true
    // },
    // playerTwo: {
    //   type: SchemaTypes.ObjectId,
    //   ref: 'users'
    // },
    paymentStatus: {
      type: String,
      enum: ['Verified', 'Unverified'],
      default: 'Unverified',
      required: true
    },
    tournamentYear: {
      type: Date,
      set: setter,
      required: true
    }
  },
  { timestamps: true }
);

const Team = model('User', teamSchema);

module.exports = Team;
