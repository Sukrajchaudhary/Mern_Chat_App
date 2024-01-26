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
const { User } = require("./model/User");

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

const server = app.listen(8080, () => {
  console.log(`App is running on port localhost://8080`);
});
const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: true,
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
