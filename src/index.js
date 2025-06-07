require('dotenv').config();
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const connectdb = require("./database/connectDb.js")
const userRouter = require("./routes/user.route.js");
const eventRouter = require('./routes/event.route.js')

app.use(express.json())
app.use(cookieParser())

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);

connectdb()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`🗄️  Server is running on Port: ${process.env.PORT}`);
    })
})
.catch((err) => {
   console.log("MongoDB Connection Failed" , err)
})