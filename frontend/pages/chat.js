import { useEffect, useState, useRef } from "react";
import socket from "@/utils/socket/socket";
import withAuth from "../hoc/withAuth";
import { useRouter } from "next/router";

function Chat() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(""); // Assuming username is stored
  const router = useRouter();
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Access localStorage in the client
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    // Register user in WebSocket
    if (storedUsername) {
      socket.emit("register", storedUsername);
    }

    // Fetch user list
    fetch("http://localhost:3000/auth/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    // Handle new messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
    });

    // Update active users
    socket.on("updateActiveUsers", (activeUsers) => {
      console.log("Active users:", activeUsers);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateActiveUsers");
    };
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetch(`http://localhost:3000/chat/history/${username}/${activeUser}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages(
            data.map((msg) => ({
              ...msg,
              from: msg.sender, // Ensure sender is properly mapped
              to: msg.receiver, // Ensure receiver is properly mapped
            }))
          );
        });
    }
  }, [activeUser, username]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message && activeUser) {
      const data = { to: activeUser, from: username, message };
      socket.emit("message", data);
      setMessages((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
      setMessage("");
    }
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("authToken");
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow"
      >
        Logout
      </button>
      <div className="flex h-screen">
        {/* User List */}
        <div className="w-1/4 bg-gray-100 p-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className={`p-2 cursor-pointer ${
                  activeUser === user.username ? "bg-gray-300" : ""
                }`}
                onClick={() => setActiveUser(user.username)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">
            Chat with {activeUser || "..."}
          </h2>
          <div className="h-96 bg-white p-4 shadow-md rounded overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <p>No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  <strong>{msg.from || msg.receiver}: </strong>
                  <span>{msg.message || msg.content}</span>{" "}
                  {/* Make sure you handle message data correctly */}
                </div>
              ))
            )}
            <div ref={messageEndRef} />
          </div>
          {activeUser && (
            <div className="flex">
              <input
                type="text"
                className="flex-1 border p-2 rounded-l"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 rounded-r"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default withAuth(Chat);
