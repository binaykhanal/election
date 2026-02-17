import { notFound } from "next/navigation";
import { Blog } from "@/models";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import ViewCounter from "@/components/blog/ViewCounter";

async function getBlog(slug) {
  const blog = await Blog.findOne({
    where: {
      slug: slug,
      published: true,
    },
  });
  return blog;
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const title = locale === "np" ? blog.titleNp : blog.titleEn;
  const content = locale === "np" ? blog.contentNp : blog.contentEn;

  return (
    <div className="min-h-screen bg-white my-10">
      <ViewCounter blogId={blog.id} />
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href={`/${locale}/blogs`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === "np" ? "सबै ब्लगहरू" : "Back to all blogs"}
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
              {blog.publishedAt
                ? format(new Date(blog.publishedAt), "MMMM d, yyyy")
                : format(new Date(blog.createdAt), "MMMM d, yyyy")}
            </span>

            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Eye className="w-4 h-4 text-gray-400" />
              <span>
                {blog.views || 0} {locale === "np" ? "पटक हेरिएको" : "views"}
              </span>
            </div>
          </div>
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}
