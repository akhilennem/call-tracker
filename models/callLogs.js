const mongoose = require("mongoose")
const { v4: uuid } = require('uuid');

const callLogSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid
  },
  officerID: {
    type: String,
    index: true     
  },
  clientID: {
    type: String,
    index: true      
  },
  callType: {
    type: String,
    enum: ['incoming', 'outgoing'],
    index: true      
  },
  callDuration: {
    type: String
  },
  callOutcome: {
    type: String,
    enum: ['Successful', 'Missed', 'Follow-up'],
    index: true      
  },
  comment: {
    type: String
  }
}, {
  timestamps: true
});

callLogSchema.index({ officerID: 1, createdAt: -1 });

module.exports=mongoose.model('call',callLogSchema)