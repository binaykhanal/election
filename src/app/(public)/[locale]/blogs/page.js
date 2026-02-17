import { useTranslations } from 'next-intl'
import { BlogsList } from '@/components/public/BlogsList'

export default function BlogsPage() {
  const t = useTranslations('blogs')

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>
        <BlogsList />
      </div>
    </div>
  )
}
