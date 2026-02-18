import { notFound } from "next/navigation";
import { Blog } from "@/models"; // Mongoose Blog model
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import ViewCounter from "@/components/blog/ViewCounter";

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  const isNp = locale === "np";

  const blog = await Blog.findOne({ slug, published: true }).lean();
  if (!blog) notFound();

  const title = isNp ? blog.titleNp : blog.titleEn;
  const content = isNp ? blog.contentNp : blog.contentEn;
  const formattedDate = format(
    new Date(blog.publishedAt || blog.createdAt),
    "MMMM d, yyyy",
  );
  return (
    <div className="min-h-screen bg-white my-10">
      <ViewCounter blogId={blog._id.toString()} />
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href={`/${locale}/blogs`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isNp ? "सबै ब्लगहरू" : "Back to all blogs"}
        </Link>

        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={title}
            className="w-full h-[300px] md:h-[450px] object-cover rounded-2xl mb-10 shadow-lg"
          />
        )}

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#454545] mb-6 leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-gray-500 border-b pb-6">
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {formattedDate}
            </span>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Eye className="w-4 h-4 text-gray-400" />
              <span>
                {blog.views || 0} {isNp ? "पटक हेरिएको" : "views"}
              </span>
            </div>
          </div>
        </header>

        <div
          className="ck-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}
