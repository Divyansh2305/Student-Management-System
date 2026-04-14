import React, { useState, useEffect } from "react";
import { courseData as defaultCourseData } from "./courseData";

export default function CoursePage() {
  const [courseData, setCourseData] = useState({});
  const [form, setForm] = useState({
    department: "",
    name: "",
    fees: "",
    duration: "",
    link: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("courseData")) || defaultCourseData;
    const studentSelections = JSON.parse(localStorage.getItem("studentCourses")) || [];

    const mergedData = { ...savedData };

    studentSelections.forEach(({ department, course, specialization }) => {
      if (!mergedData[department]) mergedData[department] = {};
      if (!mergedData[department][course]) {
        mergedData[department][course] = {
          fees: 0,
          duration: specialization || "",
          link: ""
        };
      }
    });

    setCourseData(mergedData);
  }, []);

  const saveData = (newData) => {
    setCourseData(newData);
    localStorage.setItem("courseData", JSON.stringify(newData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.department || !form.name) {
      alert("Department and Course Name required");
      return;
    }

    const updatedData = { ...courseData };
    if (!updatedData[form.department]) updatedData[form.department] = {};

    updatedData[form.department][form.name] = {
      fees: Number(form.fees) || 0,
      duration: form.duration,
      link: form.link
    };

    saveData(updatedData);
    setForm({ department: "", name: "", fees: "", duration: "", link: "" });
    setIsEditing(false);
  };

  const handleEdit = (dept, courseName) => {
    const course = courseData[dept][courseName];
    setForm({
      department: dept,
      name: courseName,
      fees: course.fees,
      duration: course.duration,
      link: course.link
    });
    setIsEditing(true);
  };

  const handleDelete = (dept, courseName) => {
    if (!window.confirm(`Delete course ${courseName} from ${dept}?`)) return;
    const updatedData = { ...courseData };
    delete updatedData[dept][courseName];
    if (Object.keys(updatedData[dept]).length === 0) delete updatedData[dept];
    saveData(updatedData);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-white rounded shadow space-y-6">
      
      <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
        Course Management
      </h1>

      {/* 🔹 Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-50 p-4 rounded shadow"
      >
        <h2 className="col-span-1 sm:col-span-2 lg:col-span-3 font-bold text-lg">
          {isEditing ? "Edit Course" : "Add New Course"}
        </h2>

        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Select Department</option>
          {Object.keys(courseData).map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <input
          name="name"
          placeholder="Course Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="fees"
          placeholder="Fees"
          type="number"
          value={form.fees}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="duration"
          placeholder="Duration / Specialization"
          value={form.duration}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="link"
          placeholder="Info Link"
          value={form.link}
          onChange={handleChange}
          className="border p-2 w-full sm:col-span-2 lg:col-span-3"
        />

        <button className={`col-span-1 sm:col-span-2 lg:col-span-3 py-2 rounded text-white w-full ${
          isEditing ? "bg-yellow-500" : "bg-green-500"
        }`}>
          {isEditing ? "Update Course" : "Add Course"}
        </button>
      </form>

      {/* 🔹 Course List */}
      <div className="space-y-4">
        {Object.keys(courseData).map((dept) => (
          <div key={dept} className="bg-gray-100 p-3 sm:p-4 rounded shadow">
            
            <h2 className="font-bold text-lg sm:text-xl text-blue-600">
              {dept}
            </h2>

            <div className="overflow-x-auto mt-2">
              <table className="min-w-[600px] w-full border-collapse border border-gray-300 text-sm sm:text-base">
                
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Course</th>
                    <th className="border px-2 py-1">Fees</th>
                    <th className="border px-2 py-1">Duration</th>
                    <th className="border px-2 py-1">Link</th>
                    <th className="border px-2 py-1">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(courseData[dept]).map((courseName) => {
                    const c = courseData[dept][courseName];
                    return (
                      <tr key={courseName} className="hover:bg-gray-50">
                        
                        <td className="border px-2 py-1">{courseName}</td>
                        <td className="border px-2 py-1">{c.fees}</td>
                        <td className="border px-2 py-1">{c.duration || "N/A"}</td>

                        <td className="border px-2 py-1">
                          {c.link ? (
                            <a href={c.link} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                              View
                            </a>
                          ) : "N/A"}
                        </td>

                        <td className="border px-2 py-1 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleEdit(dept, courseName)}
                            className="bg-yellow-400 px-2 py-1 rounded text-white w-full sm:w-auto"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(dept, courseName)}
                            className="bg-red-500 px-2 py-1 rounded text-white w-full sm:w-auto"
                          >
                            Delete
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}