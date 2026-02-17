"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";

export function BlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("blogs");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          const published = data
            .filter((b) => b.published)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBlogs(published);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-communist-red" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No blog posts found.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <article
          key={blog.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="h-52 overflow-hidden">
            <img
              src={blog.featuredImage || "/images/placeholder.jpg"}
              alt={locale === "np" ? blog.titleNp : blog.titleEn}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              {new Date(blog.createdAt).toLocaleDateString(
                locale === "np" ? "ne-NP" : "en-US",
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
              {locale === "np" ? blog.titleNp : blog.titleEn}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {locale === "np" ? blog.excerptNp : blog.excerptEn}
            </p>
            <Link
              href={`/${locale}/blogs/${blog.slug}`}
              className="inline-flex items-center gap-2 text-communist-red font-bold hover:gap-3 transition-all"
            >
              {t("readMore")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
