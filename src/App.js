import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Home from "./components/HomePage";
import StudentsPage from "./components/StudentsPage";
import AddStudent from "./components/AddStudent";
import StudentView from "./components/StudentView";
import EditStudent from "./components/EditStudent";
import CoursePage from "./components/CoursePage";
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";
import Messages from "./components/Messages";
import Assignments from "./components/Assignments";
import Settings from "./components/Settings";
import Announcements from "./components/Announcements";
import Notices from "./components/Notices";
import Contact from "./components/Contact";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/student-view/:id" element={<StudentView />} />
          <Route path="/edit-student/:id" element={<EditStudent />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
}