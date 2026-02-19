"use client";
import { useState, useEffect } from "react";
import { Upload, CheckCircle2, X, Trash2, Loader2 } from "lucide-react";

export default function ImageGalleryModal({ onSelect, onClose }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) setImages([data, ...images]);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e, fileUrl) => {
    e.stopPropagation(); 
    if (!confirm("Delete this image forever?")) return;

    setIsDeleting(fileUrl);

    const filename = fileUrl.split("/").pop();

    try {
      const res = await fetch(`/api/upload`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        setImages(images.filter((img) => img.url !== fileUrl));
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Media Library</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <label className="group border-2 border-dashed border-gray-200 rounded-xl p-10 mb-8 flex flex-col items-center justify-center cursor-pointer hover:border-communist-red hover:bg-red-50/30 transition-all">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="w-10 h-10 mb-2 animate-spin text-communist-red" />
            ) : (
              <Upload className="w-10 h-10 mb-2 text-gray-400 group-hover:text-communist-red transition-colors" />
            )}
            <p className="font-semibold text-gray-600">
              {uploading
                ? "Processing..."
                : "Drop a new image here or click to browse"}
            </p>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.url}
                className="group relative aspect-square rounded-xl border bg-gray-50 overflow-hidden cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  onSelect(img.url);
                  onClose();
                }}
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover"
                  alt="gallery"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="text-white w-8 h-8" />
                  <span className="text-white text-xs font-bold uppercase tracking-wider">
                    Select
                  </span>
                </div>

                <button
                  disabled={isDeleting === img.name}
                  onClick={(e) => handleDelete(e, img.url)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-600 hover:text-white text-red-600 rounded-lg shadow-sm transition-all z-10"
                >
                  {isDeleting === img.name ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {images.length === 0 && !uploading && (
            <div className="text-center py-10 text-gray-400">
              Your media library is empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
