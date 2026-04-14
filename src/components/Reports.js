import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, XAxis, YAxis, Bar, Legend
} from "recharts";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students")) || []);
    setAttendanceRecords(JSON.parse(localStorage.getItem("attendanceRecords")) || []);
  }, []);

  const fullRecords = students.map(s => {
    const rec = attendanceRecords.find(r => r.studentId === s.id) || { totalDays: 0, presentDays: 0 };
    const percent = rec.totalDays === 0 ? 0 : Math.floor((rec.presentDays / rec.totalDays) * 100);
    return {
      ...s,
      totalDays: rec.totalDays,
      presentDays: rec.presentDays,
      absentDays: rec.totalDays - rec.presentDays,
      attendancePercent: percent
    };
  });

  let filteredRecords = fullRecords.filter(r =>
    (departmentFilter === "All" || r.department === departmentFilter) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  filteredRecords.sort((a, b) => {
    if (sortKey === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? a.attendancePercent - b.attendancePercent
        : b.attendancePercent - a.attendancePercent;
    }
  });

  const uniqueDepartments = ["All", ...new Set(students.map(s => s.department))];

  const totalStudents = filteredRecords.length;
  const avgAttendance = totalStudents === 0 ? 0 :
    Math.floor(filteredRecords.reduce((sum, r) => sum + r.attendancePercent, 0) / totalStudents);

  const presentCount = filteredRecords.filter(r => r.attendancePercent >= 75).length;
  const absentCount = totalStudents - presentCount;

  const pieData = [
    { name: "≥75%", value: presentCount },
    { name: "<75%", value: absentCount }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const deptData = [...new Set(filteredRecords.map(r => r.department))].map(dep => {
    const deptStudents = filteredRecords.filter(r => r.department === dep);
    const avg = deptStudents.length === 0 ? 0 :
      Math.floor(deptStudents.reduce((sum, r) => sum + r.attendancePercent, 0) / deptStudents.length);
    return { department: dep, avgAttendance: avg };
  });

  const exportCSV = () => {
    const headers = ["Name", "Department", "Total Days", "Present", "Absent", "Attendance %"];
    const csv = [
      headers,
      ...filteredRecords.map(r => [
        r.name, r.department, r.totalDays,
        r.presentDays, r.absentDays, r.attendancePercent
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance_report.csv";
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
        Attendance Reports
      </h1>

      {/* 🔹 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

        <select
          className="border p-2 rounded w-full"
          value={departmentFilter}
          onChange={e => setDepartmentFilter(e.target.value)}
        >
          {uniqueDepartments.map((dep, i) => (
            <option key={i} value={dep}>{dep}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="attendancePercent">Sort by Attendance</option>
        </select>

        <select
          className="border p-2 rounded w-full"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button
          onClick={exportCSV}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Export CSV
        </button>
      </div>

      {/* 🔹 Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow text-center">
          Total Students<br /><b>{totalStudents}</b>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow text-center">
          Avg Attendance<br /><b>{avgAttendance}%</b>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded shadow text-center">
          Satisfactory<br /><b>{presentCount}</b>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow text-center">
          Below 75%<br /><b>{absentCount}</b>
        </div>
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded shadow h-72">
          <h2 className="font-semibold mb-2 text-center sm:text-left">
            Attendance Overview
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius="70%" label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow h-72">
          <h2 className="font-semibold mb-2 text-center sm:text-left">
            Department-wise Avg
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgAttendance" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto border rounded shadow">
        <table className="min-w-[700px] w-full text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-center">Total</th>
              <th className="px-4 py-2 text-center">Present</th>
              <th className="px-4 py-2 text-center">Absent</th>
              <th className="px-4 py-2 text-center">% </th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r, i) => (
              <tr
                key={i}
                className={
                  r.attendancePercent < 75
                    ? "bg-red-100"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                }
              >
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.department}</td>
                <td className="px-4 py-2 text-center">{r.totalDays}</td>
                <td className="px-4 py-2 text-center">{r.presentDays}</td>
                <td className="px-4 py-2 text-center">{r.absentDays}</td>
                <td className="px-4 py-2 text-center font-bold">
                  {r.attendancePercent}%
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}