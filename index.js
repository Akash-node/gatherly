require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
const connectdb = require("./src/database/connectDb.js")
const userRouter = require("./src/routes/user.route.js");
const eventRouter = require('./src/routes/event.route.js')
const bookingRouter = require('./src/routes/booking.route.js')

// Enable CORS for all origins and all routes
app.use(cors({
  origin: "http://localhost:8081/",  // Replace with your deployed frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json())
app.use(cookieParser())

// app.use("/", (req,res)=> {
//     res.send("Hello Akash, Your server is running!!!")
// })

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/booking", bookingRouter);

app.get("/hello",(req,res)=>{
    res.json({message:"Server is Successfully Deployed!!!"})
})

connectdb()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`🗄️  Server is running on Port: ${process.env.PORT}`);
    })
})
.catch((err) => {
   console.log("MongoDB Connection Failed" , err)
})