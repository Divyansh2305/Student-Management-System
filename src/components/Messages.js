import React, { useState, useEffect } from "react";

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const addMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      text,
      time: new Date().toLocaleString()
    };

    setMessages([newMsg, ...messages]);
    setText("");
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">

      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
        Messages
      </h1>

      {/* 🔹 Input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="border p-2 rounded w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addMessage(); }}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-blue-600 transition"
          onClick={addMessage}
        >
          Send
        </button>
      </div>

      {/* 🔹 Messages */}
      <div className="border rounded shadow h-[400px] sm:h-[500px] overflow-y-auto bg-gray-50 p-2 sm:p-3">

        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No messages yet
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-3 sm:p-4 rounded mb-2 shadow flex justify-between items-start gap-2"
            >
              <div className="flex-1">
                <p className="text-gray-800 text-sm sm:text-base break-words">
                  {msg.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.time}
                </p>
              </div>

              <button
                onClick={() => deleteMessage(msg.id)}
                className="text-red-500 hover:text-red-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}