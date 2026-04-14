import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const COLORS = ["#22c55e", "#ef4444"];

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
    const storedAttendance = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    setStudents(storedStudents);

    const records = storedStudents.map((s) => {
      const existing = storedAttendance.find((r) => r.studentId === s.id);
      return existing || { studentId: s.id, presentDays: 0, totalDays: 0 };
    });
    setAttendanceRecords(records);
  }, []);

  const toggleAttendance = (id) => {
    const updated = attendanceRecords.map((r) =>
      r.studentId === id ? { ...r, today: !r.today } : r
    );
    setAttendanceRecords(updated);
  };

  const saveAttendance = () => {
    const updatedRecords = attendanceRecords.map((r) => {
      const newTotal = r.totalDays + 1;
      const newPresent = r.presentDays + (r.today ? 1 : 0);
      return { studentId: r.studentId, presentDays: newPresent, totalDays: newTotal };
    });

    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));

    const cleared = updatedRecords.map((r) => ({ ...r, today: false }));
    setAttendanceRecords(cleared);

    alert("Attendance saved for today!");
  };

  const resetAttendance = () => {
    const reset = attendanceRecords.map((r) => ({ ...r, today: false }));
    setAttendanceRecords(reset);
  };

  const presentCount = attendanceRecords.filter(
    (r) => r.totalDays > 0 && r.presentDays / r.totalDays >= 0.75
  ).length;

  const absentCount = students.length - presentCount;

  const chartData = [
    { name: "≥ 75%", value: presentCount },
    { name: "< 75%", value: absentCount },
  ];

  const avgAttendance =
    students.length === 0
      ? 0
      : Math.floor(
          students.reduce((sum, s) => {
            const rec = attendanceRecords.find((r) => r.studentId === s.id);
            return rec && rec.totalDays > 0
              ? sum + (rec.presentDays / rec.totalDays) * 100
              : sum;
          }, 0) / students.length
        );

  const topAttendance = students
    .map((s) => {
      const rec = attendanceRecords.find((r) => r.studentId === s.id);
      const percent =
        rec && rec.totalDays > 0
          ? Math.floor((rec.presentDays / rec.totalDays) * 100)
          : 0;
      return { name: s.name, percent };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
        Attendance Management
      </h1>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="bg-green-500 text-white p-4 rounded shadow text-center">
          Average Attendance <br />
          <span className="text-xl font-bold">{avgAttendance}%</span>
        </div>

        <button
          onClick={saveAttendance}
          className="bg-blue-500 text-white p-4 rounded shadow w-full"
        >
          Save Today's Attendance
        </button>

        <button
          onClick={resetAttendance}
          className="bg-yellow-500 text-white p-4 rounded shadow w-full"
        >
          Reset / New Day
        </button>
      </div>

      {/* 🔹 Pie Chart */}
      <div className="bg-white p-4 rounded shadow h-64 sm:h-72">
        <h2 className="font-semibold mb-2 text-center sm:text-left">
          Attendance Overview
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center">No students available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 🔹 Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Mark Attendance</h2>

        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full border text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">P / T</th>
                <th className="border p-2">%</th>
                <th className="border p-2">Today</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => {
                const rec =
                  attendanceRecords.find((r) => r.studentId === s.id) || {
                    presentDays: 0,
                    totalDays: 0,
                  };

                const today = rec.today || false;
                const percent =
                  rec.totalDays === 0
                    ? 0
                    : Math.floor((rec.presentDays / rec.totalDays) * 100);

                return (
                  <tr key={s.id} className={percent < 75 ? "bg-red-50" : ""}>
                    <td className="border p-2">{s.name}</td>
                    <td className="border p-2">{s.department}</td>
                    <td className="border p-2">
                      {rec.presentDays}/{rec.totalDays}
                    </td>
                    <td className="border p-2">{percent}%</td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={today}
                        onChange={() => toggleAttendance(s.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Top 5 */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2 text-center sm:text-left">
          Top 5 Attendance
        </h2>

        <div className="space-y-2">
          {topAttendance.map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-2 bg-purple-50 rounded"
            >
              <span className="font-medium">{s.name}</span>
              <span className="font-bold">{s.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}