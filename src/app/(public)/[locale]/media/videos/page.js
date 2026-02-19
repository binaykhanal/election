"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Loader2,
  Youtube,
  Tv,
  Video,
  ArrowRight,
  Share2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function VideoLibrary() {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const isNp = locale === "np";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/upload/video-gallery");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.split(/v=|youtu\.be\//)[1]?.split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (url.includes("vimeo.com")) {
      const id = url.split("vimeo.com/")[1]?.split(/[?&]/)[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  const getThumbnail = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.split(/v=|youtu\.be\//)[1]?.split(/[?&]/)[0];
      return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    }
    return "/images/video-placeholder.jpg";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-64 bg-red-50/50 skew-x-12 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center my-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            <div className="flex gap-2 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className=""
              >
                <div className="relative bg-red-600 p-2 rounded-2xl shadow-lg border-2 border-white rotate-3">
                  <Video className="text-white w-3 h-3" strokeWidth={2} />
                </div>
              </motion.div>

              <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-[10px]">
                {isNp ? "डिजिटल सामग्री" : "Digital Content"}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tighter uppercase  leading-tight">
              {t("videoTitle")?.split(" ")[0] || "VIDEO"}{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px #dc2626" }}
              >
                {t("videoTitle")?.split(" ").slice(1).join(" ") || "GALLERY"}
              </span>
            </h1>
            <p className="text-neutral-500 max-w-md mx-auto text-xs md:text-sm font-medium italic opacity-80">
              {t("videoSubtitle")}
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {videos.map((video, index) => {
            const displayTitle = isNp
              ? video.titleNp || video.titleEn
              : video.titleEn;

            return (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative aspect-video bg-white p-2 rounded-[1.5rem] shadow-md group-hover:shadow-xl transition-all duration-300 border border-neutral-100 overflow-hidden">
                  <div className="relative h-full w-full overflow-hidden rounded-[1.1rem]">
                    <img
                      src={getThumbnail(video.videoUrl)}
                      alt={displayTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-red-600 group-hover:border-red-600 transition-all shadow-lg">
                        <Play className="fill-white text-white ml-0.5 w-5 h-5" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                        {video.videoUrl.includes("youtube") ? (
                          <Youtube size={10} className="text-white" />
                        ) : (
                          <Tv size={10} className="text-white" />
                        )}
                        <span className="text-[8px] text-white font-bold uppercase tracking-tighter">
                          {video.videoUrl.includes("youtube")
                            ? "YouTube"
                            : "Vimeo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-red-600 font-mono text-[10px] font-bold opacity-40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-neutral-800 uppercase  tracking-tight group-hover:text-red-600 transition-colors line-clamp-1">
                      {displayTitle}
                    </h3>
                  </div>
                  <div className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div className="absolute top-4 right-4 z-[100002]">
              <button
                onClick={() => setActiveVideo(null)}
                className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg"
              >
                <X size={20} />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getEmbedUrl(activeVideo.videoUrl)}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
