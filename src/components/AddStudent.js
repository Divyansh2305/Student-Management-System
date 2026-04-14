import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseData as defaultCourseData } from "./courseData";

export default function AddStudent() {
  const navigate = useNavigate();

  const departmentSpecs = {
    BCA: ["General", "Data Science", "AI", "Cyber Security"],
    MCA: ["Software Dev", "AI", "Cloud Computing"],
    "B.Tech": ["CSE", "Mechanical", "Civil", "Electrical"],
    "M.Tech": ["CSE", "VLSI", "Thermal"],
    "B.Sc": ["Physics", "Chemistry", "Mathematics", "Biology"],
    "M.Sc": ["Physics", "Chemistry", "Maths"],
    BBA: ["Marketing", "Finance", "HR"],
    MBA: ["Marketing", "Finance", "HR", "Operations"],
    BA: ["History", "Political Science", "English"],
    MA: ["History", "English"],
    "B.Com": ["General", "Computer Applications"],
    "M.Com": ["Accounting", "Finance"],
    LLB: ["Corporate Law", "Criminal Law"],
    LLM: ["International Law"],
    Diploma: ["Engineering", "Management"],
    PhD: ["Research"]
  };

  const [student, setStudent] = useState({
    name: "", dob: "", gender: "Male",
    mobile: "", email: "", whatsapp: "",
    aadhaar: "", bloodGroup: "", category: "",
    religion: "", nationality: "Indian",

    fatherName: "", fatherMobile: "", fatherOccupation: "",
    motherName: "", motherMobile: "", motherOccupation: "",
    annualIncome: "",

    address: "", city: "", state: "", pincode: "",

    department: "BCA", specification: "", semester: "1",
    admissionType: "Regular", courseDuration: "",
    courseFees: "", courseLink: "", admissionDate: "",

    attendance: "", emergencyContact: ""
  });

  const [education, setEducation] = useState([
    { type: "10th", percentage: "", file: "" }
  ]);

  const [photo, setPhoto] = useState("");
  const [specs, setSpecs] = useState([]);
  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("courseData")) || defaultCourseData;
    setCourseData(saved);
    setSpecs(departmentSpecs[student.department]);
  }, []);

  // INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setSpecs(departmentSpecs[value] || []);
      setStudent({
        ...student,
        department: value,
        specification: "",
        courseDuration: "",
        courseFees: ""
      });
    } else if (name === "specification") {
      const data = courseData[student.department]?.[value] || {};
      setStudent({
        ...student,
        specification: value,
        courseFees: data.fees || "",
        courseDuration: data.duration || ""
      });
    } else {
      setStudent({ ...student, [name]: value });
    }
  };

  // EDUCATION
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
    setEducation([...education, { type: "12th", percentage: "", file: "" }]);
  };

  const removeEducation = (i) => {
    if (i === 0) return;
    setEducation(education.filter((_, index) => index !== i));
  };

  // VALIDATION
  const validate = () => {
    if (!student.name) return alert("Name required");
    if (!student.mobile || student.mobile.length !== 10) return alert("Invalid mobile");
    if (!student.email.includes("@")) return alert("Invalid email");
    if (!student.aadhaar || student.aadhaar.length !== 12) return alert("Invalid Aadhaar");

    for (let edu of education) {
      if (!edu.percentage) return alert("Education % required");
      if (edu.type !== "Graduation" && !edu.file)
        return alert("Document required (except graduation)");
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newStudent = {
      ...student,
      id: "SMS" + Date.now(),
      photo,
      education
    };

    const existing = JSON.parse(localStorage.getItem("students")) || [];
    localStorage.setItem("students", JSON.stringify([newStudent, ...existing]));

    alert("Student Added Successfully ✅");
    navigate("/students");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Student Admission Form</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

        {/* BASIC */}
        <h2 className="col-span-2 font-bold">Basic Details</h2>
        <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-2" />
        <input type="date" name="dob" onChange={handleChange} className="border p-2" />
        <select name="gender" onChange={handleChange} className="border p-2">
          <option>Male</option><option>Female</option>
        </select>
        <input name="mobile" placeholder="Mobile" onChange={handleChange} className="border p-2" />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2" />
        <input name="whatsapp" placeholder="WhatsApp" onChange={handleChange} className="border p-2" />
        <input name="aadhaar" placeholder="Aadhaar" onChange={handleChange} className="border p-2" />
        <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} className="border p-2" />
        <input name="category" placeholder="Category" onChange={handleChange} className="border p-2" />
        <input name="religion" placeholder="Religion" onChange={handleChange} className="border p-2" />
        <input value="Indian" readOnly className="border p-2" />

        {/* PARENT */}
        <h2 className="col-span-2 font-bold">Parent Details</h2>
        <input name="fatherName" placeholder="Father Name" onChange={handleChange} className="border p-2" />
        <input name="fatherMobile" placeholder="Father Mobile" onChange={handleChange} className="border p-2" />
        <input name="fatherOccupation" placeholder="Father Occupation" onChange={handleChange} className="border p-2" />
        <input name="motherName" placeholder="Mother Name" onChange={handleChange} className="border p-2" />
        <input name="motherMobile" placeholder="Mother Mobile" onChange={handleChange} className="border p-2" />
        <input name="motherOccupation" placeholder="Mother Occupation" onChange={handleChange} className="border p-2" />

        {/* ADDRESS */}
        <h2 className="col-span-2 font-bold">Address</h2>
        <input name="address" placeholder="Full Address" onChange={handleChange} className="border p-2 col-span-2" />
        <input name="city" placeholder="City" onChange={handleChange} className="border p-2" />
        <input name="state" placeholder="State" onChange={handleChange} className="border p-2" />
        <input name="pincode" placeholder="Pincode" onChange={handleChange} className="border p-2" />

        {/* COURSE */}
        <h2 className="col-span-2 font-bold">Course Details</h2>
        <select name="department" onChange={handleChange} className="border p-2">
          {Object.keys(departmentSpecs).map((d, i) => <option key={i}>{d}</option>)}
        </select>

        <select name="specification" onChange={handleChange} className="border p-2">
          <option>Select Specification</option>
          {specs.map((s, i) => <option key={i}>{s}</option>)}
        </select>

        <input value={student.courseFees} readOnly className="border p-2" />
        <input value={student.courseDuration} readOnly className="border p-2" />

        {/* EDUCATION */}
        <h2 className="col-span-2 font-bold">Education</h2>

        {education.map((edu, i) => (
          <div key={i} className="col-span-2 border p-3">
            <select value={edu.type} onChange={(e) => handleEduChange(i, "type", e.target.value)} className="border p-2 w-full">
              <option>10th</option>
              <option>12th</option>
              <option>Graduation</option>
            </select>

            <input placeholder="Percentage" value={edu.percentage}
              onChange={(e) => handleEduChange(i, "percentage", e.target.value)}
              className="border p-2 w-full" />

            <input type="file" onChange={(e) => handleFile(i, e.target.files[0])} className="border p-2 w-full" />

            {i !== 0 && (
              <button type="button" onClick={() => removeEducation(i)} className="text-red-500">
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addEducation} className="bg-blue-500 text-white col-span-2 p-2">
          + Add More Education
        </button>

        {/* PHOTO */}
        <h2 className="col-span-2 font-bold">Upload Photo</h2>
        <input type="file" onChange={(e) => {
          const reader = new FileReader();
          reader.onloadend = () => setPhoto(reader.result);
          if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
        }} className="col-span-2" />

        <button className="bg-green-500 text-white col-span-2 p-2">
          Add Student
        </button>

      </form>
    </div>
  );
}