"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { locales } from "@/lib/i18n/config";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const isNp = locale === "np" || locale === "ne";
  const t = useTranslations("navigation");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-03-05T07:00:00").getTime();
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
  }, []);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/vision", label: t("vision") },
    { href: "/experience", label: t("experience") },
    { href: "/blogs", label: t("blogs") },
    { href: "/contact", label: t("contact") },
  ];

  const switchLocale = (newLocale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <header className="fixed top-3 md:top-6 inset-x-0 z-[100] flex justify-center px-4">
      <nav className="flex items-center gap-2 md:gap-4 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-gray-300/50 dark:border-white/20 px-3 md:px-4 py-2 rounded-full shadow-2xl transition-all duration-300">
        <div className="flex lg:hidden items-center gap-2 pr-2 border-r border-gray-300 dark:border-white/10">
          <Clock className="text-red-600 w-3 h-3 animate-pulse" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[7px] font-black uppercase text-red-600 dark:text-red-500 whitespace-nowrap tracking-tighter">
              {isNp ? "निर्वाचन बाँकी समय" : "Days until election"}
            </span>
            <div className="flex gap-0.5 text-[10px] font-black tabular-nums dark:text-white">
              <span>
                {timeLeft.days}
                {isNp ? "दि" : "d"}
              </span>
              <span className="text-red-600">:</span>
              <span>
                {timeLeft.hours}
                {isNp ? "घ" : "h"}
              </span>
              <span className="text-red-600">:</span>
              <span>
                {timeLeft.mins}
                {isNp ? "मि" : "m"}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === `/${locale}${link.href}` ||
              (link.href === "/" && pathname === `/${locale}`);
            return (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`px-4 py-2 text-[11px] font-black tracking-[0.1em] uppercase transition-all rounded-full ${
                  isActive
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`text-[10px] font-black uppercase px-2 py-1.5 rounded-full transition-all ${
                  l === locale
                    ? "bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-white/40"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            className="lg:hidden p-1.5 text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 rounded-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white dark:bg-black z-[110] flex flex-col items-center  p-8 lg:hidden"
          >
            <button
              className="absolute top-8 right-8 text-gray-900 dark:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-8 mt-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
