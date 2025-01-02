// backend (Express + Socket.IO)
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const users = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-call", (userId) => {
    users[userId] = socket.id;
    console.log(`${userId} joined the call`);
  });

  socket.on("offer", (data) => {
    io.to(users[data.target]).emit("offer", {
      offer: data.offer,
      from: data.from,
    });
  });

  socket.on("answer", (data) => {
    io.to(users[data.target]).emit("answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    io.to(users[data.target]).emit("ice-candidate", data.candidate);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socket.id === socketId) {
        delete users[userId];
        break;
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(8000, () => console.log("Server running on port 8000"));
