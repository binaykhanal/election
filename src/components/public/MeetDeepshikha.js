"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowRight, History, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MeetDeepshikha() {
  const locale = useLocale();
  const isNp = locale === "np";
  const [experienceData, setExperienceData] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch("/api/content?page=experience");
        if (res.ok) {
          const data = await res.json();
          const expItem = data.find(
            (item) => item.type === "EXPERIENCE_EDITOR",
          );
          if (expItem) {
            setExperienceData(
              JSON.parse(isNp ? expItem.valueNp : expItem.valueEn),
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch experience:", err);
      }
    };
    fetchExperience();
  }, [isNp]);

  if (!experienceData) return null;

  return (
    <section className="py-16 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -translate-y-1/4 translate-x-1/4">
        <Image src="/images/star.png" alt="" width={600} height={600} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-5/12 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 border-4 border-dashed border-red-200 rounded-full animate-spin-slow" />
              <div className="absolute inset-4 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-gray-100">
                <Image
                  src="/images/dipsikha.jpeg"
                  alt="Ram Prasad Sapkota"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-red-600 p-3 rounded-full shadow-lg border-4 border-white">
                <Image
                  src="/images/star.png"
                  alt="Star"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              {isNp ? "हाम्रो प्रतिनिधि" : "Our Representative"}
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1]">
              {isNp
                ? "रामप्रसाद सापकोटा 'दीपशिखा'"
                : "Ram Prasad Sapkota 'Deepshikha'"}
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              {isNp
                ? "भक्तपुर-२ का उम्मेदवार दीपशिखा एक अनुभवी युवा नेता हुनुहुन्छ। उहाँले युवा परिचालन, सामाजिक न्याय र विकासको क्षेत्रमा दुई दशकभन्दा बढी समय समर्पित गर्नुभएको छ।"
                : "A dedicated leader for Bhaktapur-2, Deepshikha has spent over two decades at the forefront of youth mobilization, social justice, and national development."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {experienceData.politicalExperience?.[0] && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                  <div className="w-8 h-8 p-3 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                    <History size={24} className="shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      {isNp ? "अनुभव" : "Experience"}
                    </p>
                    <p className="font-bold text-gray-900">
                      {experienceData.politicalExperience[0].role}
                    </p>
                  </div>
                </div>
              )}

              {experienceData.education?.[0] && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                  <div className="w-8 h-8 p-3 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                    <GraduationCap size={24} className="shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      {isNp ? "शिक्षा" : "Education"}
                    </p>
                    <p className="font-bold text-gray-900">
                      {experienceData.education[0].degree}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-6">
              <Link
                href="/experience"
                className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95"
              >
                {isNp ? "पूर्ण यात्रा हेर्नुहोस्" : "View Full Journey"}
                <ArrowRight size={20} />
              </Link>

              <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-60">
                <Image
                  src="/images/hammer-sickle.png"
                  alt="Party"
                  width={40}
                  height={25}
                  className="rounded"
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter max-w-[80px]">
                  {isNp ? "नेपाली कम्युनिष्ट पार्टी" : "Nepali Communist Party"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
