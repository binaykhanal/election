"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Clock, Loader2, Calendar, ArrowUpRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicPrograms() {
  const t = useTranslations();
  const locale = useLocale();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const toNepaliNum = (num) => {
    if (!num) return "";
    const symbols = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return num
      .toString()
      .split("")
      .map((d) => symbols[d] || d)
      .join("");
  };

  const nepaliMonths = [
    "बैशाख",
    "जेठ",
    "असार",
    "साउन",
    "भदौ",
    "असोज",
    "कात्तिक",
    "मंसिर",
    "पुष",
    "माघ",
    "फागुन",
    "चैत",
  ];

  const getNepaliDate = (isoDate) => {
    const adDate = new Date(isoDate);
    if (isNaN(adDate)) return { day: "??", month: "??" };
    const refAd = new Date("2024-04-13");
    const diffDays = Math.floor(
      (adDate.getTime() - refAd.getTime()) / (1000 * 60 * 60 * 24),
    );
    let bsYear = 2081,
      bsMonth = 0,
      bsDay = 1 + diffDays;
    const monthDaysMap = {
      2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 30],
      2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    };
    while (bsDay > (monthDaysMap[bsYear]?.[bsMonth] || 30)) {
      bsDay -= monthDaysMap[bsYear][bsMonth];
      bsMonth++;
      if (bsMonth > 11) {
        bsMonth = 0;
        bsYear++;
      }
    }
    return { day: toNepaliNum(bsDay), month: nepaliMonths[bsMonth] };
  };

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/programs");
        const data = await res.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = data
          .filter((p) => new Date(p.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setPrograms(upcoming);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-red-600 w-8 h-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-12 px-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32"
        >
          <Image
            src="/images/hammer-sickle.png"
            alt=""
            width={500}
            height={500}
          />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 -right-24"
        >
          <Image src="/images/star.png" alt="" width={400} height={400} />
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="my-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6 justify-center"
          >
            {/* <div className="w-12 h-1 bg-red-600 rounded-full text-center" /> */}
            <span className="text-[11px] font-black  text-red-600 uppercase ">
              {locale === "np"
                ? "दैनिक कार्यक्रमहरू"
                : "Daily Campaign Schedule"}
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-[0.9]  uppercase text-center">
                {locale === "np" ? "आजका" : "Today's"} {""}
                <span className="text-red-600  decoration-slate-900 decoration-4 ">
                  {locale === "np" ? "कार्यक्रमहरू" : "Programs"}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/star.png"
                  alt="Star"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                  {t("hero.party")}
                </p>
                <p className="text-sm font-black text-slate-800 uppercase ">
                  {t("hero.name")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <AnimatePresence>
            {programs.length > 0 ? (
              programs.map((item, idx) => {
                const isNe = locale === "ne" || locale === "np";
                const neDate = getNepaliDate(item.date);
                const adDate = new Date(item.date);

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={item._id}
                    className="group relative flex items-center gap-6 bg-slate-50 hover:bg-white p-5 rounded-[2.5rem] border border-transparent hover:border-slate-100 hover:shadow-[0_20px_50px_-15px_rgba(220,38,38,0.12)] transition-all duration-500"
                  >
                    <div className="relative flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-slate-50 group-hover:border-red-200 transition-all">
                      <div className="absolute inset-0 opacity-[0.05] scale-75 group-hover:scale-110 group-hover:opacity-10 transition-all">
                        <Image
                          src="/images/star.png"
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-3xl font-black text-slate-900 leading-none relative z-10">
                        {isNe ? neDate.day : adDate.getDate()}
                      </span>
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter relative z-10">
                        {isNe
                          ? neDate.month
                          : adDate.toLocaleString("en", { month: "short" })}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src="/images/hammer-sickle.png"
                          alt=""
                          width={16}
                          height={16}
                          className="opacity-40 group-hover:opacity-100 transition-opacity"
                        />
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${item.status === "ONGOING" ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-red-600 transition-colors uppercase  tracking-tight">
                        {isNe ? item.titleNp : item.titleEn}
                      </h3>

                      <div className="flex flex-wrap gap-5 mt-3">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                          <MapPin size={14} className="text-red-600" />
                          {isNe
                            ? item.locationNp || item.locationEn
                            : item.locationEn}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                          <Clock size={14} className="text-red-600" />
                          {isNe ? item.timeNp : item.timeEn}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex pr-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                      <ArrowUpRight size={24} className="text-red-600" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                  {locale === "np"
                    ? "आज कुनै कार्यक्रम उपलब्ध छैन"
                    : "No programs scheduled for today"}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
