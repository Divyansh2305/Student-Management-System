import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const departmentSpecs = {
    BCA: ["General", "Data Science", "AI", "Cyber Security"],
    MCA: ["Software Dev", "AI", "Cloud Computing"],
    "B.Tech": ["CSE", "Mechanical", "Civil", "Electrical"],
    "M.Tech": ["CSE", "VLSI", "Thermal"],
    "B.Sc": ["Physics", "Chemistry", "Mathematics", "Biology"],
    "M.Sc": ["Physics", "Chemistry", "Maths"],
    "BBA": ["Marketing", "Finance", "HR"],
    "MBA": ["Marketing", "Finance", "HR", "Operations"],
    "BA": ["History", "Political Science", "English"],
    "MA": ["History", "English"],
    "B.Com": ["General", "Computer Applications"],
    "M.Com": ["Accounting", "Finance"],
    "LLB": ["Corporate Law", "Criminal Law"],
    "LLM": ["International Law"],
    "Diploma": ["Engineering", "Management"],
    "PhD": ["Research"],
  };

  const [student, setStudent] = useState({});
  const [photo, setPhoto] = useState("");
  const [specs, setSpecs] = useState([]);
  const [education, setEducation] = useState([]);

  // 🔥 LOAD DATA
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const found = students.find((s) => String(s.id) === String(id));

    if (found) {
      setStudent(found);
      setPhoto(found.photo || "");
      setSpecs(departmentSpecs[found.department] || []);
      setEducation(found.education || []);
    }
  }, [id]);

  // 🔄 INPUT HANDLE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "department") {
      setSpecs(departmentSpecs[value] || []);
      setStudent((prev) => ({
        ...prev,
        department: value,
        specification: "",
      }));
    } else if (name === "photo") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhoto(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setStudent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 🎓 EDUCATION HANDLERS
  const handleEduChange = (i, field, value) => {
    const updated = [...education];
    updated[i][field] = value;
    setEducation(updated);
  };

  const handleFile = (i, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...education];
      updated[i].file = reader.result;
      setEducation(updated);
    };
    if (file) reader.readAsDataURL(file);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { type: "12th", percentage: "", file: "" },
    ]);
  };

  const removeEducation = (i) => {
    if (i === 0) return;
    setEducation(education.filter((_, index) => index !== i));
  };

  // ✅ VALIDATION
  const validate = () => {
    if (!student.name) return "Name required";
    if (student.mobile && student.mobile.length !== 10)
      return "Mobile must be 10 digits";
    if (student.aadhaar && student.aadhaar.length !== 12)
      return "Aadhaar must be 12 digits";

    for (let edu of education) {
      if (!edu.percentage) return "Education % required";
    }

    return null;
  };

  // 💾 UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return alert(error);

    const students = JSON.parse(localStorage.getItem("students")) || [];

    const updatedStudents = students.map((s) =>
      String(s.id) === String(id)
        ? { ...s, ...student, photo, education }
        : s
    );

    localStorage.setItem("students", JSON.stringify(updatedStudents));

    alert("Student Updated Successfully ✅");
    navigate("/students");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Student</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

        {/* BASIC */}
        <h2 className="col-span-2 font-bold">Basic Details</h2>

        <input name="name" value={student.name || ""} onChange={handleChange} className="border p-2" />
        <input type="date" name="dob" value={student.dob || ""} onChange={handleChange} className="border p-2" />

        <select name="gender" value={student.gender || ""} onChange={handleChange} className="border p-2">
          <option>Male</option>
          <option>Female</option>
        </select>

        <input name="mobile" value={student.mobile || ""} onChange={handleChange} className="border p-2" />
        <input name="email" value={student.email || ""} onChange={handleChange} className="border p-2" />
        <input name="whatsapp" value={student.whatsapp || ""} onChange={handleChange} className="border p-2" />

        <input name="aadhaar" value={student.aadhaar || ""} onChange={handleChange} className="border p-2" />
        <input name="bloodGroup" value={student.bloodGroup || ""} onChange={handleChange} className="border p-2" />

        <input name="category" value={student.category || ""} onChange={handleChange} className="border p-2" />
        <input name="religion" value={student.religion || ""} onChange={handleChange} className="border p-2" />

        <input value="Indian" readOnly className="border p-2" />

        {/* PARENT */}
        <h2 className="col-span-2 font-bold">Parent Details</h2>

        <input name="fatherName" value={student.fatherName || ""} onChange={handleChange} className="border p-2" />
        <input name="fatherMobile" value={student.fatherMobile || ""} onChange={handleChange} className="border p-2" />
        <input name="fatherOccupation" value={student.fatherOccupation || ""} onChange={handleChange} className="border p-2" />

        <input name="motherName" value={student.motherName || ""} onChange={handleChange} className="border p-2" />
        <input name="motherMobile" value={student.motherMobile || ""} onChange={handleChange} className="border p-2" />
        <input name="motherOccupation" value={student.motherOccupation || ""} onChange={handleChange} className="border p-2" />

        {/* ADDRESS */}
        <h2 className="col-span-2 font-bold">Address</h2>

        <input name="address" value={student.address || ""} onChange={handleChange} className="border p-2 col-span-2" />
        <input name="city" value={student.city || ""} onChange={handleChange} className="border p-2" />
        <input name="state" value={student.state || ""} onChange={handleChange} className="border p-2" />
        <input name="pincode" value={student.pincode || ""} onChange={handleChange} className="border p-2" />

        {/* COURSE */}
        <h2 className="col-span-2 font-bold">Course</h2>

        <select name="department" value={student.department || ""} onChange={handleChange} className="border p-2">
          {Object.keys(departmentSpecs).map((d, i) => (
            <option key={i}>{d}</option>
          ))}
        </select>

        <select name="specification" value={student.specification || ""} onChange={handleChange} className="border p-2">
          <option value="">Select</option>
          {specs.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        {/* EDUCATION */}
        <h2 className="col-span-2 font-bold">Education</h2>

        {education.map((edu, i) => (
          <div key={i} className="col-span-2 border p-3">

            <select
              value={edu.type}
              onChange={(e) => handleEduChange(i, "type", e.target.value)}
              className="border p-2 w-full"
            >
              <option>10th</option>
              <option>12th</option>
              <option>Graduation</option>
            </select>

            <input
              placeholder="Percentage"
              value={edu.percentage}
              onChange={(e) => handleEduChange(i, "percentage", e.target.value)}
              className="border p-2 w-full"
            />

            <input
              type="file"
              onChange={(e) => handleFile(i, e.target.files[0])}
              className="border p-2 w-full"
            />

            {edu.file && (
              <img src={edu.file} alt="" className="w-20 mt-2" />
            )}

            {i !== 0 && (
              <button
                type="button"
                onClick={() => removeEducation(i)}
                className="text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addEducation}
          className="bg-blue-500 text-white col-span-2 p-2"
        >
          + Add More Education
        </button>

        {/* PHOTO */}
        <h2 className="col-span-2 font-bold">Photo</h2>

        {photo && <img src={photo} alt="preview" className="w-20 h-20" />}
        <input type="file" name="photo" onChange={handleChange} className="col-span-2" />

        <button className="bg-blue-600 text-white col-span-2 p-2">
          Update Student
        </button>
      </form>
    </div>
  );
}