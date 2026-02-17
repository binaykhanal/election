"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Trash2,
  User,
  Calendar,
  MessageSquare,
  Loader2,
  Search,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      showToast("Error", "Could not load messages.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries(inquiries.filter((item) => item.id !== id));
        showToast("Deleted", "Inquiry removed successfully.", "success");
      }
    } catch (error) {
      showToast("Error", "Failed to delete.", "error");
    }
  };

  const handleToggleRead = async (id) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // No body needed if the backend toggles automatically,
        // or send { isRead: true } if you want specific control.
      });

      if (res.ok) {
        const data = await res.json();
        // Use data.isRead from the backend response
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id ? { ...inq, isRead: data.isRead } : inq,
          ),
        );

        showToast(
          "Success",
          data.isRead ? "Marked as read" : "Marked as unread",
          "success",
        );
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      showToast("Error", "Failed to update status", "error");
    }
  };

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-red-600" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry) => (
              <InquiryCard
                key={inquiry.id}
                inquiry={inquiry}
                onDelete={handleDelete}
                onToggleRead={handleToggleRead}
              />
            ))
          ) : (
            <div className="bg-white p-10 text-center rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No messages found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InquiryCard({ inquiry, onDelete, onToggleRead }) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-6 transition-all ${
        inquiry.isRead
          ? "opacity-60 bg-gray-50/50"
          : "border-l-4 border-l-red-600 shadow-md"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {!inquiry.isRead && (
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                New
              </span>
            )}
            <span className="flex items-center gap-1.5 font-bold text-gray-900">
              <User className="w-4 h-4 text-red-600" /> {inquiry.name}
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <Mail className="w-4 h-4 text-gray-400" /> {inquiry.email}
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-4 h-4" />
              {new Date(inquiry.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 text-lg mb-1">
              {inquiry.subject}
            </h4>
            <div className="bg-white/50 p-4 rounded-lg border border-gray-100 flex gap-3">
              <p className="text-gray-600 whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 self-end md:self-start">
          <button
            onClick={() => onToggleRead(inquiry.id)}
            className={`p-2 rounded-lg border transition-colors ${
              inquiry.isRead
                ? "text-gray-400 border-gray-200 hover:bg-gray-100"
                : "text-red-600 border-red-100 bg-red-50 hover:bg-red-100"
            }`}
            title={inquiry.isRead ? "Mark as Unread" : "Mark as Read"}
          >
            <CheckCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(inquiry.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
