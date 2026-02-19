"use client";

import { useState, useEffect } from "react";
import { Upload, CheckCircle2, X, Trash2, Loader2 } from "lucide-react";

export default function ImageUploadGalleryModal({ onSelect, onClose }) {
  const [images, setImages] = useState([]); // all images in gallery
  const [selectedImages, setSelectedImages] = useState([]); // for previously uploaded
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/upload/gallery");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Direct upload handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const res = await fetch("/api/upload/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages((prev) => [...data, ...prev]);
        // Immediately add uploaded images to parent gallery
        onSelect(data);
      } else if (data.url) {
        setImages((prev) => [data, ...prev]);
        onSelect([data]);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleDelete = async (e, filename) => {
    e.stopPropagation();
    if (!confirm("Delete this image forever?")) return;
    setIsDeleting(filename);

    try {
      const res = await fetch("/api/upload/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        setImages(images.filter((img) => img.filename !== filename));
        setSelectedImages((prev) =>
          prev.filter((img) => img.filename !== filename),
        );
      } else {
        const data = await res.json();
        alert(data.error || "Could not delete file");
      }
    } catch (err) {
      alert("Could not delete file");
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleSelect = (img) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img],
    );
  };

  // Clicking the footer button selects previously uploaded images
  const handleConfirmSelection = () => {
    onSelect(selectedImages);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Gallery</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Input */}
          <label className="group border-2 border-dashed border-gray-200 rounded-xl p-10 mb-8 flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-red-50/30 transition-all">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
              multiple
            />
            {uploading ? (
              <Loader2 className="w-10 h-10 mb-2 animate-spin text-red-600" />
            ) : (
              <Upload className="w-10 h-10 mb-2 text-gray-400 group-hover:text-red-600 transition-colors" />
            )}
            <p className="font-semibold text-gray-600 text-center">
              {uploading
                ? "Uploading..."
                : "Click or drop images to upload (supports multiple)"}
            </p>
          </label>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => {
              const isSelected = selectedImages.includes(img);
              return (
                <div
                  key={img.filename}
                  className={`group relative aspect-square rounded-xl border bg-gray-50 overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                    isSelected ? "ring-4 ring-red-600" : ""
                  }`}
                  onClick={() => toggleSelect(img)}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt="gallery"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 className="text-white w-8 h-8" />
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      Select
                    </span>
                  </div>
                  <button
                    disabled={isDeleting === img.filename}
                    onClick={(e) => handleDelete(e, img.filename)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-600 hover:text-white text-red-600 rounded-lg shadow-sm transition-all z-10"
                  >
                    {isDeleting === img.filename ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selected preview */}
          {selectedImages.length > 0 && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <h4 className="font-bold mb-2">Selected Images:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedImages.map((img) => (
                  <img
                    key={img.filename}
                    src={img.url}
                    alt="selected"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {images.length > 0 && (
          <div className="p-4 border-t flex justify-end bg-gray-50">
            <button
              onClick={handleConfirmSelection}
              disabled={selectedImages.length === 0}
              className="bg-red-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-all"
            >
              Select {selectedImages.length} Image
              {selectedImages.length > 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
