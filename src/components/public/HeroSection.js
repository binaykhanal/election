"use client";
import { useState, useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HeroSection({ data }) {
  const locale = useLocale();
  const isNp = locale === "np" || locale === "ne";
  const [isStamped, setIsStamped] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  const content = useMemo(() => {
    if (!data) return null;
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (e) {
      return null;
    }
  }, [data]);

  useEffect(() => {
    // Target date now comes from backend or defaults to March 5, 2026
    const electionDate = content?.election_date || "2026-03-05T07:00:00";
    const targetDate = new Date(electionDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) return clearInterval(interval);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [content?.election_date]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsStamped(true);
      setTimeout(() => setIsStamped(false), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toNP = (n) => {
    const npDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return n
      .toString()
      .padStart(2, "0")
      .split("")
      .map((d) => npDigits[d] || d)
      .join("");
  };

  if (!content) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070101] font-sans pt-20 md:pt-0">
      <div className="hidden md:flex absolute top-8 right-8 z-30 flex-col items-end">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl flex gap-4 items-center">
          <Clock className="text-red-500 w-5 h-5 animate-pulse shrink-0" />
          <div className="flex gap-3">
            {[
              {
                label: "D",
                np: "दिन",
                val: timeLeft.days,
                valNp: toNP(timeLeft.days),
              },
              {
                label: "H",
                np: "घण्टा",
                val: timeLeft.hours,
                valNp: toNP(timeLeft.hours),
              },
              {
                label: "M",
                np: "मिनेट",
                val: timeLeft.mins,
                valNp: toNP(timeLeft.mins),
              },
              {
                label: "S",
                np: "सेकेन्ड",
                val: timeLeft.secs,
                valNp: toNP(timeLeft.secs),
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-white tabular-nums">
                    {item.val}
                  </span>
                  <span className="text-xs font-bold text-red-500/80">
                    {item.valNp}
                  </span>
                </div>
                <span className="text-[8px] font-bold text-white/40 uppercase">
                  {item.label} • {item.np}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[9px] font-black text-red-600 uppercase tracking-[0.2em] mr-2">
          {content.countdown_label ||
            (isNp ? "निर्वाचन बाँकी समय" : "Days Until Election")}
        </p>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_#7f1d1d_0%,_#070101_100%)]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute top-[10%] left-0 md:left-[25%] w-full max-w-4xl mix-blend-screen grayscale brightness-150 px-10 md:px-0"
        >
          <img
            src={content.bg_symbol || "/images/hammer-sickle.png"}
            alt="Party Symbol"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 z-10 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <motion.div
            className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-full mb-6 md:mb-10 shadow-2xl">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,1)]" />
              <span className="text-[9px] md:text-[11px] font-black tracking-[0.1em] text-white uppercase">
                {content.party_name ||
                  (isNp
                    ? "नेपाली कम्युनिष्ट पार्टी"
                    : "Nepali Communist Party")}
              </span>
            </div>

            <h1 className="text-5xl md:text-[110px] font-black tracking-[-0.06em] text-white leading-tight mb-6">
              <span className="block bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                {content.name}
              </span>
              <span className="block text-2xl md:text-5xl text-yellow-500 italic mt-2 tracking-wide">
                ({content.nickname})
              </span>
            </h1>

            <p className="text-base md:text-xl text-white/50 max-w-2xl mx-auto lg:mx-0 mb-10 border-l-2 border-red-600/40 pl-4 italic">
              {content.description}
            </p>

            <Link
              href={`/${locale}/vision`}
              className="group inline-flex items-center gap-4 bg-red-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-red-500 transition-all shadow-xl"
            >
              {content.cta_text || (isNp ? "हाम्रो लक्ष्य" : "OUR VISION")}
              <ArrowRight className="group-hover:translate-x-2 transition-transform w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            className="lg:col-span-5 relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative group mx-auto max-w-[320px] sm:max-w-[400px] lg:max-w-[450px]">
              <div className="relative z-10 aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={content.image || "/images/dipsikha.jpeg"}
                  alt={content.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-5 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-5">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg md:rounded-xl p-1 md:p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={content.election_symbol || "/images/star.png"}
                      alt="Symbol"
                      className="w-full h-full object-contain"
                    />
                    <AnimatePresence>
                      {isStamped && (
                        <motion.div
                          initial={{ scale: 4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-blue-900/95 flex items-center justify-center"
                        >
                          <span className="text-white text-3xl md:text-5xl font-black">
                            卍
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-sm md:text-xl uppercase tracking-tight truncate max-w-[150px] md:max-w-none">
                      {content.name}
                    </h3>
                    <p className="text-white/60 text-[9px] md:text-[11px] font-bold uppercase tracking-widest truncate">
                      {content.candidate_title ||
                        (isNp
                          ? "उम्मेदवार • भक्तपुर-२"
                          : "CANDIDATE • BHAKTAPUR-2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
