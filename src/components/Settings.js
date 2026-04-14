import React, { useState, useEffect } from "react";

export default function Settings() {
  const [adminName, setAdminName] = useState("Admin");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings")) || {};
    setAdminName(saved.adminName || "Admin");
    setDarkMode(saved.darkMode || false);
    setNotifications(saved.notifications ?? true);
    setFontSize(saved.fontSize || "medium");
    setLanguage(saved.language || "English");
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        adminName,
        darkMode,
        notifications,
        fontSize,
        language,
      })
    );
  }, [adminName, darkMode, notifications, fontSize, language]);

  const clearAllData = () => {
    if (window.confirm("⚠️ Delete ALL data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const resetSettings = () => {
    localStorage.removeItem("settings");
    window.location.reload();
  };

  const backupData = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "backup.json";
    link.click();
  };

  const restoreData = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const data = JSON.parse(reader.result);
      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, data[key]);
      });
      alert("Restored!");
      window.location.reload();
    };

    if (file) reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">

      <h1 className="text-xl sm:text-3xl font-bold text-center sm:text-left">
        ⚙️ Settings
      </h1>

      {/* Profile */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-base sm:text-lg">👤 Admin Profile</h2>

        <input
          type="text"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          className="border p-2 w-full rounded text-sm sm:text-base"
          placeholder="Admin Name"
        />
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
        <h2 className="font-semibold text-base sm:text-lg">🎨 Appearance</h2>

        <div className="flex justify-between items-center text-sm sm:text-base">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm sm:text-base">Font Size</p>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="border p-2 w-full rounded text-sm sm:text-base"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
        <h2 className="font-semibold text-base sm:text-lg">⚙️ Preferences</h2>

        <div className="flex justify-between items-center text-sm sm:text-base">
          <span>Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm sm:text-base">Language</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 w-full rounded text-sm sm:text-base"
          >
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      {/* Backup */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
        <h2 className="font-semibold text-base sm:text-lg">💾 Backup & Restore</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={backupData}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Backup Data
          </button>

          <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer text-center w-full sm:w-auto">
            Restore Data
            <input type="file" hidden onChange={restoreData} />
          </label>
        </div>
      </div>

      {/* Danger */}
      <div className="bg-red-100 p-4 rounded shadow space-y-4">
        <h2 className="font-semibold text-base sm:text-lg text-red-600">
          ⚠️ Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={clearAllData}
            className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Clear All Data
          </button>

          <button
            onClick={resetSettings}
            className="bg-gray-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Reset Settings
          </button>
        </div>
      </div>

    </div>
  );
}