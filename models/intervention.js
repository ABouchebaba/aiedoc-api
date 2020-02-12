const mongoose = require("mongoose");

const intervention = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  counterparty: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

exports.intervention = intervention;
