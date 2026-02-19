"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Eye,
  Loader2,
  PlusCircle,
  Settings,
  CheckCircle,
  Image as ImageIcon,
  Mail,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function DashboardHome() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalViews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setStats({
          totalBlogs: data.total || 0,
          publishedBlogs: data.published || 0,
          totalViews: data.views || 0,
        });
      } catch (error) {
        showToast("Error", "Could not load dashboard statistics.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showToast]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          setInquiries(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load inquiries");
      }
    };
    fetchInquiries();
  }, []);

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isRead: data.isRead } : item,
          ),
        );

        showToast(
          "Status Updated",
          data.isRead ? "Marked as read" : "Marked as unread",
          "success",
        );
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update failed", error);
      showToast("Error", "Could not update message status.", "error");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="w-64 h-screen fixed top-0 left-0 bg-white border-r shadow-sm p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <nav className="flex flex-col gap-2">
          <MenuLink href="/admin/dashboard" title="Dashboard" icon={Eye} />
          <MenuLink
            href="/admin/dashboard/blogs"
            title="Blogs"
            icon={BookOpen}
          />
          <MenuLink
            href="/admin/dashboard/gallery"
            title="Gallery"
            icon={ImageIcon}
          />
          <MenuLink
            href="/admin/dashboard/settings"
            title="Settings"
            icon={Settings}
          />
          <MenuLink
            href="/admin/dashboard/inquiries"
            title="Inquiries"
            icon={Mail}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-gray-50 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          {loading && (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Total Blogs"
            value={stats.totalBlogs}
            icon={BookOpen}
            color="blue"
            loading={loading}
          />
          <StatCard
            label="Published"
            value={stats.publishedBlogs}
            icon={FileText}
            color="green"
            loading={loading}
          />
          <StatCard
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            color="purple"
            loading={loading}
          />
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Recent Inquiries
            </h3>
            <Link
              href="/admin/dashboard/inquiries"
              className="text-sm text-red-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No messages yet.</p>
            ) : (
              inquiries.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg border transition-all ${
                    msg.isRead
                      ? "bg-gray-50 border-gray-100 opacity-75"
                      : "bg-white border-red-100 shadow-sm border-l-4 border-l-red-600"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                      )}
                      <span
                        className={`text-sm ${
                          msg.isRead
                            ? "text-gray-600"
                            : "font-bold text-gray-900"
                        }`}
                      >
                        {msg.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-400 font-medium uppercase">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                        className={`p-1 rounded-md transition-colors ${
                          msg.isRead
                            ? "text-gray-300 hover:text-red-600"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title={msg.isRead ? "Mark as unread" : "Mark as read"}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-xs line-clamp-1 ${
                      msg.isRead
                        ? "text-gray-500"
                        : "font-semibold text-gray-700"
                    }`}
                  >
                    {msg.subject}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1 italic">
                    "{msg.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ActionLink
                href="/admin/dashboard/blogs/new"
                title="Create New Blog"
                desc="Draft a new article"
                icon={PlusCircle}
                iconBg="bg-red-600"
              />
              <ActionLink
                href="/admin/dashboard/settings"
                title="Site Settings"
                desc="Update SEO and contact info"
                icon={Settings}
                iconBg="bg-gray-800"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// StatCard component
function StatCard({ label, value, icon: Icon, color, loading }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-100 animate-pulse rounded mt-1" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// ActionLink component
function ActionLink({ href, title, desc, icon: Icon, iconBg }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all group"
    >
      <div
        className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center text-white shadow-sm`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}

// Sidebar MenuLink component
function MenuLink({ href, title, icon: Icon }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{title}</span>
    </Link>
  );
}
