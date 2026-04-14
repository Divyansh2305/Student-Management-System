import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  ClipboardList,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  Phone,
  Megaphone
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Students", path: "/students", icon: <Users size={18} /> },
    { name: "Add Student", path: "/add-student", icon: <UserPlus size={18} /> },
    { name: "Courses", path: "/courses", icon: <BookOpen size={18} /> },
    { name: "Attendance", path: "/attendance", icon: <ClipboardList size={18} /> },
    { name: "Reports", path: "/reports", icon: <FileText size={18} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={18} /> },
    { name: "Assignments", path: "/assignments", icon: <FileText size={18} /> },

    // 🔥 FIXED: ANNOUNCEMENTS BACK
    { name: "Announcements", path: "/announcements", icon: <Megaphone size={18} /> },

    { name: "Notices", path: "/notices", icon: <Bell size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={18} /> },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >

        {/* HEADER */}
        <div className="p-4 text-lg font-bold border-b border-gray-700">
          🚀 Admin Panel
        </div>

        {/* MENU */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">

          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded transition
                ${active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}

        </nav>

        {/* FOOTER */}
        <div className="p-3 text-xs text-gray-400 border-t border-gray-700">
          © 2026 Admin Panel
        </div>
      </div>
    </>
  );
}