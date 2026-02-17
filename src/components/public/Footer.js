"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export function PublicFooter() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const navT = useTranslations("navigation");
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
        console.error("Footer fetch error:", err);
      }
    }
    fetchSettings();
  }, []);

  const getVal = (key, defaultVal = "") => {
    return settings[key]?.[locale] || settings[key]?.en || defaultVal;
  };

  const quickLinks = [
    { href: "/", label: navT("home") },
    { href: "/about", label: navT("about") },
    { href: "/vision", label: navT("vision") },
    { href: "/blogs", label: navT("blogs") },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              {getVal("siteTitle") ? (
                getVal("siteTitle")
              ) : (
                <>
                  Ram Prasad <span className="text-communist-red">Sapkota</span>
                </>
              )}
            </h3>
            <p className="text-gray-400 mb-4">{t("tagline")}</p>
            <div className="flex gap-4">
              <a
                href={settings.facebookUrl?.en || "#"}
                target="_blank"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-communist-red transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={settings.twitterUrl?.en || "#"}
                target="_blank"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-communist-red transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-communist-red transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings.youtubeUrl?.en || "#"}
                target="_blank"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-communist-red transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("contact")}</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>{getVal("officeAddress", "Bhaktapur-2, Nepal")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{getVal("phoneNumber", "+977-XXXXXXXXXX")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>
                  {getVal("contactEmail", "contact@ramprasadsapkota.com")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {getVal("siteTitle", "Ram Prasad Sapkota Campaign")}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
