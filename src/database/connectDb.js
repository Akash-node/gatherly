const mongoose = require("mongoose")

const connectdb = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    console.log(`MongoDB Connected !! DB Host : ${connectionInstance.connection.host}`)

  } catch (error) {
    console.log("MongoDB Connection failed: ", error)
  }
};
module.exports = connectdb;