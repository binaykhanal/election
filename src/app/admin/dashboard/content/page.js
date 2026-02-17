"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Save,
  Loader2,
  FileText,
  Target,
  Home,
  ChevronRight,
  Image as ImageIcon,
  Globe,
  Languages,
  CheckSquare,
  Users,
} from "lucide-react";
import ImageGalleryModal from "@/components/public/ImageGalleryModal";
import VisionPageEditor from "./VisionPageEditor";
import ExperienceEditor from "./ExperienceEditor";
import { useToast } from "@/components/ui/ToastProvider";

const ICONS = {
  graduation: dynamic(() =>
    import("lucide-react").then((mod) => mod.GraduationCap),
  ),
  heart: dynamic(() => import("lucide-react").then((mod) => mod.Heart)),
  road: dynamic(() => import("react-icons/fa").then((mod) => mod.FaRoad)),
  briefcase: dynamic(() => import("lucide-react").then((mod) => mod.Briefcase)),
  leaf: dynamic(() => import("lucide-react").then((mod) => mod.Sprout)),
  mountain: dynamic(() => import("lucide-react").then((mod) => mod.Mountain)),
  map: dynamic(() => import("lucide-react").then((mod) => mod.Globe)),
  default: dynamic(() => import("lucide-react").then((mod) => mod.CheckSquare)),
};

const extractImagesFromHTML = (html) => {
  if (!html) return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const imgs = div.querySelectorAll("img");
  return Array.from(imgs).map((img) => img.getAttribute("src"));
};
const CkEditor = dynamic(() => import("@/components/editor/CkEditor"), {
  ssr: false,
});

// const ReactQuill = dynamic(() => import("react-quill-new"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-64 bg-gray-50 animate-pulse rounded-lg border" />
//   ),
// });

const HERO_FIELDS = [
  { id: "tagline", label: "Tagline", labelNp: "ट्यागलाइन" },
  { id: "name", label: "Candidate Name", labelNp: "उम्मेदवारको नाम" },
  { id: "nickname", label: "Nickname", labelNp: "उपनाम" },
  { id: "title", label: "Title", labelNp: "पद" },
  { id: "party", label: "Party Name", labelNp: "पार्टीको नाम" },
  { id: "description", label: "Description", labelNp: "विवरण" },
  { id: "image", label: "Hero Image", labelNp: "मुख्य फोटो", type: "IMAGE" },
];

const ABOUT_META_FIELDS = [
  { id: "title", label: "Page Title", labelNp: "पृष्ठ शीर्षक" },
  { id: "subtitle", label: "Subtitle", labelNp: "उपशीर्षक" },
  {
    id: "image",
    label: "Profile Image",
    labelNp: "प्रोफाइल फोटो",
    type: "IMAGE",
  },
];

const VISION_FIELDS = [
  { id: "title", label: "Section Title", labelNp: "शीर्षक" },
  { id: "subtitle", label: "Subtitle", labelNp: "उपशीर्षक" },
  {
    id: "education_desc",
    label: "Education Description",
    labelNp: "शिक्षा विवरण",
  },
  {
    id: "health_desc",
    label: "Healthcare Description",
    labelNp: "स्वास्थ्य विवरण",
  },
  {
    id: "infra_desc",
    label: "Infrastructure Description",
    labelNp: "पूर्वाधार विवरण",
  },
  { id: "job_desc", label: "Employment Description", labelNp: "रोजगारी विवरण" },
  { id: "agri_desc", label: "Agriculture Description", labelNp: "कृषि विवरण" },
  { id: "tour_desc", label: "Tourism Description", labelNp: "पर्यटन विवरण" },
];

