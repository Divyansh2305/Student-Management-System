import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields");
      return;
    }

    // Save in localStorage (admin can view later)
    const oldMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];

    const newMessage = {
      id: Date.now(),
      ...form,
      time: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "contactMessages",
      JSON.stringify([newMessage, ...oldMessages])
    );

    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 text-white p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            📩 Contact Administration
          </h1>
          <p className="text-sm sm:text-base opacity-90">
            For Faculty Members & Students Support
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3">

            {sent && (
              <div className="bg-green-100 text-green-700 p-2 rounded">
                Message sent successfully ✅
              </div>
            )}

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border p-2 rounded"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject (optional)"
              className="w-full border p-2 rounded"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message..."
              rows="5"
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send Message
            </button>

          </form>

          {/* Info Panel */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t md:border-t-0 md:border-l">

            <h2 className="font-bold text-lg mb-2">📌 Admin Office</h2>

            <p className="text-gray-600 mb-3">
              Response time: 24-48 hours
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <p>📍 College Administration Block</p>
              <p>📞 +91 9876543210</p>
              <p>📧 admin@college.edu</p>
            </div>

            <div className="mt-4 p-3 bg-yellow-100 rounded text-sm">
              ⚠️ Use this form only for academic or system-related queries.
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}