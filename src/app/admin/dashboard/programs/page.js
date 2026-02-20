"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Clock,
  Save,
  X,
  Loader2,
} from "lucide-react";

export default function ProgramAdmin() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    titleEn: "",
    titleNp: "",
    locationEn: "",
    locationNp: "",
    date: "",
    timeEn: "",
    timeNp: "",
    status: "UPCOMING",
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      const res = await fetch("/api/programs");
      const data = await res.json();
      setPrograms(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/programs/${editingId}` : "/api/programs";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          titleEn: "",
          titleNp: "",
          locationEn: "",
          locationNp: "",
          date: "",
          timeEn: "",
          timeNp: "",
          status: "UPCOMING",
        });
        setEditingId(null);
        fetchPrograms();
      }
    } catch (err) {
      alert("Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (program) => {
    setEditingId(program._id);
    setFormData({
      ...program,
      date: program.date.split("T")[0],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/programs/${id}`, { method: "DELETE" });
    fetchPrograms();
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase italic">
            Program Manager
          </h1>
          <p className="text-sm text-neutral-500">
            Schedule and manage daily campaign activities
          </p>
        </div>
        <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg">
          <Calendar size={20} />
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6 mb-10">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          {editingId ? (
            <Edit2 size={18} className="text-amber-500" />
          ) : (
            <Plus size={18} className="text-red-600" />
          )}
          {editingId ? "Edit Program" : "Add New Program"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 px-1">
                  Program Details
                </label>
                <input
                  type="text"
                  placeholder="Title (English)"
                  required
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 ring-red-500/20 outline-none transition-all"
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="शीर्षक (नेपाली)"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 ring-red-500/20 outline-none transition-all"
                  value={formData.titleNp}
                  onChange={(e) =>
                    setFormData({ ...formData, titleNp: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 px-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Location (English)"
                  required
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                  value={formData.locationEn}
                  onChange={(e) =>
                    setFormData({ ...formData, locationEn: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="स्थान (नेपाली)"
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                  value={formData.locationNp}
                  onChange={(e) =>
                    setFormData({ ...formData, locationNp: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 px-1">
                  Schedule & Status
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    required
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  <select
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 px-1">
                  Timing
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Time (e.g. 10 AM)"
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl"
                    value={formData.timeEn}
                    onChange={(e) =>
                      setFormData({ ...formData, timeEn: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="समय (उदा: बिहान १० बजे)"
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl"
                    value={formData.timeNp}
                    onChange={(e) =>
                      setFormData({ ...formData, timeNp: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-neutral-900 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-black/10"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : editingId ? (
                    <Save size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                  {editingId ? "Update Program" : "Save Program"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        titleEn: "",
                        titleNp: "",
                        locationEn: "",
                        locationNp: "",
                        date: "",
                        timeEn: "",
                        timeNp: "",
                        status: "UPCOMING",
                      });
                    }}
                    className="bg-neutral-200 text-neutral-600 px-6 rounded-xl font-bold hover:bg-neutral-300 transition-all"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {programs.map((p) => (
          <div
            key={p._id}
            className="bg-white p-5 rounded-2xl border border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-red-100 transition-all"
          >
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">
                {new Date(p.date).getDate()}
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 uppercase tracking-tight">
                  {p.titleEn} <span className="text-neutral-300 mx-2">|</span>{" "}
                  {p.titleNp}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-red-400" /> {p.locationEn}{" "}
                    / {p.locationNp}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-red-400" /> {p.timeEn} /{" "}
                    {p.timeNp}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span
                className={`text-[10px] px-3 py-1 rounded-full font-bold ${
                  p.status === "COMPLETED"
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {p.status}
              </span>
              <button
                onClick={() => handleEdit(p)}
                className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
