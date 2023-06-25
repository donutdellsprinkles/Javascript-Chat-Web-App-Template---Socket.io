const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

var rooms = {};
var usernames = {};

io.on("connection", function (socket) {
  socket.on("join", function (room, username) {
    if (username !== "") {
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("receive", {
        name: "Server",
        content: username + " has joined the hub."
      });
      socket.emit("join", room);
    }
  });

  socket.on("send", function (messageData) {
    const { content, image } = messageData;
    io.in(rooms[socket.id]).emit("receive", {
      name: usernames[socket.id],
      content: content,
      image: image
    });
  });
});
