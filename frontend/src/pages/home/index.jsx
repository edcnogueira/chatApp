import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 } from "uuid";

const port = 3333;
const socket = io(`http://localhost:${port}`);

export const Home = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [chatIsVisible, setChatIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("connected", socket.connected);
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [isConnected]);

  useEffect(() => {
    socket.on("recived_msg", ({ user, message }) => {
      const msg = `${user} send: ${message}`;
      setMessages(prevState => [...prevState, msg]);
    });
  }, [socket]);

  const handleEnterChatRoom = () => {
    if (user !== "" && room !== "") {
      setChatIsVisible(true);
      socket.emit("join_room", { user, room });
    }
  };

  const handleSendMessage = () => {
    const newMsgData = {
      room: room,
      user: user,
      message: newMessage,
    };

    console.log(newMsgData);

    socket.emit("send_msg", newMsgData);
    const msg = `${user} send: ${newMessage}`;
    setMessages(prevState => [...prevState, msg]);
    setNewMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      {!chatIsVisible ? (
        <>
          <input
            type="text"
            placeholder="user"
            value={user}
            onChange={e => setUser(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="room"
            value={room}
            onChange={e => setRoom(e.target.value)}
          />
          <button onClick={handleEnterChatRoom}>Enter</button>
        </>
      ) : (
        <>
          <h5>
            Room {room} | User: {user}
          </h5>

          <div
            style={{
              heigh: 200,
              width: 250,
              border: "1px solid #000",
              overflowY: "scroll",
              marginBottom: 10,
              padding: 10,
            }}
          >
            {messages.map(el => (
              <div key={v4()}>{el}</div>
            ))}
          </div>
          <input
            type="text"
            placeholder="message"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send message</button>
        </>
      )}
    </div>
  );
};
