const eventModel = require("../models/event.model");

//-----------Search Events from title and venue------------

const SearchEvents = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const result = await eventModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { venue: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } }
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      total: result.length,
      result,
    });
  } catch (error) {
    return res.status(500).json({
    error: error.message,
    });
      console.log(error.message);
  }
};

module.exports = {SearchEvents}