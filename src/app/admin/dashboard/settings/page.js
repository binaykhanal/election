"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Check,
  User,
  Lock,
  Globe,
  Share2,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("site");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [settings, setSettings] = useState({
    siteTitle: { en: "", np: "" },
    contactEmail: { en: "", np: "" },
    phoneNumber: { en: "", np: "" },
    officeAddress: { en: "", np: "" },
    facebookUrl: { en: "", np: "" },
    twitterUrl: { en: "", np: "" },
    youtubeUrl: { en: "", np: "" },
    instagramUrl: { en: "", np: "" },
    tiktokUrl: { en: "", np: "" },
  });

  useEffect(() => {
    const loadSettings = async () => {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const updatedSettings = { ...settings };
        data.forEach((item) => {
          if (updatedSettings[item.key]) {
            updatedSettings[item.key] = {
              en: item.valueEn || "",
              np: item.valueNp || "",
            };
          }
        });
        setSettings(updatedSettings);
      }
    };
    loadSettings();
  }, []);

  const handleUpdate = (key, lang, val) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: val },
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    const payload = Object.keys(settings).map((key) => ({
      key,
      valueEn: settings[key].en,
      valueNp: settings[key].np,
      type: key.includes("Url") ? "SOCIAL" : "SETTINGS",
    }));

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      if (res.ok) {
        setShowSuccess(true);
        showToast(
          "Settings Updated",
          "General site settings have been saved successfully.",
          "success",
        );
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast(
        "Update Failed",
        "Failed to save settings. Please check your connection.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">General Settings</h2>
          <p className="text-gray-500">
            Manage site identity, contact info, and social links.
          </p>
        </div>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="bg-red-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : showSuccess ? (
            <Check size={20} />
          ) : (
            <Save size={20} />
          )}
          {isSaving ? "Saving..." : showSuccess ? "Saved!" : "Save All Changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="flex border-b bg-gray-50/50">
          {[
            { id: "site", label: "Identity", icon: Globe },
            { id: "contact", label: "Contact & Address", icon: Phone },
            { id: "social", label: "Social Media", icon: Share2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "bg-white text-red-600 border-red-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-10 max-w-2xl mx-auto">
          {activeTab === "site" && (
            <div className="space-y-4">
              <SettingInput
                label="Site Title"
                k="siteTitle"
                val={settings.siteTitle}
                onUpd={handleUpdate}
              />
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-8">
              <SettingInput
                label="Official Email"
                k="contactEmail"
                val={settings.contactEmail}
                onUpd={handleUpdate}
              />
              <SettingInput
                label="Phone Number"
                k="phoneNumber"
                val={settings.phoneNumber}
                onUpd={handleUpdate}
              />
              <SettingTextArea
                label="Office Address"
                k="officeAddress"
                val={settings.officeAddress}
                onUpd={handleUpdate}
              />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-8">
              <SettingInput
                label="Facebook Page URL"
                k="facebookUrl"
                val={settings.facebookUrl}
                onUpd={handleUpdate}
              />
              <SettingInput
                label="Twitter (X) URL"
                k="twitterUrl"
                val={settings.twitterUrl}
                onUpd={handleUpdate}
              />
              <SettingInput
                label="Instagram Page URL"
                k="instagramUrl"
                val={settings.instagramUrl}
                onUpd={handleUpdate}
              />
              <SettingInput
                label="YouTube Channel URL"
                k="youtubeUrl"
                val={settings.youtubeUrl}
                onUpd={handleUpdate}
              />
              <SettingInput
                label="TikTok Profile URL"
                k="tiktokUrl"
                val={settings.tiktokUrl}
                onUpd={handleUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingInput({ label, k, val, onUpd }) {
  const [lang, setLang] = useState("en");

  return (
    <div className="flex flex-col space-y-2 pb-6 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {label}
        </label>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              lang === "en"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("np")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              lang === "np"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            NP
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all ${
            lang === "np" ? "font-nepali text-lg" : "text-base"
          }`}
          placeholder={
            lang === "en" ? `Enter ${label}...` : `${label} लेख्नुहोस्...`
          }
          value={lang === "en" ? val.en : val.np}
          onChange={(e) => onUpd(k, lang, e.target.value)}
        />
        <div className="absolute right-3 top-3 opacity-20 pointer-events-none">
          {lang === "en" ? (
            <Globe size={16} />
          ) : (
            <span className="font-bold">अ</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingTextArea({ label, k, val, onUpd }) {
  const [lang, setLang] = useState("en");

  return (
    <div className="flex flex-col space-y-2 pb-6 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {label}
        </label>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-xs font-bold rounded-md ${
              lang === "en"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("np")}
            className={`px-3 py-1 text-xs font-bold rounded-md ${
              lang === "np"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            NP
          </button>
        </div>
      </div>

      <textarea
        rows={3}
        className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all ${
          lang === "np" ? "font-nepali text-lg" : "text-base"
        }`}
        value={lang === "en" ? val.en : val.np}
        onChange={(e) => onUpd(k, lang, e.target.value)}
      />
    </div>
  );
}
