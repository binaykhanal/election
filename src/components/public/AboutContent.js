"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Award, Zap } from "lucide-react";

export function AboutContent({ dataMap, locale }) {
  const safeParse = (key, fallback) => {
    const raw = dataMap?.[key]?.[locale];
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  };

  const meta = safeParse("about_header", {});
  const bioIntro = dataMap?.bio_intro?.[locale] || "";
  const journey = dataMap?.political_journey?.[locale] || "";
  const achievements = dataMap?.achievements?.[locale] || "";
  const coreValues = safeParse("core_values", []);

  return (
    <div className="space-y-16 md:space-y-24">
      {bioIntro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-red-900/5 border border-red-50"
        >
          <div
            className="prose prose-lg max-w-none text-center break-words whitespace-normal overflow-hidden"
            dangerouslySetInnerHTML={{ __html: bioIntro }}
          />
        </motion.div>
      )}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-2 lg:order-1"
        >
          <div className="flex items-center gap-3 mb-6">
            <Image src="/images/star.png" alt="" width={24} height={24} />
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
              {locale === "np" ? "राजनीतिक यात्रा" : "Political Journey"}
            </h2>
          </div>
          <div
            className="prose prose-red text-gray-700 max-w-none text-lg leading-relaxed
            prose-li:marker:text-red-600 prose-p:mb-4 about-bio"
            dangerouslySetInnerHTML={{ __html: journey }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative order-1 lg:order-2 mx-4 md:mx-0"
        >
          <div className="absolute -inset-4 bg-red-600 rounded-3xl opacity-10 rotate-3" />
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-[12px] border-white">
            <img
              src={meta.image || "/images/candidate-about.jpg"}
              alt="Candidate"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              onError={(e) => {
                e.target.src = "/images/candidate-about.jpg";
              }}
            />
          </div>
        </motion.div>
      </div>

      {coreValues.length > 0 && (
        <div>
          <h2 className="text-center text-3xl md:text-4xl font-semibold mb-6 ">
            {locale === "np" ? "हाम्रो मुख्य मान्यता" : "Our Core Value"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((val, i) => (
              <div
                key={i}
                className="group bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center border border-white shadow-lg hover:shadow-red-200 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-red-200">
                  <Image
                    src="/images/star.png"
                    alt=""
                    width={30}
                    height={30}
                    className="brightness-200"
                  />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                  {val.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-700 to-red-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl shadow-red-900/40 group">
        <Image
          src="/images/hammer-sickle.png"
          alt=""
          width={200}
          height={200}
          className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000"
        />

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10 text-center">
            <Award className="w-12 h-12 mb-4 text-red-200" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">
              {locale === "np" ? "प्रमुख उपलब्धिहरू" : "Key Achievements"}
            </h2>
            <div className="h-1.5 w-24 bg-red-400 mt-4 rounded-full" />
          </div>

          <div
            className="prose prose-invert max-w-none 
              prose-ul:grid prose-ul:md:grid-cols-2 prose-ul:gap-x-12 prose-ul:list-none prose-ul:pl-0
              prose-li:bg-white/10 prose-li:p-4 prose-li:rounded-2xl prose-li:border prose-li:border-white/10
              prose-li:grid  prose-li:items-center prose-li:before:content-['★'] prose-li:before:mr-3 prose-li:before:text-red-300"
            dangerouslySetInnerHTML={{ __html: achievements }}
          />
        </div>
      </div>
    </div>
  );
}
