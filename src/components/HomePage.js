import React, { useState, useEffect, useMemo } from "react";
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

  // ✅ FIX: stable default data (no eslint warning)
  const defaultAnnouncements = useMemo(() => [
    { id: 1, text: "Mid-term exams will start next week." },
    { id: 2, text: "New AI course has been launched." },
    { id: 3, text: "Holiday on Friday due to event." }
  ], []);

  const defaultNotices = useMemo(() => [
    { id: 1, text: "Submit assignments before deadline." },
    { id: 2, text: "Bring ID cards daily." },
    { id: 3, text: "Attendance below 75% required for exams." }
  ], []);

  const defaultMessages = useMemo(() => [
    { id: 1, text: "Welcome to dashboard!" },
    { id: 2, text: "Check attendance daily." },
    { id: 3, text: "New course added." }
  ], []);

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students") || "[]"));
    setAttendanceRecords(JSON.parse(localStorage.getItem("attendanceRecords")) || []);
    setAssignments(JSON.parse(localStorage.getItem("assignments")) || []);

    setAnnouncements(
      JSON.parse(localStorage.getItem("announcements")) || defaultAnnouncements
    );

    setNotices(
      JSON.parse(localStorage.getItem("notices")) || defaultNotices
    );

    setMessages(
      JSON.parse(localStorage.getItem("messages")) || defaultMessages
    );
  }, [defaultAnnouncements, defaultNotices, defaultMessages]);

  const presentCount = attendanceRecords.filter(
    r => r.totalDays > 0 && (r.presentDays / r.totalDays) >= 0.75
  ).length;

  const absentCount = students.length - presentCount;

  const chartData = [
    { name: "≥75%", value: presentCount },
    { name: "<75%", value: absentCount }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const avgAttendance =
    students.length === 0
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
      const percent =
        rec && rec.totalDays > 0
          ? Math.floor((rec.presentDays / rec.totalDays) * 100)
          : 0;
      return { name: s.name, percent };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);

  return (
    <div className="space-y-6 p-4 bg-gray-50">

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <div onClick={() => navigate("/students")} className="bg-blue-500 text-white p-4 rounded cursor-pointer">
          Students: {students.length}
        </div>

        <div onClick={() => navigate("/courses")} className="bg-orange-500 text-white p-4 rounded cursor-pointer">
          Courses: {uniqueCourses.length}
        </div>

        <div onClick={() => navigate("/attendance")} className="bg-green-500 text-white p-4 rounded cursor-pointer">
          Avg: {avgAttendance}%
        </div>

        <div onClick={() => navigate("/assignments")} className="bg-red-500 text-white p-4 rounded cursor-pointer">
          Assignments: {assignments.length}
        </div>

        <div onClick={() => navigate("/messages")} className="bg-purple-500 text-white p-4 rounded cursor-pointer">
          Messages: {messages.length}
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="mb-4 font-semibold">Attendance</h2>
          <div className="h-64">
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

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Top Students</h2>
          {topAttendance.map((s, i) => (
            <div key={i} className="flex justify-between border-b p-2">
              {s.name} <span>{s.percent}%</span>
            </div>
          ))}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Announcements</h2>
          {announcements.map(a => (
            <div key={a.id} className="border-b p-2">{a.text}</div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Notices</h2>
          {notices.map(n => (
            <div key={n.id} className="border-b p-2">{n.text}</div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Messages</h2>
          {messages.map(m => (
            <div key={m.id} className="border-b p-2">{m.text}</div>
          ))}
        </div>

      </div>

    </div>
  );
}