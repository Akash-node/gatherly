const mongoose = require("mongoose");
const { Schema } = mongoose;
const bookingModel = require("../models/booking.model");

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Technology",
        "Business",
        "Education",
        "Health & Fitness",
        "Arts & Culture",
        "Sports",
        "Entertainment",
        "Finance",
        "Lifestyle",
      ],
    },
    banner : {
      type: String,
      require: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    time: {
      type: String,
      required: true,
      default: () =>
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the post
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Cascade delete bookings when an event is deleted
eventSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const eventId = this._id;
  await bookingModel.deleteMany({ eventId });
  next();
});

module.exports = mongoose.model("Event", eventSchema);
