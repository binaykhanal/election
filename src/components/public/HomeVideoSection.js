"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Youtube, Tv, X, Video, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export function HomeVideoSection() {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const isNp = locale === "np";

  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/upload/video-gallery");
        if (res.ok) {
          const data = await res.json();
          setVideos(data.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchVideos();
  }, []);

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.split(/v=|youtu\.be\//)[1]?.split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
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
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    return "/images/video-placeholder.jpg";
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 p-1.5 rounded-lg">
                <Video className="text-white w-4 h-4" />
              </span>
              <span className="text-red-600 font-bold uppercase tracking-widest text-xs">
                {isNp ? "भिडियो ग्यालेरी" : "Video Gallery"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 uppercase mt-4">
              {t("videoTitle") || "Latest Videos"}
            </h2>
          </div>
          <a
            href={`/${locale}/media/videos`}
            className="group flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-red-600 transition-colors"
          >
            {isNp ? "सबै हेर्नुहोस्" : "VIEW ALL VIDEOS"}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            1024: { slidesPerView: 2.5 },
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="video-swiper !pb-12"
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <div
                className="group cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src={getThumbnail(video.videoUrl)}
                    alt={video.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                      <Play className="fill-red-600 text-red-600 ml-1 w-6 h-6" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2">
                    {video.videoUrl.includes("youtube") ? (
                      <Youtube size={14} className="text-red-600" />
                    ) : (
                      <Tv size={14} />
                    )}
                    <span className="text-[10px] font-bold uppercase">
                      {video.videoUrl.includes("youtube") ? "YouTube" : "Vimeo"}
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-neutral-800  group-hover:text-red-600 transition-colors px-2">
                  {isNp ? video.titleNp || video.titleEn : video.titleEn}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button className="absolute top-8 right-8 text-white bg-red-600 p-2 rounded-full">
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
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
    </section>
  );
}
