"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Video,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function VideoAdminPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    titleEn: "",
    titleNp: "",
    videoUrl: "",
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/upload/video-gallery");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/upload/video-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Video added to gallery!" });
        setFormData({ titleEn: "", titleNp: "", videoUrl: "" });
        fetchVideos();
      } else {
        throw new Error("Failed to save video");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteVideo = async (id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/upload/video-gallery?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVideos(videos.filter((v) => v._id !== id));
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Video Gallery Management
          </h2>
          <p className="text-gray-500">
            Add YouTube or Vimeo links to your campaign gallery
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Title (English)
            </label>
            <input
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="e.g. Campaign Launch 2024"
              value={formData.titleEn}
              onChange={(e) =>
                setFormData({ ...formData, titleEn: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Title (Nepali)
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="शीर्षक यहाँ लेख्नुहोस्"
              value={formData.titleNp}
              onChange={(e) =>
                setFormData({ ...formData, titleNp: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Video URL (YouTube/Vimeo)
            </label>
            <div className="relative">
              <Video className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                required
                type="url"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between border-t pt-6">
            {message.text && (
              <div
                className={`flex items-center gap-2 text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {message.text}
              </div>
            )}
            <button
              disabled={submitting}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Plus size={20} />
              )}
              Add Video
            </button>
          </div>
        </form>
      </div>

      {/* Video List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider">Preview</th>
              <th className="px-6 py-4 font-bold tracking-wider">Title</th>
              <th className="px-6 py-4 font-bold tracking-wider">URL</th>
              <th className="px-6 py-4 font-bold tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto text-red-600" />
                </td>
              </tr>
            ) : videos.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-gray-400 italic"
                >
                  No videos added yet.
                </td>
              </tr>
            ) : (
              videos.map((video) => (
                <tr
                  key={video._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-24 aspect-video bg-gray-200 rounded-md overflow-hidden relative group">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoUrl.split("v=")[1]?.split("&")[0]}/default.jpg`}
                        className="w-full h-full object-cover"
                        alt="Thumbnail"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div>{video.titleEn}</div>
                    <div className="text-xs text-gray-400">{video.titleNp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
                    >
                      Open Link <ExternalLink size={14} />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteVideo(video._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
