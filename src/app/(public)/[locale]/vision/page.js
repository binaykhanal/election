"use client";

import { useTranslations, useLocale } from "next-intl";
import { VisionContent } from "@/components/public/VisionContent";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, PlayCircle, Youtube } from "lucide-react";

export default function VisionPage() {
  const t = useTranslations("vision");
  const locale = useLocale();
  const [visionData, setVisionData] = useState(null);
  const [loading, setLoading] = useState(true);

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  useEffect(() => {
    async function loadVision() {
      try {
        const res = await fetch("/api/content?page=vision&section=vision_page");
        const data = await res.json();
        const visionObj = data[0] || {};
        const contentStr =
          locale === "np" ? visionObj.valueNp : visionObj.valueEn;
        setVisionData(contentStr ? JSON.parse(contentStr) : null);
      } catch (err) {
        console.error("Failed to load vision content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVision();
  }, [locale]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = "";
    try {
      if (url.includes("youtube.com/shorts/")) {
        videoId = url.split("/shorts/")[1]?.split("?")[0];
      } else if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("/").pop()?.split("?")[0];
      } else if (url.includes("vimeo.com/")) {
        videoId = url.split("/").pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (error) {
      return url;
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );

  if (!visionData)
    return <div className="text-center py-20">No data Found.</div>;

  return (
    <div className="min-h-screen bg-[#fffafa] relative overflow-hidden">
      <div className=" absolute top-40 -right-20 opacity-[0.03] rotate-45 hidden lg:block">
        <Image
          src="/images/hammer-sickle.png"
          alt=""
          width={600}
          height={600}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/star.png"
              alt="Star"
              width={48}
              height={48}
              className="animate-pulse"
            />
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">
            {visionData.title || t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {visionData.subtitle || t("subtitle")}
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="h-1.5 w-16 bg-red-600 rounded-full" />
            <Image
              src="/images/hammer-sickle.png"
              alt="Symbol"
              width={40}
              height={40}
            />
            <div className="h-1.5 w-16 bg-red-600 rounded-full" />
          </div>
        </div>

        <VisionContent data={visionData} />

        {visionData?.videos?.length > 0 && (
          <div className="mt-32">
            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-3 text-red-600 font-bold tracking-widest uppercase text-sm mb-2">
                <Youtube className="w-5 h-5" />
                <span>Media & Updates</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                CAMPAIGN HIGHLIGHTS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {visionData.videos.map((vid, idx) => (
                <div key={idx} className="group relative">
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:scale-[1.02]">
                    <iframe
                      src={getEmbedUrl(vid.url)}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-6 pl-4 border-l-4 border-red-600">
                    <h3 className="font-black text-sm md:text-xl text-gray-800 uppercase tracking-tight">
                      {vid.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