const SITE_MAP = {
  home: {
    label: "Home Page",
    icon: <Home className="w-4 h-4" />,
    sections: [
      { key: "hero", label: "Hero Section", type: "HERO" },
      { key: "stats", label: "Statistics", type: "STATS" },
      { key: "vision_preview", label: "Vision Preview", type: "VISION" },
    ],
  },
  about: {
    label: "About Me",
    icon: <FileText className="w-4 h-4" />,
    sections: [
      { key: "about_header", label: "Header & Image", type: "ABOUT_META" },
      { key: "bio_intro", label: "Introduction", type: "RICH_TEXT" },
      {
        key: "political_journey",
        label: "Political Journey",
        type: "RICH_TEXT",
      },
      { key: "core_values", label: "Core Values", type: "JSON_LIST" },
      { key: "achievements", label: "Key Achievements", type: "RICH_TEXT" },
    ],
  },
  vision: {
    label: "Vision & Manifesto",
    icon: <Target className="w-4 h-4" />,
    sections: [
      {
        key: "vision_page",
        label: "Vision Page Builder",
        type: "VISION_BUILDER",
      },
    ],
  },
  experience: {
    label: "Experience Page",
    icon: <Users className="w-4 h-4" />,
    sections: [
      {
        key: "experience_page",
        label: "Experience Editor",
        type: "EXPERIENCE_EDITOR",
      },
    ],
  },
};

