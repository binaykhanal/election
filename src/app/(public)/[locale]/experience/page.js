"use client";

import { useLocale } from "next-intl";
import { ExperienceContent } from "@/components/public/ExperienceContent";
import { useEffect, useState } from "react";
import { Loader2, Youtube } from "lucide-react";
import Image from "next/image";

export default function ExperiencePage() {
  const locale = useLocale(); // "en" or "np"
  const [experienceData, setExperienceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExperience() {
      try {
        const res = await fetch("/api/content?page=experience");
        const rawData = await res.json();
        const record = rawData.find((item) => item.key === "experience_page");
        if (record) {
          const jsonString = locale === "np" ? record.valueNp : record.valueEn;
          setExperienceData(JSON.parse(jsonString));
        }
      } catch (err) {
        console.error("Experience Page Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExperience();
  }, [locale]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600 w-12 h-12" />
      </div>
    );

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <div className="min-h-screen bg-[#fffafa] relative overflow-hidden">
      <div className="absolute top-10 -right-20 opacity-[0.03] rotate-12 pointer-events-none">
        <Image
          src="/images/hammer-sickle.png"
          alt=""
          width={600}
          height={600}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-xl border border-red-50 mb-8">
            <div className="relative w-10 h-6">
              <Image
                src="/images/hammer-sickle.png"
                alt="Flag"
                fill
                className="object-contain"
              />
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Image
                src="/images/star.png"
                alt="Star"
                width={20}
                height={20}
                className="animate-pulse"
              />
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                {locale === "np" ? "नेतृत्व प्रोफाइल" : "Leader Profile"}
              </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 tracking-tighter uppercase  leading-none">
            {experienceData?.pageTitle ||
              (locale === "np" ? "राजनीतिक यात्रा" : "Political Journey")}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium italic max-w-2xl mx-auto border-t border-red-100 pt-6">
            "
            {experienceData?.pageSubtitle ||
              (locale === "np"
                ? "भक्तपुर-२ को समृद्धिको लागि समर्पित"
                : "Dedicated to the prosperity of Bhaktapur-2")}
            "
          </p>
        </div>

        <ExperienceContent
          politicalExperience={experienceData?.politicalExperience || []}
          socialWork={experienceData?.socialWork || []}
          education={experienceData?.education || []}
          locale={locale === "np" ? "ne" : "en"}
        />

        {experienceData?.videos?.length > 0 && (
          <div className="mt-32 pt-20 border-t border-gray-100">
            <div className="flex flex-col items-center mb-12">
              <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-200 mb-4">
                <Youtube className="text-white w-6 h-6" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                Media Highlights
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {experienceData.videos.map((vid, idx) => (
                <div key={idx} className="group relative">
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white transform transition-all duration-500 group-hover:-translate-y-2">
                    <iframe
                      src={getEmbedUrl(vid.url)}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {vid.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
