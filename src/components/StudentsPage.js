import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 15;

// 🔥 DEFAULT 25 STUDENTS + ATTENDANCE
const defaultStudents = Array.from({ length: 25 }).map((_, i) => {
  const total = 30;
  const present = Math.floor(Math.random() * 31);
  const percentage = Math.round((present / total) * 100);

  return {
    id: i + 1,
    name: `Student ${i + 1}`,
    department: ["BCA", "MCA", "BBA", "MBA", "B.Tech"][i % 5],
    specification: ["AI", "Web Dev", "Data Science", "Cyber Security"][i % 4],
    mobile: `98765${10000 + i}`,
    photo: "",

    attendance: {
      total,
      present,
      percentage,
    },
  };
});

export default function StudentsPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 📥 LOAD DATA
  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("students"));

    if (!data || data.length === 0) {
      data = defaultStudents;
      localStorage.setItem("students", JSON.stringify(data));
    }

    setStudents(data);
  }, []);

  // 🔍 FILTER
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterDept ? s.department === filterDept : true)
  );

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ❌ DELETE
  const deleteStudent = (id) => {
    if (window.confirm("Delete student?")) {
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      localStorage.setItem("students", JSON.stringify(updated));
    }
  };

  // 📄 PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["Name", "Department", "Course", "Mobile", "Attendance"]],
      body: students.map((s) => [
        s.name,
        s.department,
        s.specification,
        s.mobile,
        s.attendance
          ? `${s.attendance.present}/${s.attendance.total} (${s.attendance.percentage}%)`
          : "N/A",
      ]),
    });

    doc.save("students.pdf");
  };

  // 📊 EXCEL
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          🎓 Students Dashboard
        </h1>

        <button
          onClick={() => navigate("/add-student")}
          className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          + Add Student
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-500 text-white p-3 rounded">
          Total: {students.length}
        </div>
        <div className="bg-green-500 text-white p-3 rounded">
          BCA: {students.filter((s) => s.department === "BCA").length}
        </div>
        <div className="bg-purple-500 text-white p-3 rounded">
          MBA: {students.filter((s) => s.department === "MBA").length}
        </div>
        <div className="bg-orange-500 text-white p-3 rounded">
          B.Tech: {students.filter((s) => s.department === "B.Tech").length}
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-3">
        <input
          className="border p-2 rounded w-full md:w-60"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="">All Dept</option>
          <option>BCA</option>
          <option>MCA</option>
          <option>MBA</option>
          <option>B.Tech</option>
        </select>

        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          PDF
        </button>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-center min-w-[800px]">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Dept</th>
              <th>Course</th>
              <th>Mobile</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayedStudents.map((s, i) => (
              <tr key={s.id} className="border-b">
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.department}</td>
                <td>{s.specification}</td>
                <td>{s.mobile}</td>

                {/* 🔥 ATTENDANCE SHOW */}
                <td>
                  {s.attendance ? (
                    <span className="font-semibold text-green-600">
                      {s.attendance.present}/{s.attendance.total} (
                      {s.attendance.percentage}%)
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="flex gap-2 justify-center">
                  <button
                    onClick={() => navigate(`/student-view/${s.id}`)}
                    className="bg-blue-500 px-2 py-1 text-white rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/edit-student/${s.id}`)}
                    className="bg-yellow-500 px-2 py-1 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStudent(s.id)}
                    className="bg-red-500 px-2 py-1 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}