export default function ContentManagementPage() {
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState("home");
  const [activeTab, setActiveTab] = useState("hero");
  const [contentMap, setContentMap] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState(null);
  const [previousImages, setPreviousImages] = useState({});
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const root = quill.root;
    const handleClick = (e) => {
      if (e.target.tagName === "IMG") {
        const blot = quill.constructor.find(e.target);
        const index = quill.getIndex(blot);
        quill.setSelection(index, 1);
        root
          .querySelectorAll("img")
          .forEach((img) => img.classList.remove("ql-selected"));
        e.target.classList.add("ql-selected");
      }
    };
    root.addEventListener("click", handleClick);
    return () => root.removeEventListener("click", handleClick);
  }, [activeTab]);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/content?page=${activePage}`);
        const data = await res.json();
        const newMap = {};
        data.forEach((item) => {
          newMap[item.key] = { en: item.valueEn, np: item.valueNp };
        });
        setContentMap(newMap);
        if (SITE_MAP[activePage].sections.length > 0) {
          setActiveTab(SITE_MAP[activePage].sections[0].key);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, [activePage]);

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { list: "check" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ align: [] }],
          ["link", "image", "clean"],
        ],
        handlers: {
          image: function () {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();
            input.onchange = async () => {
              const file = input.files[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });
              const result = await res.json();
              if (result.url) {
                const quill = this.quill;
                quill.focus();
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, "image", result.url);
                quill.setSelection(range.index + 1);
              }
            };
          },
        },
      },
      keyboard: {
        bindings: {
          deleteImage: {
            key: "Backspace",
            handler: function (range) {
              if (!range) return true;
              const quill = this.quill;
              if (range.length === 1) {
                const [blot] = quill.getLeaf(range.index);
                if (blot?.domNode?.tagName === "IMG") {
                  const imageUrl = blot.domNode.getAttribute("src");
                  blot.remove();
                  fetch("/api/upload", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: imageUrl }),
                  });
                  return false;
                }
              }
              return true;
            },
          },
        },
      },
    }),
    [],
  );

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "indent",
    "align",
    "link",
    "image",
  ];

  const updateField = async (lang, value) => {
    const key = `${activeTab}_${lang}`;
    const oldContent = contentMap[activeTab]?.[lang] || "";
    const oldImages = extractImagesFromHTML(oldContent);
    const newImages = extractImagesFromHTML(value);
    const removedImages = oldImages.filter((img) => !newImages.includes(img));
    for (let img of removedImages) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: img }),
        });
      } catch (err) {
        console.error("Image delete failed:", err);
      }
    }
    setPreviousImages((prev) => ({ ...prev, [key]: newImages }));
    setContentMap((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [lang]: value },
    }));
  };

  const updateJsonValue = (lang, fieldId, val) => {
    let current = {};
    try {
      current = JSON.parse(contentMap[activeTab]?.[lang] || "{}");
    } catch (e) {
      current = {};
    }
    updateField(lang, JSON.stringify({ ...current, [fieldId]: val }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const config = SITE_MAP[activePage].sections.find(
      (s) => s.key === activeTab,
    );
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: activePage,
          key: activeTab,
          type: config.type,
          valueEn: contentMap[activeTab]?.en || "",
          valueNp: contentMap[activeTab]?.np || "",
        }),
      });
      showToast(
        "Changes Saved",
        `Successfully updated ${config.label}.`,
        "success",
      );
    } catch {
      showToast(
        "Save Failed",
        "There was a problem saving your changes. Please try again.",
        "error",
      );
    }
    setIsSaving(false);
  };

  const renderEditor = (lang) => {
    const rawValue = contentMap[activeTab]?.[lang] || "";
    const currentSection = SITE_MAP[activePage].sections.find(
      (s) => s.key === activeTab,
    );

    if (["HERO", "VISION", "ABOUT_META"].includes(currentSection?.type)) {
      let fields = HERO_FIELDS;
      if (currentSection.type === "VISION") fields = VISION_FIELDS;
      if (currentSection.type === "ABOUT_META") fields = ABOUT_META_FIELDS;
      let jsonData = {};
      try {
        if (rawValue.trim().startsWith("{")) jsonData = JSON.parse(rawValue);
      } catch (e) {
        jsonData = {};
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded border">
          {fields.map((f) => (
            <div key={f.id} className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                {lang === "np" ? f.labelNp : f.label}
              </label>
              {f.type === "IMAGE" ? (
                <div className="flex flex-col gap-3">
                  {jsonData[f.id] && (
                    <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden bg-white group">
                      <img
                        src={jsonData[f.id]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-[10px] text-white font-bold">
                          Current Image
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      className="flex-1 border p-2 rounded text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      value={jsonData[f.id] || ""}
                      placeholder="No image selected"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryTarget({ lang, id: f.id });
                        setShowGallery(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <ImageIcon className="w-3 h-3" />
                      {jsonData[f.id] ? "Change Image" : "Pick Image"}
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  className="border p-2 rounded text-sm outline-none focus:border-red-600 transition-colors bg-white"
                  value={jsonData[f.id] || ""}
                  onChange={(e) => updateJsonValue(lang, f.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    if (currentSection?.type === "VISION_BUILDER") {
      return (
        <VisionPageEditor
          value={rawValue ? JSON.parse(rawValue) : null}
          onChange={(val) => updateField(lang, JSON.stringify(val))}
        />
      );
    }

    if (currentSection?.type === "EXPERIENCE_EDITOR") {
      return (
        <ExperienceEditor
          value={rawValue ? JSON.parse(rawValue) : null}
          onChange={(val) => updateField(lang, JSON.stringify(val))}
        />
      );
    }

    if (
      currentSection?.type === "STATS" ||
      currentSection?.type === "JSON_LIST"
    ) {
      return (
        <textarea
          className="w-full h-40 font-mono text-xs border p-3 bg-gray-900 text-green-400 rounded outline-none focus:ring-1 focus:ring-red-600"
          value={rawValue}
          onChange={(e) => updateField(lang, e.target.value)}
          placeholder={
            currentSection.type === "STATS"
              ? '[{"value":"15+", "label":"Years"}]'
              : '[{"title": "Value", "desc": "Description"}]'
          }
        />
      );
    }

    return (
      <div className="bg-white">
        <CkEditor
          editorData={rawValue}
          handleEditorChange={(val) => updateField(lang, val)}
        />
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="p-10 flex gap-2 items-center text-gray-600">
        <Loader2 className="animate-spin" /> Loading Admin Panel...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-xl shadow-sm border w-fit">
        {Object.entries(SITE_MAP).map(([key, page]) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activePage === key ? "bg-gray-900 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
          >
            {page.icon} {page.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Page Sections
              </h2>
            </div>
            <div className="p-2 space-y-1">
              {SITE_MAP[activePage].sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveTab(s.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all ${activeTab === s.key ? "bg-red-50 text-red-700 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {s.label}{" "}
                  {activeTab === s.key && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">
              {
                SITE_MAP[activePage].sections.find((s) => s.key === activeTab)
                  ?.label
              }
            </h1>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-red-100"
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              Save Changes
            </button>
          </div>

          <div className="space-y-8 pb-20">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold text-xs tracking-widest uppercase">
                <Globe className="w-4 h-4" /> English Version
              </div>
              {renderEditor("en")}
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-red-600 font-bold text-xs tracking-widest uppercase">
                <Languages className="w-4 h-4" /> नेपाली संस्करण
              </div>
              {renderEditor("np")}
            </div>
          </div>
        </div>
      </div>

      {showGallery && (
        <ImageGalleryModal
          onClose={() => setShowGallery(false)}
          onSelect={(url) => {
            updateJsonValue(galleryTarget.lang, galleryTarget.id, url);
            setShowGallery(false);
          }}
        />
      )}
    </div>
  );
}
