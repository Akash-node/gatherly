const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema( {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    time: {
      type: String,
      required: true
    },
    venue: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0
    },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the post
    ref: 'User',
    required: true,
  },
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  })

  
module.exports = mongoose.model("Event", eventSchema);
