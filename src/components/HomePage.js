import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Home() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students")) || []);
    setAttendanceRecords(JSON.parse(localStorage.getItem("attendanceRecords")) || []);
    setAssignments(JSON.parse(localStorage.getItem("assignments")) || []);

    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    setAdminName(settings.adminName || "Admin");

    const defaultAnnouncements = [
      { id: 1, text: "Mid-term exams will start next week." },
      { id: 2, text: "New AI course has been launched." },
      { id: 3, text: "Holiday on Friday due to event." }
    ];

    const defaultNotices = [
      { id: 1, text: "Submit assignments before deadline." },
      { id: 2, text: "Bring ID cards daily." },
      { id: 3, text: "Attendance below 75% required for exams." }
    ];

    setAnnouncements(JSON.parse(localStorage.getItem("announcements")) || defaultAnnouncements);
    setNotices(JSON.parse(localStorage.getItem("notices")) || defaultNotices);

    const defaultMessages = [
      { id: 1, text: "Welcome to dashboard!" },
      { id: 2, text: "Check attendance daily." },
      { id: 3, text: "New course added." }
    ];

    setMessages(JSON.parse(localStorage.getItem("messages")) || defaultMessages);
  }, []);

  // Attendance logic
  const presentCount = attendanceRecords.filter(r => r.totalDays > 0 && (r.presentDays / r.totalDays) >= 0.75).length;
  const absentCount = students.length - presentCount;

  const chartData = [
    { name: "≥75%", value: presentCount },
    { name: "<75%", value: absentCount }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const avgAttendance = students.length === 0
    ? 0
    : Math.floor(
        students.reduce((sum, s) => {
          const rec = attendanceRecords.find(r => r.studentId === s.id);
          if (!rec || rec.totalDays === 0) return sum;
          return sum + (rec.presentDays / rec.totalDays) * 100;
        }, 0) / students.length
      );

  const uniqueCourses = [...new Set(students.map(s => s.department))];

  const topAttendance = students
    .map(s => {
      const rec = attendanceRecords.find(r => r.studentId === s.id);
      const percent = rec && rec.totalDays > 0 ? Math.floor((rec.presentDays / rec.totalDays) * 100) : 0;
      return { name: s.name, percent };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);

  return (
<div className="space-y-6 p-3 sm:p-4 md:p-6 bg-gray-50">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"> */}
        <div onClick={()=>navigate("/students")} className="bg-blue-500 text-white p-3 sm:p-4 rounded cursor-pointer text-sm sm:text-base">
          Students: {students.length}
        </div>

        <div onClick={()=>navigate("/courses")} className="bg-orange-500 text-white p-4 rounded cursor-pointer">
          Courses: {uniqueCourses.length}
        </div>

        <div onClick={()=>navigate("/attendance")} className="bg-green-500 text-white p-4 rounded cursor-pointer">
          Avg: {avgAttendance}%
        </div>

        <div onClick={()=>navigate("/assignments")} className="bg-red-500 text-white p-4 rounded cursor-pointer">
          Assignments: {assignments.length}
        </div>

        <div onClick={()=>navigate("/messages")} className="bg-purple-500 text-white p-4 rounded cursor-pointer">
          Messages: {messages.length}
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded shadow">
          <h2 className="mb-4 font-semibold">Attendance</h2>
          <div className="h-48 sm:h-56 md:h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={80}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="mb-2 font-semibold">Top Students</h2>
          {topAttendance.map((s, i) => (
            <div key={i} className="flex justify-between p-2 border-b">
              {s.name} <span>{s.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-white p-4 rounded shadow">
          <h2 className="mb-2">Announcements</h2>
          {announcements.map(a => (
            <div key={a.id} className="p-2 border-b">{a.text}</div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="mb-2">Notices</h2>
          {notices.map(n => (
            <div key={n.id} className="p-2 border-b">{n.text}</div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="mb-2">Messages</h2>
          {messages.map(m => (
            <div key={m.id} className="p-2 border-b">{m.text}</div>
          ))}
        </div>

      </div>

    </div>
  );
}