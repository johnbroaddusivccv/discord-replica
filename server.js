const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Static
app.use(express.static(path.join(__dirname, "public")));

// run when client connects
io.on("connection", socket => {
  // Welcome current user
  socket.emit("message", "Welcome to chat");

  //   broadcast when user connects
  socket.broadcast.emit("message", "user joined chat");

  //   runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "User has left the chat");
  });

  //   listen for chat message
  socket.on("chatMessage", msg => {
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
