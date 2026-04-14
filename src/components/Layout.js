import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./NavbarPage";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Area */}
      <div className="flex flex-col flex-1 md:ml-64 min-h-screen">

        {/* Navbar */}
        <Navbar setIsOpen={setIsOpen} />

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </div>

      {/* Mobile overlay (optional but recommended) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}