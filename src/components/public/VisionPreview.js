"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Heart,
  Briefcase,
  Sprout,
  Mountain,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import { FaRoad } from "react-icons/fa";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";

const ICONS = {
  graduation: Icons.GraduationCap,
  heart: Icons.Heart,
  road: FaRoad,
  briefcase: Icons.Briefcase,
  leaf: Icons.Sprout,
  mountain: Icons.Mountain,
  map: Icons.Globe,
  default: Icons.CheckSquare,
};

export function VisionPreview({ data }) {
  const t = useTranslations("vision");
  const locale = useLocale();

  const isNp = locale === "np";

  const [visionData, setVisionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVision, setSelectedVision] = useState(null);

  let content = {};
  try {
    content = typeof data === "string" ? JSON.parse(data) : data || {};
  } catch (e) {
    console.error("Failed to parse vision data", e);
    content = {};
  }

  useEffect(() => {
    async function loadVision() {
      try {
        const res = await fetch("/api/content?page=vision&section=vision_page");
        const data = await res.json();
        const visionObj = data[0] || {};
        const contentStr = isNp ? visionObj.valueNp : visionObj.valueEn;

        if (contentStr) {
          setVisionData(JSON.parse(contentStr));
        }
      } catch (err) {
        console.error("Failed to load vision content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVision();
  }, [isNp]);

  useEffect(() => {
    const html = document.documentElement;
    if (selectedVision) {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      html.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      html.style.overflow = "unset";
    };
  }, [selectedVision]);

  if (!visionData) return null;

  const visionAreas = visionData.vision_items || [];
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
            {content.title || t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.subtitle || t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visionAreas.slice(0, 6).map((area, index) => {
            const IconComponent = ICONS[area.icon] || ICONS.default;
            const plainText = area.content?.replace(/<[^>]+>/g, "") || "";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVision(area)}
                className="group bg-white rounded-2xl md:rounded-[2rem] shadow-lg p-6 md:p-8 border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all cursor-pointer min-h-[320px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3 rounded-xl text-white shadow-md ${area.color || "bg-red-600"}`}
                    >
                      <IconComponent size={24} className="md:w-8 md:h-8" />
                    </div>
                    <span className="text-3xl md:text-4xl font-black text-gray-100 group-hover:text-red-50/50 transition-colors">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-gray-800 uppercase mb-3 tracking-tight">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 text-sm md:text-base leading-relaxed mb-6">
                    {plainText}
                  </p>
                </div>
                <div className="flex items-center text-red-600 font-bold text-xs md:text-sm uppercase tracking-wider">
                  {isNp ? "थप पढ्नुहोस्" : "Read Roadmap"}
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}/vision`}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/20"
          >
            {locale === "np"
              ? "पूर्ण घोषणापत्र हेर्नुहोस्"
              : "View Full Manifesto"}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {selectedVision && (
          <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVision(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full md:max-w-4xl bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div
                className={`sticky top-0 z-20 px-6 py-4 md:px-8 md:py-6 text-white flex items-center justify-between shrink-0 ${selectedVision.color || "bg-red-600"}`}
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const ModalIcon =
                      ICONS[selectedVision.icon] || ICONS.default;
                    return <ModalIcon className="w-5 h-5 md:w-6 md:h-6" />;
                  })()}
                  <h3 className="text-sm md:text-lg font-black uppercase tracking-tight">
                    {selectedVision.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedVision(null)}
                  className="bg-black/20 p-2 rounded-full hover:bg-black/40 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div
                  className="prose prose-sm md:prose-lg max-w-full text-gray-700 prose-headings:text-gray-900 prose-headings:font-black prose-strong:text-red-700"
                  dangerouslySetInnerHTML={{ __html: selectedVision.content }}
                />

                {selectedVision.points?.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="grid grid-cols-1 gap-3">
                      {selectedVision.points.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100"
                        >
                          <CheckCircle2
                            className="text-red-600 mt-0.5 shrink-0"
                            size={18}
                          />
                          <span className="text-gray-800 font-medium text-sm md:text-base">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
