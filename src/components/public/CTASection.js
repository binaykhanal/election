"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Heart } from "lucide-react";

export function CTASection() {
  const locale = useLocale();
  const isNp = locale === "np";

  const labels = {
    heading: isNp
      ? "भक्तपुर-२ को विकासका लागि हामीसँग सामेल हुनुहोस्"
      : "Join Us for the Development of Bhaktapur-2",

    description: isNp
      ? "परिवर्तनको हिस्सा बन्नुहोस्। सँगै, हामी भक्तपुर-२ र नयाँ नेपालको समृद्ध निर्माण गर्न सक्छौं।"
      : "Be part of the transformation. Together, we can build a prosperous Bhaktapur-2 and a New Nepal.",
    joinBtn: isNp ? "आन्दोलनमा सामेल हुनुहोस्" : "Join the Movement",
    supportBtn: isNp ? "अभियानलाई समर्थन गर्नुहोस्" : "Support the Campaign",
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {labels.heading}
          </h2>
          <p className="text-xl text-gray-300 mb-10">{labels.description}</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-communist-red text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              {labels.joinBtn}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {labels.supportBtn}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
