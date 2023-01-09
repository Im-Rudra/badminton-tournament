const { Schema, SchemaTypes, model } = require('mongoose');

const setter = (val) => new Date(val).getFullYear();

const teamSchema = new Schema(
  {
    teamName: {
      type: String,
      trim: true,
      required: [true, 'Name is required!']
    },
    tournament: {
      type: SchemaTypes.ObjectId,
      ref: 'Tournament',
      required: true
    },
    teamType: {
      type: String,
      enum: ['Single', 'Double'],
      required: true
    },
    // players: {
    //   type: [
    //     {
    //       type: SchemaTypes.ObjectId,
    //       ref: 'user',
    //       required: true
    //     }
    //   ],
    //   max: 2,
    //   min: 1,
    //   required: true
    // },
    firstPlayer: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    secondPlayer: {
      type: SchemaTypes.ObjectId,
      ref: 'User'
    },
    paymentStatus: {
      type: String,
      enum: ['Verified', 'Unverified'],
      default: 'Unverified',
      required: true
    }
    // tournamentYear: {
    //   type: Date,
    //   set: setter,
    //   required: true
    // }
  },
  { timestamps: true }
);

const Team = new model('Team', teamSchema);

module.exports = Team;
