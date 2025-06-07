const eventModel = require("../models/event.model");
const userModel = require("../models/user.model");

//--------------Create Event-----------------------

const eventCreation = async (req, res) => {
  const { title, description, venue, price, capacity, availableSeats } =
    req.body;

  if (
    [title, description, venue].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    [price, capacity, availableSeats].some(
      (field) => field === undefined || field === null
    )
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const newEvent = await eventModel.create({
    title,
    description,
    venue,
    price,
    capacity,
    availableSeats,
    createdBy: req.user._id,
  });
  if (!newEvent) {
    return res.status(500).json({ message: "Failed to create event" });
  }
  return res
    .json({
      newEvent,
      message: "New Event created successfully",
    })
    .status(201);
};

//--------------Update Event Details-----------------------

const updateEventDetails = async (req, res) => {
  const { id } = req.params;
  const { title, description, venue, price, capacity, availableSeats } =
    req.body;

  if (
    [title, description, venue].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    [price, capacity, availableSeats].some(
      (field) => field === undefined || field === null
    )
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
        availableSeats,
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

module.exports = { eventCreation, updateEventDetails, deleteEvent };
