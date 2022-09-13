const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);

const { Server } = require("socket.io");
const port = 3333;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", socket => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("join_room", ({ user, room }) => {
    socket.join(room);
  });

  socket.on("send_msg", ({ room, user, message }) => {
    const d = { user: user, message: message };
    socket.to(room).emit("recived_msg", d);
  });
});

app.use(express.json());

server.listen(port, () => console.log(`Server running in port ${port}`));
