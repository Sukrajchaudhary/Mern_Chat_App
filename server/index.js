require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
const { ConnectToDb } = require("./db");
const cookieParser = require("cookie-parser");
const { Authentication } = require("./middleware/Authentication");
ConnectToDb();
const Userrouter = require("./routes/User");
const Conversationsrouter = require("./routes/Conversations");
const messageRouter = require("./routes/Message");
const authRouter = require("./routes/Auth");
const path = require('path');
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));

app.use("/api", Userrouter.router);
app.use("/api", Authentication, Conversationsrouter.router);
app.use("/api", Authentication, messageRouter.router);
app.use("/api", Authentication, authRouter.router);
// deployment

const __dirname1=path.resolve()
if(process.env.NODE_ENV==="productions"){
app.use(express.static(path.join(__dirname1,"/frontend/dist")));
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(__dirname1,"frontend","dist","index.html"))
})
  
  // Redirect all routes to /Login in production
  app.get('*', (req, res) => {
    res.redirect('/Login');
  });
}
else{
  app.get("/",(req,res)=>{
    res.send("API runnung successfully")
  })
  app.get('*', (req, res) => {
    res.redirect('/Login');
  });
}

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App is running on port localhost://8080`);
});
const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin:true
  },
});

let OnlineUsers = [];
io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  // listen to a connection
  socket.on("addNewUser", (userId) => {
    !OnlineUsers.some((user) => user.userId === userId) &&
      OnlineUsers.push({
        userId: userId,
        socketId: socket.id,
      });

    io.emit("getOnlineUsers", OnlineUsers);
  });
  // add messages
  socket.on("sendMessages", (message) => {
    const users = OnlineUsers.find((user) => user.userId === message?.receiverId);
    console.log("message",message)
    console.log(users)
    if(users){
      io.to(users.socketId).emit("getMessage", message);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnect", socket.id);
    OnlineUsers = OnlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", OnlineUsers);
  });
});
