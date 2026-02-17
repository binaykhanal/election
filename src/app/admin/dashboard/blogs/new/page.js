"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";
import ImageGalleryModal from "@/components/public/ImageGalleryModal";
import { useToast } from "@/components/ui/ToastProvider";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const { default: ImageResize } =
      await import("quill-image-resize-module-react");

    const Quill = RQ.Quill;
    // Only register if not already registered to prevent errors on re-renders
    if (!Quill.imports["modules/imageResize"]) {
      Quill.register("modules/imageResize", ImageResize);
    }

    return RQ;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-50 animate-pulse rounded-lg border" />
    ),
  },
);

export default function NewBlogPage() {
  const quillRef = useRef(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("en");
  const [showGallery, setShowGallery] = useState(false);

  const [formData, setFormData] = useState({
    titleEn: "",
    titleNp: "",
    slug: "",
    excerptEn: "",
    excerptNp: "",
    contentEn: "",
    contentNp: "",
    featuredImage: "",
    published: false,
  });

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.url) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", data.url);
        }
      } catch (error) {
        showToast("Upload Error", "Failed to upload image to editor", "error");
      }
    };
  };

  const modules = useMemo(() => {
    if (typeof window === "undefined") return {};

    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize"],
      },
    };
  }, []);

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();

    if (!formData.titleEn || !formData.titleNp) {
      showToast("Missing Titles", "Both titles are required.", "error");
      return;
    }

    if (publish && !formData.featuredImage) {
      showToast(
        "Image Required",
        "Please select a featured image before publishing.",
        "error",
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        published: publish,
        slug: formData.slug || generateSlug(formData.titleEn),
        publishedAt: publish ? new Date().toISOString() : null,
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        showToast(
          publish ? "Post Published!" : "Draft Saved!",
          publish
            ? "Your blog post is now live for the public."
            : "The draft has been stored successfully.",
          "success",
        );

        setTimeout(() => {
          router.push("/admin/dashboard/blogs");
          router.refresh();
        }, 1000);
      } else {
        showToast(
          "Save Error",
          result.error || "An unexpected error occurred while saving.",
          "error",
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      showToast(
        "Network Error",
        "Please check your internet connection and try again.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/blogs"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSaving}
            className="bg-white border px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isSaving && activeTab === "draft" && (
              <Loader2 className="animate-spin w-4 h-4" />
            )}
            Save Draft
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSaving}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isSaving && <Loader2 className="animate-spin w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex border-b mb-6 bg-gray-50 rounded-t-lg p-1">
            <button
              onClick={() => setActiveTab("en")}
              className={`flex-1 py-2 rounded-md transition-all ${activeTab === "en" ? "bg-white shadow-sm text-red-600 font-bold" : "text-gray-500"}`}
            >
              English Content
            </button>
            <button
              onClick={() => setActiveTab("np")}
              className={`flex-1 py-2 rounded-md transition-all ${activeTab === "np" ? "bg-white shadow-sm text-red-600 font-bold" : "text-gray-500"}`}
            >
              नेपाली सामग्री
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            {activeTab === "en" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    English Title
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg text-xl font-bold mt-1"
                    placeholder="e.g. New Road Project in Bhaktapur"
                    value={formData.titleEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        titleEn: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    English Excerpt
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg mt-1"
                    rows={3}
                    placeholder="Short summary for the card..."
                    value={formData.excerptEn}
                    onChange={(e) =>
                      setFormData({ ...formData, excerptEn: e.target.value })
                    }
                  />
                </div>
                <div className="pb-10">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Full Content (EN)
                  </label>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={
                      activeTab === "en"
                        ? formData.contentEn
                        : formData.contentNp
                    }
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        [activeTab === "en" ? "contentEn" : "contentNp"]: val,
                      })
                    }
                    modules={modules}
                    className="h-80"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    नेपाली शीर्षक
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg text-xl font-bold mt-1"
                    placeholder="शीर्षक यहाँ लेख्नुहोस्..."
                    value={formData.titleNp}
                    onChange={(e) =>
                      setFormData({ ...formData, titleNp: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    नेपाली सारांश
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg mt-1"
                    rows={3}
                    placeholder="छोटो सारांश..."
                    value={formData.excerptNp}
                    onChange={(e) =>
                      setFormData({ ...formData, excerptNp: e.target.value })
                    }
                  />
                </div>
                <div className="pb-10">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    पूर्ण सामग्री (NP)
                  </label>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={
                      activeTab === "en"
                        ? formData.contentEn
                        : formData.contentNp
                    }
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        [activeTab === "en" ? "contentEn" : "contentNp"]: val,
                      })
                    }
                    modules={modules}
                    className="h-80"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              Featured Image
            </label>
            <div
              onClick={() => setShowGallery(true)}
              className="aspect-video border-2 border-dashed rounded-lg cursor-pointer overflow-hidden flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
            >
              {formData.featuredImage ? (
                <img
                  src={formData.featuredImage}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <>
                  <ImageIcon className="text-gray-400 w-8 h-8 mb-2" />
                  <span className="text-sm text-gray-500">Select Image</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              URL Slug
            </label>
            <input
              className="w-full p-2 border rounded bg-gray-50 text-sm text-gray-600"
              value={formData.slug}
              readOnly
            />
            <p className="text-[10px] text-gray-400 mt-2">
              Generated automatically from English title.
            </p>
          </div>
        </div>
      </div>

      {showGallery && (
        <ImageGalleryModal
          onClose={() => setShowGallery(false)}
          onSelect={(url) => setFormData({ ...formData, featuredImage: url })}
        />
      )}
    </div>
  );
}
