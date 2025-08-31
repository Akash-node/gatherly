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

// Cascade delete bookings when an event is deleted
eventSchema.pre("deleteMany", async function (next) {
  const filter = this.getFilter(); // events being deleted
  const events = await this.model.find(filter);

  const eventIds = events.map(e => e._id);
  if (eventIds.length > 0) {
    await bookingModel.deleteMany({ eventId: { $in: eventIds } });
  }

  next();
});


module.exports = mongoose.model("Event", eventSchema);
