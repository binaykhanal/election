"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Languages,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ImageGalleryModal from "@/components/public/ImageGalleryModal";
import { useToast } from "@/components/ui/ToastProvider";

const CkEditor = dynamic(() => import("@/components/editor/CkEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-50 animate-pulse rounded-lg border" />
  ),
});

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        showToast("Error", "Could not load the blog post data.", "error");
        router.push("/admin/dashboard/blogs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSubmit = async (e, publish = formData.published) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const isStatusChange = formData.published !== publish;

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published: publish,
          updatedAt: new Date(),
        }),
      });

      if (res.ok) {
        if (isStatusChange) {
          showToast(
            publish ? "Post Published" : "Post Unpublished",
            publish
              ? "Your post is now visible to the public."
              : "Post has been moved to drafts.",
            "success",
          );
        } else {
          showToast(
            "Update Successful",
            "The blog post has been updated.",
            "success",
          );
        }

        router.push("/admin/dashboard/blogs");
        router.refresh();
      } else {
        showToast(
          "Update Failed",
          "Server returned an error while saving.",
          "error",
        );
      }
    } catch (error) {
      console.error("Save Error:", error);
      showToast(
        "Network Error",
        "Check your connection and try again.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-communist-red" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/blogs"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
            <p className="text-sm text-gray-500 italic">ID: {id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={(e) => handleSubmit(e)}
            disabled={isSaving}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{" "}
            {isSaving ? "Saving..." : "Update Post"}
          </button>

          <button
            onClick={(e) => handleSubmit(e, !formData.published)}
            disabled={isSaving}
            className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
              formData.published
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-communist-red text-white hover:bg-communist-darkred"
            }`}
          >
            <Eye className="w-4 h-4" />
            {formData.published ? "Unpublish" : "Publish Now"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("en")}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === "en"
                  ? "border-b-2 border-communist-red text-communist-red"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Globe className="w-4 h-4" /> English
            </button>
            <button
              onClick={() => setActiveTab("np")}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === "np"
                  ? "border-b-2 border-communist-red text-communist-red"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Languages className="w-4 h-4" /> नेपाली
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {activeTab === "en" ? "English Title" : "नेपाली शीर्षक"}
              </label>
              <input
                type="text"
                value={activeTab === "en" ? formData.titleEn : formData.titleNp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [activeTab === "en" ? "titleEn" : "titleNp"]:
                      e.target.value,
                    ...(activeTab === "en"
                      ? { slug: generateSlug(e.target.value) }
                      : {}),
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {activeTab === "en" ? "English Excerpt" : "नेपाली सारांश"}
              </label>
              <textarea
                value={
                  activeTab === "en" ? formData.excerptEn : formData.excerptNp
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [activeTab === "en" ? "excerptEn" : "excerptNp"]:
                      e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {activeTab === "en" ? "Content (EN)" : "सामग्री (NP)"}
              </label>
              <CkEditor
                editorData={
                  activeTab === "en" ? formData.contentEn : formData.contentNp
                }
                handleEditorChange={(val) =>
                  setFormData({
                    ...formData,
                    [activeTab === "en" ? "contentEn" : "contentNp"]: val,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">
              Slug & SEO
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Featured Image
                </label>
                <div className="relative group rounded-lg overflow-hidden border">
                  <img
                    src={formData.featuredImage || "/placeholder-img.jpg"}
                    alt="Preview"
                    className="aspect-video object-cover w-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      type="button"
                      onClick={() => setShowGallery(true)}
                      className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-sm font-bold"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
