"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Heart,
  Briefcase,
  Sprout,
  Mountain,
} from "lucide-react";
import { FaRoad } from "react-icons/fa";

export function VisionPreview({ data }) {
  const t = useTranslations("vision");
  const locale = useLocale();

  let content = {};
  try {
    content = typeof data === "string" ? JSON.parse(data) : data || {};
  } catch (e) {
    console.error("Failed to parse vision data", e);
    content = {};
  }

  const visionAreas = [
    {
      icon: GraduationCap,
      title: t("education"),
      desc: content.education_desc,
      color: "bg-blue-500",
    },
    {
      icon: Heart,
      title: t("healthcare"),
      desc: content.health_desc,
      color: "bg-red-500",
    },
    {
      icon: FaRoad,
      title: t("infrastructure"),
      desc: content.infra_desc,
      color: "bg-gray-600",
    },
    {
      icon: Briefcase,
      title: t("employment"),
      desc: content.job_desc,
      color: "bg-green-600",
    },
    {
      icon: Sprout,
      title: t("agriculture"),
      desc: content.agri_desc,
      color: "bg-emerald-500",
    },
    {
      icon: Mountain,
      title: t("tourism"),
      desc: content.tour_desc,
      color: "bg-purple-600",
    },
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visionAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100"
            >
              <div
                className={`w-14 h-14 ${area.color} rounded-lg flex items-center justify-center mb-4 shadow-md`}
              >
                <area.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {area.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {area.desc ||
                  "Plans to transform and develop this sector for the benefit of all citizens."}
              </p>
            </motion.div>
          ))}
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
    </section>
  );
}
