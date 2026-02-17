"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Layout, Video, Trash2, Plus } from "lucide-react";
import ImageGalleryModal from "@/components/public/ImageGalleryModal";
import TiptapEditor from "@/components/public/TiptapEditor";

// const ReactQuill = dynamic(() => import("react-quill-new"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-64 bg-gray-50 animate-pulse rounded-lg border" />
//   ),
// });

const CkEditor = dynamic(() => import("@/components/editor/CkEditor"), {
  ssr: false,
});

export default function ExperienceEditor({ value, onChange }) {
  const [data, setData] = useState(
    value || {
      pageTitle: "",
      pageSubtitle: "",
      politicalExperience: [],
      socialWork: [],
      education: [],
      videos: [],
    },
  );

  const [showGallery, setShowGallery] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState(null);
  const quillRefs = useRef({});

  const handleDataChange = (newData) => {
    setData(newData);
    onChange?.(newData);
  };

  const updateTopLevelField = (field, val) => {
    const newData = { ...data, [field]: val };
    handleDataChange(newData);
  };

  const updateField = (section, index, field, val) => {
    const updatedSection = [...data[section]];
    updatedSection[index][field] = val;
    handleDataChange({ ...data, [section]: updatedSection });
  };

  const addVideo = () => {
    const newVideo = { title: "", url: "" };
    handleDataChange({ ...data, videos: [...(data.videos || []), newVideo] });
  };

  const updateVideo = (index, field, val) => {
    const updatedVideos = [...data.videos];
    updatedVideos[index][field] = val;
    handleDataChange({ ...data, videos: updatedVideos });
  };

  const removeVideo = (index) => {
    const updated = data.videos.filter((_, i) => i !== index);
    handleDataChange({ ...data, videos: updated });
  };

  const addItem = (section) => {
    const template =
      section === "education"
        ? { degree: "", university: "", image: "" }
        : section === "politicalExperience"
          ? {
              period: "",
              role: "",
              organization: "",
              description: "",
              image: "",
            }
          : { title: "", year: "", description: "", image: "" };

    handleDataChange({ ...data, [section]: [...data[section], template] });
  };

  const removeItem = (section, index) => {
    const updated = [...data[section]];
    updated.splice(index, 1);
    handleDataChange({ ...data, [section]: updated });
  };

  const openGallery = (section, index, field) => {
    setGalleryTarget({ section, index, field });
    setShowGallery(true);
  };

  const handleImageSelect = (url) => {
    const { section, index, field } = galleryTarget;
    updateField(section, index, field, url);
    setShowGallery(false);
  };

  return (
    <div className="space-y-12">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
        <h2 className="text-blue-800 font-bold flex items-center gap-2">
          <Layout className="w-5 h-5" /> Page Header (Dynamic)
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Main Page Title
            </label>
            <input
              placeholder="e.g., My Political Journey"
              className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.pageTitle || ""}
              onChange={(e) => updateTopLevelField("pageTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Page Subtitle
            </label>
            <textarea
              placeholder="e.g., Dedicated to the service of Bhaktapur-2"
              className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none h-20"
              value={data.pageSubtitle || ""}
              onChange={(e) =>
                updateTopLevelField("pageSubtitle", e.target.value)
              }
            />
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
          <h2 className="text-amber-800 font-bold flex items-center gap-2 mb-4">
            <Video className="w-5 h-5" /> Video Gallery (YouTube/Vimeo)
          </h2>
          <div className="space-y-4">
            {(data.videos || []).map((vid, idx) => (
              <div
                key={idx}
                className="flex gap-3 bg-white p-3 rounded-lg border shadow-sm items-start"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder="Video Title (e.g., Speech in Bhaktapur)"
                    className="border p-2 rounded text-sm"
                    value={vid.title}
                    onChange={(e) => updateVideo(idx, "title", e.target.value)}
                  />
                  <input
                    placeholder="Video URL (YouTube or Vimeo)"
                    className="border p-2 rounded text-sm"
                    value={vid.url}
                    onChange={(e) => updateVideo(idx, "url", e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeVideo(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={addVideo}
              className="w-full py-3 border-2 border-dashed border-amber-300 text-amber-700 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors"
            >
              <Plus size={18} /> Add Video Link
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {["politicalExperience", "socialWork", "education"].map((section) => (
        <div key={section}>
          <h2 className="text-xl font-bold mb-4 capitalize flex items-center gap-2">
            {section.replace(/([A-Z])/g, " $1").trim()}
          </h2>

          <div className="space-y-4">
            {data[section].map((item, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-5 space-y-4 bg-gray-50 relative group transition-all hover:border-gray-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt="Entry"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
                        No Image
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => openGallery(section, idx, "image")}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black"
                  >
                    {item.image ? "Change Photo" : "+ Add Photo"}
                  </button>
                </div>

                {section === "politicalExperience" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Period (e.g., 2018-2022)"
                      className="border p-2 rounded"
                      value={item.period}
                      onChange={(e) =>
                        updateField(section, idx, "period", e.target.value)
                      }
                    />
                    <input
                      placeholder="Role"
                      className="border p-2 rounded"
                      value={item.role}
                      onChange={(e) =>
                        updateField(section, idx, "role", e.target.value)
                      }
                    />
                    <input
                      placeholder="Organization"
                      className="border p-2 rounded md:col-span-2"
                      value={item.organization}
                      onChange={(e) =>
                        updateField(
                          section,
                          idx,
                          "organization",
                          e.target.value,
                        )
                      }
                    />
                    <div className="md:col-span-2">
                      <CkEditor
                        editorData={item.description}
                        handleEditorChange={(val) =>
                          updateField(section, idx, "description", val)
                        }
                      />
                    </div>
                  </div>
                )}

                {section === "socialWork" && (
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      placeholder="Year"
                      className="border p-2 rounded"
                      value={item.year}
                      onChange={(e) =>
                        updateField(section, idx, "year", e.target.value)
                      }
                    />
                    <input
                      placeholder="Title"
                      className="border p-2 rounded"
                      value={item.title}
                      onChange={(e) =>
                        updateField(section, idx, "title", e.target.value)
                      }
                    />
                    <CkEditor
                      editorData={item.description}
                      handleEditorChange={(val) =>
                        updateField(section, idx, "description", val)
                      }
                    />
                  </div>
                )}

                {section === "education" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Degree"
                      className="border p-2 rounded"
                      value={item.degree}
                      onChange={(e) =>
                        updateField(section, idx, "degree", e.target.value)
                      }
                    />
                    <input
                      placeholder="University"
                      className="border p-2 rounded"
                      value={item.university}
                      onChange={(e) =>
                        updateField(section, idx, "university", e.target.value)
                      }
                    />
                  </div>
                )}

                <button
                  onClick={() => removeItem(section, idx)}
                  className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full transition-colors"
                  title="Remove Item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => addItem(section)}
            className="mt-4 flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-6 py-2 rounded-lg font-bold hover:bg-green-100"
          >
            + Add New Entry
          </button>
        </div>
      ))}

      {showGallery && (
        <ImageGalleryModal
          onClose={() => setShowGallery(false)}
          onSelect={handleImageSelect}
        />
      )}
    </div>
  );
}
