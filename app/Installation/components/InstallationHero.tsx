'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { getInstallationCopy } from '@/lib/installationCopy'

export default function InstallationHero() {
  const { language } = useLanguage()
  const copy = getInstallationCopy(language)

  return (
    <>
      <h1 className="relative mb-3 pb-2 text-center text-[1.8rem] font-extrabold uppercase tracking-[1px] text-gray-dark-text shadow-text sm:mb-8 sm:pb-4 sm:text-4xl sm:tracking-[2px] md:text-5xl md:tracking-[3px] lg:text-6xl">
        {copy.title}
        <span className="absolute bottom-0 left-1/2 h-1 w-[60px] -translate-x-1/2 transform bg-gradient-to-r from-transparent via-gray-dark-textMuted to-transparent animate-pulse-width sm:w-[80px] md:w-[100px]"></span>
      </h1>

      <p className="mx-auto mb-4 max-w-[320px] text-center text-[13px] leading-6 text-gray-dark-textSecondary sm:mb-8 sm:max-w-4xl sm:text-lg md:text-xl">
        {copy.subtitle}
      </p>

      <div className="mx-auto mb-6 max-w-5xl sm:mb-12">
        <div className="rounded-[22px] border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-800/55 to-red-950/45 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:rounded-[28px] sm:px-8 sm:py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-xl text-blue-400 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.25)] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl">
              🔧
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="mb-2 max-w-[260px] text-[1.15rem] font-bold leading-tight text-white sm:mb-3 sm:max-w-none sm:text-3xl">
                {copy.sectionTitle}
              </h2>
              <p className="max-w-4xl text-[13px] leading-6 text-gray-200/90 sm:text-lg sm:leading-relaxed">
                {copy.intro}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] sm:mt-5 sm:gap-2 sm:text-sm">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-blue-300 sm:px-3 sm:py-1">
                  Kvalita provedeni
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-gray-200 sm:px-3 sm:py-1">
                  Spolehlivost
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-gray-200 sm:px-3 sm:py-1">
                  Rekonstrukce
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-gray-200 sm:px-3 sm:py-1">
                  Realizace na klic
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
