"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { FaRoad } from "react-icons/fa";
import { useLocale } from "next-intl";
import Image from "next/image";

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

export function VisionContent({ data }) {
  const locale = useLocale();

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  const visionAreas = data?.vision_items || [];
  const commitments = data?.commitments || [];
  const manifestoHtml = decodeHtml(data.manifesto_subtitle);

  return (
    <div className="space-y-24 ">
      <div className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-600 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
        <Image
          src="/images/hammer-sickle.png"
          alt=""
          width={300}
          height={300}
          className="absolute -right-20 -bottom-20 opacity-10 rotate-12 hidden md:block"
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Official Manifesto
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
            {data.manifesto_header ||
              (locale === "np" ? "हाम्रो घोषणापत्र" : "Our Manifesto")}
          </h2>

          {data.manifesto_subtitle && (
            <div
              className="
          prose prose-invert
          prose-lg md:prose-xl
          max-w-3xl
          text-white/90
          prose-headings:text-white
          prose-strong:text-white
          prose-a:text-white
        "
              dangerouslySetInnerHTML={{ __html: manifestoHtml }}
            />
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {visionAreas.map((area, index) => {
          const IconComponent = ICONS[area.icon] || ICONS.default;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group max-w-[350px] md:max-w-full bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-4 md:p-10 border border-gray-50 hover:border-red-100 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 ${area.color || "bg-red-600"} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase">
                    {area.title}
                  </h3>
                </div>
                <span className="text-2xl md:text-5xl font-black text-gray-100 group-hover:text-red-50 transition-colors">
                  0{index + 1}
                </span>
              </div>

              <ul className="grid gap-4">
                {area.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-2 md:p-4 rounded-2xl hover:bg-red-50 transition-colors group/item"
                  >
                    <div className="mt-1 bg-red-100 p-1 rounded-full group-hover/item:bg-red-600 transition-colors">
                      <Check className="w-3 h-3 text-red-600 group-hover/item:text-white" />
                    </div>
                    <span className="text-gray-700 font-semibold  text-sm md:text-lg leading-snug">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {commitments.length > 0 && (
        <div className="relative p-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600 rounded-[3rem] shadow-2xl">
          <div className="bg-white rounded-[2.8rem] p-12 md:p-20">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">
                Our Solemn Commitment
              </h2>
              <div className="h-1.5 w-20 bg-red-600 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {commitments.map((c, i) => (
                <div key={i} className="relative text-center group">
                  <div className=" text-2xl md:text-4xl font-black text-red-600 mb-4 tracking-tighter flex items-center justify-center gap-1">
                    {c.value}
                    <Star className="w-6 h-6 fill-red-600" />
                  </div>
                  <p className="text-gray-900 text-xl font-black uppercase tracking-tight leading-tight">
                    {c.text}
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
    </div>
  );
}
