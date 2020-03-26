const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Static
app.use(express.static(path.join(__dirname, "public")));

const botName = "Admin";
// run when client connects
io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to chat"));

    //   broadcast when user connects
    socket.broadcast.emit(
      "message",
      formatMessage(botName, "user joined chat")
    );
  });

  //   listen fqor chat message
  socket.on("chatMessage", msg => {
    io.emit("message", formatMessage("USER", msg));
  });

  //   runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "User has left the chat"));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
