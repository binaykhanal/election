"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Loader2,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/upload/gallery");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Gallery Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.classList.add("gallery-open");
    } else {
      document.body.classList.remove("gallery-open");
    }
    return () => document.body.classList.remove("gallery-open");
  }, [selectedIndex]);

  const showNext = useCallback(
    (e) => {
      e?.stopPropagation();
      setSelectedIndex((prev) => (prev + 1) % images.length);
    },
    [images.length],
  );

  const showPrev = useCallback(
    (e) => {
      e?.stopPropagation();
      setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, showNext, showPrev]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffafa] py-10 px-4 relative overflow-hidden">
      <div className="absolute top-10 -left-10 opacity-[0.02] rotate-12 pointer-events-none">
        <Image
          src="/images/hammer-sickle.png"
          alt=""
          width={300}
          height={300}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <header className="text-center my-10 max-w-2xl mx-auto">
          <div className="flex gap-2 items-center justify-center">
            <div className="flex  justify-center mb-4">
              <div className="bg-red-600 p-2 rounded-xl shadow-lg rotate-3 border-2 border-white">
                <Camera className="text-white w-3 h-3" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2  uppercase tracking-tighter leading-tight">
              {t("titlePrefix")}{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px #dc2626" }}
              >
                {t("titleHighlight")}
              </span>
            </h1>
          </div>

          <p className="text-xs md:text-sm text-gray-500 font-medium opacity-80 uppercase tracking-widest">
            {t("subtitle")}
          </p>
        </header>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, index) => (
            <motion.div
              key={img._id}
              className="break-inside-avoid"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative group cursor-pointer bg-white p-1.5 rounded-[1.2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                <div className="relative overflow-hidden rounded-[1rem]">
                  <img
                    src={img.url}
                    alt="Gallery"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/40">
                      <Maximize2 className="text-white w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={() => setSelectedIndex(null)}
            >
              <button
                className="fixed top-6 right-6 z-[100002] w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white shadow-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(null);
                }}
              >
                <X size={20} />
              </button>

              <button
                className="fixed left-4 z-[100001] p-2 text-white/50 hover:text-white transition-colors"
                onClick={showPrev}
              >
                <ChevronLeft size={40} />
              </button>

              <button
                className="fixed right-4 z-[100001] p-2 text-white/50 hover:text-white transition-colors"
                onClick={showNext}
              >
                <ChevronRight size={40} />
              </button>

              <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={images[selectedIndex].url}
                  alt="Zoomed"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />

                <div className="absolute bottom-6 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  <p className="text-white font-mono text-[10px] tracking-widest uppercase">
                    {selectedIndex + 1} / {images.length}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
