import React, { useState, useEffect } from "react";

export default function Notices() {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notices")) || [];
    setList(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("notices", JSON.stringify(list));
  }, [list]);

  const addNotice = () => {
    if (!text.trim()) return;

    const newItem = {
      id: Date.now(),
      text: text.trim()
    };

    setList([newItem, ...list]);
    setText("");
  };

  const deleteNotice = (id) => {
    setList(list.filter((n) => n.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">

      <div className="bg-white rounded shadow p-4 sm:p-6 space-y-4">

        <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          Notices
        </h2>

        {/* 🔹 Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add notice..."
            className="border p-2 rounded w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") addNotice();
            }}
          />

          <button
            onClick={addNotice}
            className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-green-600 transition"
          >
            Add
          </button>
        </div>

        {/* 🔹 List */}
        <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto space-y-2">

          {list.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">
              No notices yet
            </p>
          ) : (
            list.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-green-50 rounded shadow-sm"
              >
                <span className="text-sm sm:text-base break-words">
                  {item.text}
                </span>

                <button
                  onClick={() => deleteNotice(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}