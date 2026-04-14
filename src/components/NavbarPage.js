import React, { useEffect, useState } from "react";
import { Bell, Search, Menu, Check, Trash2 } from "lucide-react";

export default function Navbar({ setIsOpen }) {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  // 🔥 LOAD ADMIN NAME FROM SETTINGS
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings"));
    if (saved?.adminName) {
      setAdminName(saved.adminName);
    }
  }, []);

  // 🔥 AUTO NOTIFICATIONS
  useEffect(() => {
    const messages = [
      "New student enrolled 🎓",
      "Attendance marked ✔",
      "New assignment added 📝",
      "Fee payment received 💰",
      "Course updated 📚",
      "New notice published 📢",
      "System backup completed 🔒",
      "New message from admin 💬",
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];

      setNotifications((prev) => [
        {
          id: Date.now(),
          text: msg,
          time: new Date().toLocaleTimeString(),
          read: false,
        },
        ...prev,
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      alert("Searching: " + search);
      setSearch("");
      setShowSearch(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full bg-white shadow-md px-3 sm:px-5 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-2xl"
        >
          <Menu />
        </button>

        <h1 className="text-sm font-bold text-gray-800">
          🎓 Student Management System
        </h1>
      </div>

      {/* SEARCH DESKTOP */}
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-full w-full max-w-md mx-4"
      >
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="bg-transparent w-full outline-none text-sm"
        />
      </form>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* MOBILE SEARCH */}
        <button
          className="md:hidden"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search />
        </button>

        {/* NOTIFICATIONS */}
        <div className="relative">

          <button onClick={() => setOpen(!open)} className="relative">
            <Bell className="w-6 h-6 text-gray-700" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border z-50">

              <div className="flex justify-between items-center p-2 border-b bg-gray-50">
                <p className="font-semibold text-sm">Notifications</p>

                <button
                  onClick={clearAll}
                  className="text-red-500 text-xs flex items-center gap-1"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">

                {notifications.length === 0 ? (
                  <p className="p-3 text-gray-500 text-sm">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b flex justify-between ${n.read ? "opacity-60" : ""
                        }`}
                    >
                      <div>
                        <p className="text-sm">{n.text}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>

                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-green-600"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        {/* PROFILE (WELCOME ABOVE ADMIN) */}
        <div className="flex items-center gap-2">

          {/* TEXT STACK */}
          <div className="hidden sm:flex flex-col leading-tight mr-2 text-right">

            {/* WELCOME (TOP) */}
            <span className="text-[11px] text-gray-500">
              Welcome back 👋
            </span>

            {/* ADMIN NAME (BOTTOM) */}
            <span className="text-sm font-bold text-gray-800">
              {adminName}
            </span>

          </div>

          {/* AVATAR */}
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">
            {adminName?.charAt(0)}
          </div>
        </div>

      </div>
    </div>
  );
}