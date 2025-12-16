// app/admin/bulk-email/page.tsx
"use client";

import { useState } from "react";

export default function BulkEmailPage() {
  const [role, setRole] = useState("provider");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmails = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch("/api/admin/send-bulk-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetRole: role, subject, message }),
    });

    if (res.ok) alert("Emails sent successfully!");
    else alert("Failed to send emails");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">
        Send Bulk Email
      </h1>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Select Role</label>
        <select
          className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="provider">Providers</option>
          <option value="customer">Customers</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Subject</label>
        <input
          type="text"
          className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Message</label>
        <textarea
          className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          rows={6}
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        onClick={sendEmails}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
      >
        Send
      </button>
    </div>
  );
}
