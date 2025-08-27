const eventModel = require("../models/event.model");

const fetchEventByUserId = async (req,res) => {
  try {
    const { userId } = req.params;
    const Events = await eventModel.find({ createdBy: userId });
    res.status(200)
    .json({"total" : Events.length, Events})
  } catch (error) {
    console.log(error);
  }
};

const deleteEventById = async (req,res) => {
    try {
        const { eventId } = req.params;
        const findEvent = await eventModel.findOneAndDelete({_id : eventId})
        res.status(200)
        .json({message : "Event deleted successfully!!!!" , deletedEvent : findEvent})
    } catch (error) {
        console.log(error)
    }
}

module.exports = { fetchEventByUserId , deleteEventById};
