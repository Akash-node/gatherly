require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
const connectdb = require("./src/database/connectDb.js")
const userRouter = require("./src/routes/user.route.js");
const eventRouter = require('./src/routes/event.route.js')
const bookingRouter = require('./src/routes/booking.route.js')
const profileRouter = require('./src/routes/profile.route.js')
const searchRouter = require('./src/routes/serach.route.js')

// Enable CORS
app.use(cors({
  origin: ["http://localhost:8081", "http://localhost:8080", "https://gatherly07.netlify.app"],  // Replace with your deployed frontend URL
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
app.use("/api/profile", profileRouter);
app.use("/api/search", searchRouter);

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