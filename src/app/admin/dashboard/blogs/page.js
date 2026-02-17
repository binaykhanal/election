"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  FileText,
} from "lucide-react";

export default function BlogsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.titleNp?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
        if (res.ok) {
          setBlogs(blogs.filter((b) => b.id !== id));
        }
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const togglePublish = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    const newStatus = !blog.published;

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published: newStatus,
          publishedAt: newStatus ? new Date() : null,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBlogs(blogs.map((b) => (b.id === id ? updated : b)));
      }
    } catch (err) {
      alert("Status update failed");
    }
  };

  if (isLoading)
    return (
      <div className="p-12 text-center text-gray-500 font-medium animate-pulse">
        Loading campaign blogs...
      </div>
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
        <Link
          href="/admin/dashboard/blogs/new"
          className="inline-flex items-center gap-2 bg-communist-red text-white px-4 py-2 rounded-lg font-medium hover:bg-communist-darkred transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Blog
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        {blogs.length > 0 && (
          <div className="p-4 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-communist-red"
              />
            </div>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No blogs to show here
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first campaign post.
            </p>
            <Link
              href="/admin/dashboard/blogs/new"
              className="text-communist-red font-medium hover:underline"
            >
              Create first blog post &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title (EN)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title (NP)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {blog.titleEn}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 line-clamp-1 font-nepali">
                          {blog.titleNp}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublish(blog.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            blog.published
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          }`}
                        >
                          {blog.published ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          {blog.published ? "PUBLISHED" : "DRAFT"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/dashboard/blogs/edit/${blog.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12 bg-gray-50">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  No blogs match your search "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-communist-red text-sm font-medium mt-2"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
