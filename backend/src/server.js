const express = require("express")
const {createServer} = require("http")
const {Server} = require("socket.io")

const app = express()
const server = createServer(app)
const port = 3333

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", socket => {
    console.log(`a user connected: ${socket.id}`)

    socket.on("join_room", ({user, room}) => {
        socket.join(room)
    })

    socket.on("send_msg", ( {room, user, message} ) => {
        const d = {user: user, message: message}
        socket.to(room).emit("recived_msg", d)
    })
})

app.use(express.json())

server.listen(port, () => console.log(`Server running in port ${port}`))