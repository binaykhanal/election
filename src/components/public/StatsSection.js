"use client";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

export function StatsSection({ data }) {
  const locale = useLocale();

  let stats = [];
  try {
    stats = data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Stats parsing error", e);
  }

  if (stats.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {locale === "np" ? stat.labelNp || stat.label : stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
