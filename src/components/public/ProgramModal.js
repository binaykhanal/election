"use client";
import { useState, useEffect } from "react";
import { MapPin, Clock, X, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgramModal({
  isOpen,
  onClose,
  locale,
  toNepaliNum,
  getNepaliDate,
}) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  async function fetchPrograms(currentLimit) {
    try {
      const res = await fetch(`/api/programs?limit=${currentLimit}`);
      const data = await res.json();
      setPrograms(data);
      setHasMore(data.length === currentLimit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) fetchPrograms(limit);
  }, [isOpen, limit]);

  if (!isOpen) return null;

  const isNp = locale === "np" || locale === "ne";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
          <img
            src="/images/hammer-sickle.png"
            className="absolute top-20 right-2 w-20 h-20 rotate-12"
            alt=""
          />
          <img
            src="/images/star.png"
            className="absolute bottom-20 left-2 w-20 h-20 -rotate-12"
            alt=""
          />
        </div>

        <div className="relative p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              {isNp ? "दैनिक कार्यक्रमहरू" : "Campaign Schedule"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em]">
                {isNp ? "हाम्रो अभियान" : "Latest Updates"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative overflow-y-auto p-6 space-y-4 custom-scrollbar z-10">
          {loading && programs.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Fetching Data...
              </p>
            </div>
          ) : programs.length > 0 ? (
            <>
              {programs.map((item, idx) => {
                const neDate = getNepaliDate(item.date);
                const adDate = new Date(item.date);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item._id}
                    className="group flex items-center gap-5 bg-slate-50 hover:bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
                  >
                    <div className="w-16 h-16 shrink-0 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-red-100 transition-colors">
                      <span className="text-xl font-black text-slate-900 leading-none">
                        {isNp ? neDate.day : adDate.getDate()}
                      </span>
                      <span className="text-[9px] font-black text-red-600 uppercase">
                        {isNp
                          ? neDate.month
                          : adDate.toLocaleString("en", { month: "short" })}
                      </span>
                    </div>

                    <div className="flex-1 relative">
                      <h4 className="text-base font-bold text-slate-800 leading-tight mb-2 pr-8">
                        {isNp ? item.titleNp : item.titleEn}
                      </h4>
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                          <MapPin size={12} className="text-red-600" />
                          {isNp ? item.locationNp : item.locationEn}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                          <Clock size={12} className="text-red-600" />
                          {isNp ? item.timeNp : item.timeEn}
                        </div>
                      </div>

                      <motion.img
                        src="/images/star.png"
                        alt="star"
                        className="absolute top-0 right-0 w-5 h-5 object-contain"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [0.9, 1.1, 0.9],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}

              {hasMore && (
                <button
                  onClick={() => setLimit((prev) => prev + 10)}
                  className="w-full py-5 text-[9px] font-black text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-2xl transition-all  tracking-[0.2em] border border-dashed border-slate-200 mt-2"
                >
                  {isNp
                    ? "थप कार्यक्रमहरू देखाउनुहोस्"
                    : "Show More Activities"}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                {isNp ? "आज कुनै कार्यक्रम छैन" : "No programs scheduled"}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
