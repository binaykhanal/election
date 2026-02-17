"use client";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  Star,
} from "lucide-react";
import Image from "next/image";

export function ExperienceContent({
  politicalExperience = [],
  socialWork = [],
  education = [],
}) {
  return (
    <div className="space-y-32">
      {politicalExperience?.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-16 justify-center">
            <div className="h-px w-12 bg-red-600" />
            <h2 className=" text-lg md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
              Leadership Timeline
            </h2>
            <div className="h-px w-12 bg-red-600" />
          </div>

          <div className="relative ">
            <div className="absolute left-4 md:left-1/2 h-full w-0.5 border-l-2 border-dashed border-red-200 -translate-x-1/2" />

            {politicalExperience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative mb-20 flex flex-col md:flex-row items-center w-full ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="absolute left-4 md:left-1/2 w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-xl -translate-x-1/2 z-20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>

                <div
                  className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                  }`}
                >
                  <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden hover:border-red-200 transition-all duration-300 group">
                    {exp.image && (
                      <div className="relative w-full h-56 overflow-hidden">
                        <img
                          src={exp.image}
                          alt={exp.role}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}
                    <div className="p-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest">
                          {exp.period}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1 leading-tight group-hover:text-red-600 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-gray-500 font-bold text-sm uppercase tracking-tight mb-6">
                        {exp.organization}
                      </p>
                      <div
                        className="text-gray-600 text-[15px] leading-relaxed prose prose-sm prose-red max-w-none"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {socialWork?.length > 0 && (
        <div className="bg-red-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Users className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h2 className=" text-2xl  md:text-4xl font-black mb-12 tracking-tighter uppercase italic text-center">
              Social Contributions
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {socialWork.map((work, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 flex flex-col"
                >
                  {work.image && (
                    <div className="w-full h-40 overflow-hidden border-b border-white/10">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-red-200 text-sm font-bold tracking-widest">
                      {work.year}
                    </span>
                    <h3 className="text-xl font-black mt-2 mb-4 uppercase tracking-tight">
                      {work.title}
                    </h3>
                    <div
                      className="text-white/80 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: work.description }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {education?.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden flex flex-col md:flex-row">
            <div className="bg-gray-900 p-12 text-white flex flex-col justify-center items-center md:w-1/3">
              <BookOpen className="w-16 h-16 mb-4 text-red-600" />
              <h2 className="text-2xl font-black tracking-tight text-center uppercase">
                Education
              </h2>
            </div>
            <div className="p-12 md:w-2/3 space-y-8 bg-[#fafafa]">
              {education.map((edu, idx) => (
                <div key={idx} className="flex gap-6 group items-center">
                  {edu.image ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md shrink-0">
                      <img
                        src={edu.image}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-red-600 transition-colors">
                      <Award className="w-6 h-6 text-red-600 group-hover:text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-500 font-medium">
                      {edu.university}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
