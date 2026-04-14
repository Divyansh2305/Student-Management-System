import React, { useState, useEffect } from "react";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Pending");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("assignments")) || [];
    setAssignments(data);
  }, []);

  const saveData = (data) => {
    localStorage.setItem("assignments", JSON.stringify(data));
    setAssignments(data);
  };

  const handleSubmit = () => {
    if (!title) return alert("Title required");

    if (editId) {
      const updated = assignments.map((a) =>
        a.id === editId
          ? { ...a, title, subject, date, status }
          : a
      );

      saveData(updated);
      setEditId(null);
    } else {
      const newAssignment = {
        id: Date.now(),
        title,
        subject,
        date,
        status
      };

      saveData([newAssignment, ...assignments]);
    }

    setTitle("");
    setSubject("");
    setDate("");
    setStatus("Pending");
  };

  const handleDelete = (id) => {
    const filtered = assignments.filter((a) => a.id !== id);
    saveData(filtered);
  };

  const handleEdit = (a) => {
    setTitle(a.title);
    setSubject(a.subject);
    setDate(a.date);
    setStatus(a.status);
    setEditId(a.id);
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

      <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
        Assignments Manager
      </h1>

      {/* 🔹 FORM */}
      <div className="bg-white p-4 rounded shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full"
        >
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <button
          onClick={handleSubmit}
          className={`text-white rounded py-2 w-full ${editId ? "bg-yellow-500" : "bg-green-500"
            }`}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* 🔹 TABLE */}
      <div className="overflow-x-auto border rounded shadow">
        <table className="min-w-[700px] w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {assignments.length ? (
              assignments.map((a) => (
                <tr
                  key={a.id}
                  className={isOverdue(a.date) ? "bg-red-50" : ""}
                >
                  <td className="border p-2">{a.title}</td>

                  <td className="border p-2">{a.subject}</td>

                  <td className="border p-2">
                    {a.date}
                    {isOverdue(a.date) && (
                      <span className="text-red-500 ml-2 text-xs sm:text-sm">
                        (Overdue)
                      </span>
                    )}
                  </td>

                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs sm:text-sm ${a.status === "Completed"
                          ? "bg-green-500"
                          : "bg-orange-500"
                        }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="border p-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="bg-blue-500 text-white px-2 py-1 rounded w-full sm:w-auto"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(a.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No assignments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}