"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";

export function LatestBlogs() {
  const t = useTranslations("blogs");
  const locale = useLocale();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();

          const latest = data
            .filter((blog) => blog.published === true)
            .sort((a, b) => {
              const dateA = new Date(a.publishedAt || a.createdAt);
              const dateB = new Date(b.publishedAt || b.createdAt);
              return dateB - dateA;
            })
            .slice(0, 3);

          setBlogs(latest);
        }
      } catch (err) {
        console.error("Failed to fetch latest blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (isLoading || blogs.length === 0) return null;

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 opacity-[0.03] pointer-events-none -translate-y-1/4 translate-x-1/4 z-0">
        <Image
          src="/images/star.png"
          alt=""
          width={600}
          height={600}
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={blog.featuredImage || "/images/placeholder.jpg"}
                  alt={locale === "np" ? blog.titleNp : blog.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(
                      blog.publishedAt || blog.createdAt,
                    ).toLocaleDateString(locale === "np" ? "ne-NP" : "en-US")}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {locale === "np" ? blog.titleNp : blog.titleEn}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {locale === "np" ? blog.excerptNp : blog.excerptEn}
                </p>

                <Link
                  href={`/${locale}/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-2 text-communist-red font-semibold hover:underline"
                >
                  {t("readMore")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={`/${locale}/blogs`}
            className="inline-flex items-center gap-2 border-2 border-communist-red text-communist-red px-6 py-3 rounded-full font-semibold hover:bg-communist-red hover:text-white transition-colors"
          >
            {locale === "np" ? "सबै ब्लगहरू हेर्नुहोस्" : "View All Blogs"}{" "}
          </Link>
        </div>
      </div>
    </section>
  );
}
