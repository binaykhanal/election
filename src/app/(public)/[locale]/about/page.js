"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { AboutContent } from "@/components/public/AboutContent";
import { Loader2 } from "lucide-react";

export default function AboutPage() {
  const locale = useLocale();
  const [dataMap, setDataMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAboutData() {
      try {
        const res = await fetch(`/api/content?page=about`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const map = {};
        data.forEach((item) => {
          map[item.key] = { en: item.valueEn, np: item.valueNp };
        });
        setDataMap(map);
      } catch (error) {
        console.error("About Page Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    getAboutData();
  }, [locale]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );

  if (!dataMap) return <div className="text-center py-20">No data found</div>;

  let meta = {};
  const rawMeta = dataMap.about_header?.[locale];
  if (rawMeta) {
    try {
      meta = JSON.parse(rawMeta);
    } catch (e) {
      meta = {};
    }
  }

  return (
    <div className="min-h-screen bg-[#fffafa] relative overflow-hidden">
      <div className="absolute top-20 -left-10 opacity-[0.05] rotate-12 hidden lg:block">
        <Image
          src="/images/hammer-sickle.png"
          alt=""
          width={400}
          height={400}
        />
      </div>
      <div className="absolute bottom-40 -right-10 opacity-[0.05] -rotate-12 hidden lg:block">
        <Image src="/images/star.png" alt="" width={300} height={300} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/star.png"
              alt="Star"
              width={40}
              height={40}
              className="animate-pulse"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter italic uppercase">
            {meta.title || (locale === "np" ? "मेरो बारेमा" : "About Me")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
            {meta.subtitle || ""}
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-1 w-12 bg-red-600 rounded-full" />
            <Image
              src="/images/hammer-sickle.png"
              alt="Symbol"
              width={30}
              height={30}
            />
            <div className="h-1 w-12 bg-red-600 rounded-full" />
          </div>
        </div>

        <AboutContent dataMap={dataMap} locale={locale} />
      </div>
    </div>
  );
}
