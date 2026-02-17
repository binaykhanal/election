'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Heart } from 'lucide-react'

export function CTASection() {
  const t = useTranslations('common')
  const locale = useLocale()

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join the Movement for Change
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Be part of the transformation. Together, we can build a prosperous Bhaktapur-2 and a New Nepal.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-communist-red text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              {t('joinMovement')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {t('supportCampaign')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
