import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function StudentView() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("students")) || [];
    setStudent(data.find((s) => s.id === id));
  }, [id]);

  if (!student) return <p className="p-6">Loading...</p>;

  const logo = "/logo.png";
  const getBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = reject;
    });
  // generateIDCard
  const generateIDCard = (s) => {
    const cardW = 85.6;
    const cardH = 54;

    const doc = new jsPDF("p", "mm", "a4");

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const gap = 20;
    const totalHeight = cardH * 2 + gap;

    const x = (pageW - cardW) / 2;
    const yStart = (pageH - totalHeight) / 2;

    const yFront = yStart;
    const yBack = yStart + cardH + gap;

    // ✅ LOGO PATH
    const logo = "/logo.png";

    // ✅ COLLEGE INFO
    const collegeWebsite = "www.abccollege.com";
    const collegeAddress = "ABC College, Indore, Madhya Pradesh, India";

    // ✅ CUT MARKS
    const cut = (x, y) => {
      const m = 4;
      doc.line(x - m, y, x, y);
      doc.line(x, y - m, x, y);
      doc.line(x + cardW, y - m, x + cardW, y);
      doc.line(x + cardW, y, x + cardW + m, y);
      doc.line(x - m, y + cardH, x, y + cardH);
      doc.line(x, y + cardH, x, y + cardH + m);
      doc.line(x + cardW, y + cardH, x + cardW + m, y + cardH);
      doc.line(x + cardW, y + cardH, x + cardW, y + cardH + m);
    };

    // ========= FRONT =========
    const front = () => {
      doc.setFillColor(20, 40, 120);
      doc.rect(x - 2, yFront - 2, cardW + 4, cardH + 4, "F");

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, yFront, cardW, cardH, 3, 3, "F");

      doc.setFillColor(30, 64, 175);
      doc.roundedRect(x, yFront, cardW, 10, 3, 3, "F");

      doc.addImage(logo, "PNG", x + 2, yFront + 1.5, 7, 7);

      doc.setTextColor(255);
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("ABC COLLEGE", x + cardW / 2, yFront + 5, { align: "center" });

      doc.setFontSize(6);
      doc.text("STUDENT ID CARD", x + cardW / 2, yFront + 8, { align: "center" });

      doc.roundedRect(x + 4, yFront + 13, 20, 25, 2, 2);

      if (s.photo) {
        doc.addImage(s.photo, "JPEG", x + 5, yFront + 14, 18, 23);
      }

      let yy = yFront + 16;

      const label = (l, v) => {
        doc.setFontSize(5.8);
        doc.setFont(undefined, "bold");
        doc.setTextColor(60);
        doc.text(l + ":", x + 27, yy);

        doc.setFont(undefined, "normal");
        doc.setTextColor(0);
        doc.text(v || "-", x + 45, yy);

        yy += 4;
      };

      label("ID", s.id);
      label("Name", s.name);
      label("Dept", s.department);
      label("Course", s.specification);
      label("DOB", s.dob);
      label("Gender", s.gender);

      doc.setTextColor(220, 38, 38);
      doc.text("Blood: " + (s.bloodGroup || "-"), x + 27, yy);

      doc.setFillColor(30, 64, 175);
      doc.rect(x, yFront + cardH - 7, cardW, 7, "F");

      doc.setTextColor(255);
      doc.setFontSize(4.5);
      doc.text("Valid Till 2028", x + 4, yFront + cardH - 2);

      cut(x, yFront);
    };

    // ========= BACK =========
    const back = () => {
      doc.setFillColor(20, 40, 120);
      doc.rect(x - 2, yBack - 2, cardW + 4, cardH + 4, "F");

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, yBack, cardW, cardH, 3, 3, "F");

      // HEADER
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(x, yBack, cardW, 10, 3, 3, "F");

      doc.addImage("/logo.png", "PNG", x + cardW - 10, yBack + 1.5, 7, 7);

      doc.setTextColor(255);
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("STUDENT DETAILS", x + cardW / 2, yBack + 6, { align: "center" });

      let yy = yBack + 13;

      const info = (l, v) => {
        doc.setFontSize(5.2);

        doc.setFont(undefined, "bold");
        doc.setTextColor(60);
        doc.text(l + ":", x + 4, yy);

        doc.setFont(undefined, "normal");
        doc.setTextColor(0);

        const text = doc.splitTextToSize(v || "-", 45);
        doc.text(text, x + 25, yy);

        yy += text.length * 3.5;
      };

      info("Mobile", s.mobile);
      info("Email", s.email);
      info("Aadhaar", s.aadhaar);
      info("Father", s.fatherName);
      info("F Mob", s.fatherMobile);
      info("Mother", s.motherName);
      info("M Mob", s.motherMobile);

      // ADDRESS
      doc.setFont(undefined, "bold");
      doc.text("Address:", x + 4, yy);

      doc.setFont(undefined, "normal");
      const addr = doc.splitTextToSize(s.address || "-", 45);
      doc.text(addr, x + 25, yy);

      yy += addr.length * 3 + 3;

      // DIVIDER
      doc.setDrawColor(180);
      doc.line(x + 4, yy, x + cardW - 4, yy);

      yy += 4;

      // WEBSITE
      doc.setFontSize(4.5);
      doc.setFont(undefined, "bold");
      doc.text("Website:", x + 4, yy);

      doc.setFont(undefined, "normal");
      doc.setTextColor(0, 0, 200);
      doc.text("www.abccollege.com", x + 25, yy);

      yy += 4;

      // COLLEGE ADDRESS
      doc.setTextColor(0);
      doc.setFont(undefined, "bold");
      doc.text("College:", x + 4, yy);

      doc.setFont(undefined, "normal");
      const clgAddr = doc.splitTextToSize(
        "ABC College, Indore, MP, India",
        45
      );
      doc.text(clgAddr, x + 25, yy);

      yy += clgAddr.length * 3 + 3;


      // SIGNATURE (RIGHT SIDE FIXED)
      doc.line(x + cardW - 30, yBack + cardH - 5, x + cardW - 5, yBack + cardH - 5);
      doc.setFontSize(3.5);
      doc.text("Signature", x + cardW - 22, yBack + cardH - 2);

      cut(x, yBack);
    };

    front();
    back();

    doc.save(`${s.name}_IDCard.pdf`);
  };



  // 📄 ADMISSION PDF
  const generateAdmissionSlip = (s) => {
    const doc = new jsPDF();

    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text("ABC COLLEGE OF TECHNOLOGY", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text("Admission Slip", 105, 22, { align: "center" });

    doc.setTextColor(0);

    if (s.photo) {
      try {
        doc.addImage(s.photo, "JPEG", 85, 35, 40, 45);
      } catch { }
    }

    let y = 85;

    const row = (l1, v1, l2, v2) => {
      doc.rect(10, y, 90, 10);
      doc.rect(100, y, 90, 10);

      doc.text(l1, 12, y + 6);
      doc.text(v1 || "N/A", 40, y + 6);

      doc.text(l2, 102, y + 6);
      doc.text(v2 || "N/A", 140, y + 6);

      y += 10;
    };

    row("Name", s.name, "DOB", s.dob);
    row("Gender", s.gender, "Mobile", s.mobile);
    row("Email", s.email, "Aadhaar", s.aadhaar);

    row("Father", s.fatherName, "Father Mob", s.fatherMobile);
    row("Mother", s.motherName, "Mother Mob", s.motherMobile);

    row("Department", s.department, "Course", s.specification);
    row("Student ID", s.id, "Blood", s.bloodGroup);

    doc.rect(10, y, 180, 12);
    doc.text("Address:", 12, y + 6);
    doc.text(s.address || "N/A", 40, y + 6);
    y += 15;

    doc.text("Education Details", 10, y);
    y += 6;

    (s.education || []).forEach((e) => {
      doc.rect(10, y, 180, 10);
      doc.text(`${e.type} - ${e.percentage}%`, 12, y + 6);
      y += 10;
    });

    doc.save(`${s.name}_Admission.pdf`);
  };

  // 🖨️ PRINT
  const printSlip = (s) => {
    const win = window.open("", "_blank");

    const photoHTML = s.photo
      ? `<img src="${s.photo}" style="width:100px;height:120px;object-fit:cover;border:1px solid #000;padding:3px;" />`
      : "";

    const eduRows = (s.education || [])
      .map(
        (e) =>
          `<tr><td>${e.type}</td><td>${e.percentage}%</td></tr>`
      )
      .join("");

    win.document.write(`
    <html>
      <head>
        <title>Student Print</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }

          h2 {
            text-align: center;
            margin-bottom: 10px;
          }

          .section {
            margin-bottom: 25px;
            border: 1px solid #000;
            padding: 10px;
          }

          .header {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }

          .photo {
            text-align: center;
            margin-bottom: 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td, th {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
          }
        </style>
      </head>

      <body>

        <!-- ================= STUDENT DETAILS ================= -->
        <div class="section">
          <div class="header">Student Details</div>

          <div class="photo">${photoHTML}</div>

          <div class="row"><span>Name:</span><span>${s.name}</span></div>
          <div class="row"><span>ID:</span><span>${s.id}</span></div>
          <div class="row"><span>DOB:</span><span>${s.dob}</span></div>
          <div class="row"><span>Gender:</span><span>${s.gender}</span></div>
          <div class="row"><span>Mobile:</span><span>${s.mobile}</span></div>
          <div class="row"><span>Email:</span><span>${s.email}</span></div>
          <div class="row"><span>Aadhaar:</span><span>${s.aadhaar}</span></div>
          <div class="row"><span>Address:</span><span>${s.address}</span></div>
        

        <!-- ================= ADMISSION SLIP ================= -->
        
          <div class="header">Admission Slip</div>

          

          <div class="row"><span>Department:</span><span>${s.department}</span></div>
          <div class="row"><span>Course:</span><span>${s.specification}</span></div>
          <div class="row"><span>Father:</span><span>${s.fatherName}</span></div>
          <div class="row"><span>Father Mob:</span><span>${s.fatherMobile}</span></div>
          <div class="row"><span>Mother:</span><span>${s.motherName}</span></div>
          <div class="row"><span>Mother Mob:</span><span>${s.motherMobile}</span></div>
          <div class="row"><span>Blood:</span><span>${s.bloodGroup}</span></div>
        

        <!-- ================= EDUCATION ================= -->
        
          <div class="header">Education</div>

          <table>
            <tr>
              <th>Type</th>
              <th>Percentage</th>
            </tr>
            ${eduRows}
          </table>
        </div>

        <script>
          window.print();
        </script>

      </body>
    </html>
  `);

    win.document.close();
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* PROFILE */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
        {student.photo && (
          <img
            src={student.photo}
            className="w-20 h-20 rounded-full border object-cover"
          />
        )}

        <div>
          <h1 className="text-xl font-bold">{student.name}</h1>
          <p className="text-gray-600">
            {student.department} - {student.specification}
          </p>
          <p className="text-sm text-gray-500">ID: {student.id}</p>
        </div>
      </div>

      {/* ALL DETAILS */}
      <div className="grid md:grid-cols-3 gap-4 mt-5">

        {/* BASIC */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-blue-600 mb-2">Basic</h2>
          <p>Name: {student.name}</p>
          <p>DOB: {student.dob}</p>
          <p>Gender: {student.gender}</p>
          <p>Mobile: {student.mobile}</p>
          <p>Email: {student.email}</p>
          <p>Aadhaar: {student.aadhaar}</p>
        </div>

        {/* PARENT */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-green-600 mb-2">Personal Details</h2>
          <p>Father: {student.fatherName}</p>
          <p>Father Mob: {student.fatherMobile}</p>
          <p>Mother: {student.motherName}</p>
          <p>Mother Mob: {student.motherMobile}</p>
          <p>Father Occupation: {student.fatherOccupation}</p>
          <p>Mother Occupation: {student.motherOccupation}</p>
        </div>

        {/* ACADEMIC */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-purple-600 mb-2">Academic Details</h2>
          <p>Department: {student.department}</p>
          <p>Course: {student.specification}</p>
          <p>Address: {student.address}</p>
          <p>Blood: {student.bloodGroup}</p>
        </div>
      </div>

      {/* EDUCATION TABLE */}
      <div className="bg-white p-4 rounded-xl shadow mt-5">
        <h2 className="font-bold mb-3">Education</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Type</th>
              <th className="border p-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {(student.education || []).map((e, i) => (
              <tr key={i}>
                <td className="border p-2">{e.type}</td>
                <td className="border p-2">{e.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3 mt-5">
        <button onClick={() => generateIDCard(student)} className="bg-blue-600 text-white px-4 py-2 rounded">
          ID Card
        </button>

        <button onClick={() => generateAdmissionSlip(student)} className="bg-green-600 text-white px-4 py-2 rounded">
          Admission PDF
        </button>

        <button onClick={() => printSlip(student)} className="bg-gray-700 text-white px-4 py-2 rounded">
          Print
        </button>
      </div>
    </div>
  );
}