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
      required: true
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

// Cascade delete bookings when a single event is deleted (findByIdAndDelete / findOneAndDelete)
eventSchema.pre("findOneAndDelete", async function (next) {
  try {
    const event = await this.model.findOne(this.getFilter()); // get the event being deleted
    if (event) {
      await bookingModel.deleteMany({ eventId: event._id }); // delete related bookings
    }
    next();
  } catch (err) {
    next(err);
  }
});



module.exports = mongoose.model("Event", eventSchema);
