const eventModel = require("../models/event.model");
const userModel = require("../models/user.model");
const bookingModel = require("../models/booking.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//--------------Create Event-----------------------

const eventCreation = async (req, res) => {
  const { title, description, venue, price, capacity, date, time, category } =
    req.body;

  if (
    [title, description, venue, date, time, category].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    [price, capacity].some((field) => field === undefined || field === null)
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // ✅ Upload banner to Cloudinary
  let bannerUrl = null;
  console.log("req.file:", req.file); // 👀 Check if multer gave us a file

  if (req.file) {
  const uploadRes = await uploadOnCloudinary(req.file.path);
  console.log("uploadRes:", uploadRes); // 👀 See what Cloudinary returns
  bannerUrl = uploadRes?.secure_url || null;
}


  const newEvent = await eventModel.create({
    title,
    description,
    banner: bannerUrl, // save the uploaded file path
    venue,
    price,
    capacity,
    createdBy: req.user._id,
    date,
    time,
    category,
  });
  if (!newEvent) {
    return res.status(500).json({ message: "Failed to create event" });
  }
  return res.status(201).json({
    newEvent,
    message: "New Event created successfully",
  });
};

//--------------Update Event Details-----------------------

const updateEventDetails = async (req, res) => {
  const { id } = req.params;
  const { title, description, venue, price, capacity, date, time, category } =
    req.body;

  if (
    [title, description, venue, date, time, category].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    [price, capacity].some((field) => field === undefined || field === null)
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const findEvent = await eventModel.findOne({ _id: id });

  if (req.user.id == findEvent.createdBy) {
    const updatedEvent = await eventModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        venue,
        price,
        capacity,
        date,
        time,
        category,
      },
      {
        new: true, // return updated doc
        runValidators: true, // apply schema validation
      }
    );

    if (!updatedEvent) {
      res.status(404).json({ message: "Event not found!!!" });
    } else {
      res.status(200).json({ message: "Event updated", event: updatedEvent });
    }
  } else {
    res.status(404).json({ message: "You dont have access on this event!!!" });
  }
};

//--------------Delete Event-----------------------

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const findEvent = await eventModel.findOne({ _id: id });

  if (req.user.id == findEvent.createdBy) {
    const deletedEvent = await eventModel.findByIdAndDelete(id);
    if (!deletedEvent) {
      res.status(404).json({ message: "Event not found!!!" });
    } else {
      res.status(200).json({ message: "Event deleted" });
    }
  } else {
    res.status(404).json({ message: "You dont have access on this event!!!" });
  }
};

//--------------Retreive All Event-----------------------

const retreiveEvents = async (req, res) => {
  try {
    // find all events and sort by createdAt (latest first)
    const eventData = await eventModel.find().sort({ createdAt: -1 });

    if (!eventData || eventData.length === 0) {
      return res.status(404).json({ message: "Events not Retrieved!!!" });
    }

    res.status(200).json({ total: eventData.length, eventData });
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Server error while retrieving events" });
  }
};


//--------------Retreive Event From ID-----------------------

const retreiveEventById = async (req, res) => {
  const eventId = req.params.id;
  const eventData = await eventModel.findById(eventId);
  if (!eventData) {
    res.status(404).json({ message: "Event not Retreive!!!" });
  } else {
    res.status(200).json(eventData);
  }
};

//--------------Retrive All Register User On A Event-----------------------

const AllUserOfAEvent = async (req, res) => {
  const eventId = req.params.id;

  const userList = await bookingModel.find({
    eventId,
    status: "confirmed",
    paymentStatus: "paid",
  });

  if (!userList) {
    return res.status(404).json({
      message: "No User Found",
    });
  }

  return res.status(200).json({
    total: userList.length,
    userList,
  });
};

module.exports = {
  eventCreation,
  updateEventDetails,
  deleteEvent,
  retreiveEvents,
  retreiveEventById,
  AllUserOfAEvent,
};
