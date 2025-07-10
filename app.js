const express = require('express')
const mongoose = require('mongoose')
const callRoute = require('./routes/callRoutes') 
const officerRoute = require('./routes/officerRoute') 
const clientRoute = require('./routes/clientRoute') 
const analyticsRoute = require('./routes/analyticsRoute') 
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require('express-rate-limit');

const app=express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 100,                  
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,     
  legacyHeaders: false,    
});

app.use(limiter);


app.use(express.json())

app.use('/calls',callRoute)
app.use('/officer',officerRoute)
app.use('/clients',clientRoute)
app.use('/analytics',analyticsRoute)

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("logCall", async (data) => {
    try {
      const { officerID, clientID, callType, callOutcome, comment, callDuration } = data;

      if (!officerID || !clientID || !callType || !callOutcome || !callDuration) {
        socket.emit("error", { message: "Some fields are missing..." });
        return;
      }

      const newCallLog = new CallLogSchema({ officerID, clientID, callType, callOutcome, comment, callDuration });
      const response = await newCallLog.save();

      socket.emit("callLogged", { success: true, message: "Call logged successfully", data: response });

      socket.broadcast.emit("newCallEntry", response);

    } catch (error) {
      socket.emit("error", { message: "Error", error: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});



app.listen((8000),()=>{
    console.log("App running on localhost:8000");  
})

mongoose.connect("mongodb://localhost:27017/springboot").then(()=>{
    console.log("db connected succesfully")
})