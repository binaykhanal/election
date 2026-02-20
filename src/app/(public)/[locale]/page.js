"use client";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { StatsSection } from "@/components/public/StatsSection";
import { MeetDeepshikha } from "@/components/public/MeetDeepshikha";
import { VisionPreview } from "@/components/public/VisionPreview";
import { LatestBlogs } from "@/components/public/LatestBlogs";
import { CTASection } from "@/components/public/CTASection";
import { HomeVideoSection } from "@/components/public/HomeVideoSection";

export default function HomePage() {
  const locale = useLocale();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllContent() {
      try {
        const res = await fetch(`/api/content?page=home`);
        const data = await res.json();

        const contentMap = {};
        data.forEach((item) => {
          contentMap[item.key] = locale === "np" ? item.valueNp : item.valueEn;
        });
        setPageData(contentMap);
      } catch (err) {
        console.error("Failed to fetch home content", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllContent();
  }, [locale]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection data={pageData?.hero} />
      <StatsSection data={pageData?.stats} />
      <MeetDeepshikha />
      <VisionPreview data={pageData?.vision_preview} />
      <LatestBlogs />
      <HomeVideoSection />
      <CTASection data={pageData?.cta_home} />
    </>
  );
}
