"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ContactForm } from "@/components/public/ContactForm";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isNp = locale === "np";
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          const settingsObj = data.reduce((acc, item) => {
            acc[item.key] = {
              en: item.valueEn || "",
              np: item.valueNp || item.valueEn || "",
            };
            return acc;
          }, {});
          setSettings(settingsObj);
        }
      } catch (err) {
        console.error("Failed to load contact settings", err);
      }
    }
    fetchSettings();
  }, []);

  const getVal = (key, defaultVal = "") => {
    return settings[key]?.[locale] || settings[key]?.en || defaultVal;
  };

  return (
    <div className="min-h-screen bg-[#fffafa] relative overflow-hidden selection:bg-red-100">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-20 -left-20 opacity-[0.07] rotate-12 blur-[1px]">
          <Image
            src="/images/hammer-sickle.png"
            alt=""
            width={500}
            height={500}
            priority
          />
        </div>
        <div className="absolute -bottom-20 -right-20 opacity-[0.07] -rotate-12 blur-[1px]">
          <Image src="/images/star.png" alt="" width={400} height={400} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10 mt-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
            {t("title")
              .split(" ")
              .map((word, i) => (
                <span
                  key={i}
                  className={
                    i === t("title").split(" ").length - 1 ? "text-red-600" : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            {t("subtitle")}
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-1 w-12 bg-red-600 rounded-full"></div>
            <Image
              src="/images/hammer-sickle.png"
              alt="Hammer Sickle"
              width={35}
              height={35}
            />
            <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto relative">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2 md:p-10 border border-white hover:border-red-100 transition-all duration-500 relative">
              <div className="absolute top-2 right-2 px-4 py-2 rounded-full mb-6 shadow-sm">
                <Image
                  src="/images/star.png"
                  alt="Star"
                  width={18}
                  height={18}
                  className="animate-pulse"
                />
              </div>

              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                  <Image
                    src="/images/star.png"
                    alt=""
                    width={20}
                    height={20}
                    className="brightness-200"
                  />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">
                  {isNp ? "प्रत्यक्ष जानकारी" : "Direct Info"}
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: MapPin,
                    label: isNp ? "ठेगाना" : "Address",
                    value: getVal("officeAddress", "Bhaktapur-2, Nepal"),
                  },
                  {
                    icon: Phone,
                    label: isNp ? "फोन" : "Phone",
                    value: getVal("phoneNumber", "+977-XXXXXXXXXX"),
                  },
                  {
                    icon: Mail,
                    label: isNp ? "इमेल" : "Email",
                    value: getVal(
                      "contactEmail",
                      "contact@ramprasadsapkota.com",
                    ),
                  },
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-start gap-5">
                    <div className="bg-gray-50 p-4 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <item.icon className="w-6 h-6 shrink-0" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {item.label}
                      </h3>
                      <p className="text-gray-900 font-bold text-lg leading-tight group-hover:text-red-600 transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white overflow-hidden relative">
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-bold text-sm tracking-tight uppercase">
                    {isNp
                      ? "दृष्टिकोणलाई समर्थन गर्नुहोस्"
                      : "Support the Vision"}
                  </span>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </div>
                <Image
                  src="/images/hammer-sickle.png"
                  alt=""
                  width={80}
                  height={80}
                  className="absolute -right-4 -bottom-4 opacity-20 rotate-12"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-gray-50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-red-400 to-red-600" />

              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
                  {isNp ? "सन्देश पठाउनुहोस्" : "Send a Message"}
                </h2>
                <div className="h-1 w-12 bg-red-600 rounded-full"></div>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
