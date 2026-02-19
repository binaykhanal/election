"use client";

import { useState, useEffect } from "react";
import ImageUploadGalleryModal from "@/components/dashboard/ImageUploadGalleryModal";
import { Trash2, PlusCircle, Loader2 } from "lucide-react";

export default function GalleryPage() {
  const [showModal, setShowModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/upload/gallery");
      const data = await res.json();
      setGalleryImages(data);
    } catch (err) {
      console.error("Failed to fetch gallery images", err);
    }
  };

  // Permanently delete an image
  const handleDelete = async (filename) => {
    if (!confirm("Delete this image permanently?")) return;
    setIsDeleting(filename);

    try {
      const res = await fetch("/api/upload/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      if (res.ok) {
        setGalleryImages((prev) =>
          prev.filter((img) => img.filename !== filename),
        );
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      alert("Delete failed");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUploadSelect = (images) => {
    const newImages = images.filter(
      (img) => !galleryImages.some((g) => g.url === img.url),
    );
    setGalleryImages((prev) => [...newImages, ...prev]);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Image Gallery</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500 transition"
        >
          <PlusCircle className="w-5 h-5" />
          Upload Image
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {galleryImages.map((img) => (
          <div
            key={img.filename}
            className="relative group rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-all"
          >
            <img
              src={img.url}
              alt="Gallery"
              className="w-full h-48 object-cover"
            />

            <button
              disabled={isDeleting === img.filename}
              onClick={() => handleDelete(img.filename)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-600 hover:text-white text-red-600 rounded-lg shadow-sm transition-all z-10"
            >
              {isDeleting === img.filename ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <ImageUploadGalleryModal
          onSelect={handleUploadSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
