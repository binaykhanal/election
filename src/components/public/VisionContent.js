"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, ArrowRight, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { FaRoad } from "react-icons/fa";

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

export function VisionContent({ data, isNp }) {
  const [selectedVision, setSelectedVision] = useState(null);

  useEffect(() => {
    if (selectedVision) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("gallery-open");
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.classList.remove("gallery-open");
    }

    return () => {
      document.documentElement.classList.remove("gallery-open");
    };
  }, [selectedVision]);

  if (!data) return null;

  const visionAreas = data.vision_items || [];
  const commitments = data.commitments || [];

  const labels = {
    manifesto: isNp ? "हाम्रो घोषणापत्र" : "Our Manifesto",
    officialManifesto: isNp ? "अधिकारिक घोषणापत्र" : "Official Manifesto",
    commitment: isNp ? "हाम्रो अटूट प्रतिबद्धता" : "Our Solemn Commitment",
  };

  return (
    <div className="space-y-24">
      <div className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-600 rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
            {data.manifesto_header}
          </h2>
          {data.manifesto_subtitle && (
            <div
              className="prose prose-invert prose-lg md:prose-xl max-w-3xl text-white/90"
              dangerouslySetInnerHTML={{ __html: data.manifesto_subtitle }}
            />
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {visionAreas.map((area, index) => {
          const IconComponent = ICONS[area.icon] || ICONS.default;
          const plainText = area.content?.replace(/<[^>]+>/g, "") || "";

          return (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedVision(area)}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-4 rounded-2xl text-white shadow-lg ${area.color || "bg-red-600"}`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <span className="text-4xl font-black text-gray-50 group-hover:text-red-50 transition-colors">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                  {area.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 leading-relaxed mb-6">
                  {plainText}
                </p>
              </div>

              <div className="flex items-center text-red-600 font-bold text-sm uppercase tracking-wider">
                {isNp ? "थप पढ्नुहोस्" : "Read Roadmap"}
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-2 transition-transform"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {commitments.length > 0 && (
        <div className="relative p-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600 rounded-[3rem] shadow-2xl">
          <div className="bg-white rounded-[2.8rem] p-12 md:p-20">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">
                {labels.commitment}
              </h2>
              <div className="h-1.5 w-20 bg-red-600 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {commitments.map((c, i) => (
                <div key={i} className="relative text-center group">
                  <div className="text-2xl md:text-4xl font-black text-red-600 mb-4 tracking-tighter flex items-center justify-center gap-1">
                    {c.value}
                    <Star className="w-6 h-6 fill-red-600" />
                  </div>
                  <p className="text-gray-900 text-xl font-black uppercase tracking-tight leading-tight">
                    {isNp ? c.textNp || c.text : c.text}
                  </p>
                  {i < commitments.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 h-12 w-px bg-gray-100 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedVision && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVision(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div
                className={`p-8 text-white flex items-center justify-between ${selectedVision.color || "bg-red-600"}`}
              >
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = ICONS[selectedVision.icon] || ICONS.default;
                    return <Icon size={32} />;
                  })()}
                  <h3 className="text-2xl md:text-3xl font-black uppercase">
                    {selectedVision.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedVision(null)}
                  className="p-2 hover:bg-black/10 rounded-full transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="grid md:grid-cols-1 gap-8">
                  <div
                    className="prose prose-lg max-w-full text-gray-700 prose-headings:text-gray-900 prose-strong:text-red-700"
                    dangerouslySetInnerHTML={{ __html: selectedVision.content }}
                  />

                  {selectedVision.points?.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
                        Key Highlights
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {selectedVision.points.map((point, idx) => (
                          <div
                            key={idx}
                            className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl"
                          >
                            <CheckCircle2
                              className="text-red-600 mt-1 shrink-0"
                              size={20}
                            />
                            <span className="text-gray-800 font-medium">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
