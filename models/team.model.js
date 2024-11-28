const { Schema, SchemaTypes, model } = require('mongoose');

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
    teamLeader: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    fullName_1: {
      type: String,
      required: true
    },
    phone_1: {
      type: String,
      required: true
    },
    fullName_2: String,
    phone_2: String,
    paymentStatus: {
      type: String,
      enum: ['Verified', 'Unverified'],
      default: 'Unverified',
      required: true
    },
    paymentId: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const Team = new model('Team', teamSchema);

module.exports = Team;
