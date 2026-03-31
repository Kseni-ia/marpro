type SupportedLanguage = 'en' | 'cs' | 'ru'

const installationCopy = {
  en: {
    title: 'Plumbing Services',
    cardDescription: 'Complete plumbing and heating services',
    cta: 'Request Plumbing Quote',
    subtitle:
      'Complete plumbing and project delivery support for modern renovations and technical fit-outs',
    sectionTitle: 'Plumbing Services & Installations',
    intro:
      'We provide professional plumbing and project delivery services for residential, commercial, and industrial projects. We handle turnkey execution, renovations, technical installations, and coordination of follow-up work with a strong focus on workmanship, reliability, and long-term functionality.',
  },
  cs: {
    title: 'Instalatérské služby',
    cardDescription: 'Kompletní instalatérské a topné služby',
    cta: 'Poptat instalatérské služby',
    subtitle:
      'Kompletní instalatérský a realizační servis pro moderní rekonstrukce a technické instalace',
    sectionTitle: 'Instalatérské služby a realizace',
    intro:
      'Nabízíme profesionální instalatérské a realizační práce pro bytové, komerční i průmyslové projekty. Zajišťujeme realizaci na klíč, rekonstrukce, technické instalace i koordinaci navazujících činností s důrazem na kvalitu provedení, spolehlivost a dlouhodobou funkčnost.',
  },
  ru: {
    title: 'Сантехнические услуги',
    cardDescription: 'Полный комплекс сантехнических и отопительных услуг',
    cta: 'Запросить смету на сантехнические услуги',
    subtitle:
      'Полный комплекс сантехнических услуг и сопровождения реализации для современных реконструкций и технических монтажей',
    sectionTitle: 'Сантехнические услуги и реализация',
    intro:
      'Мы предоставляем профессиональные сантехнические услуги и сопровождение реализации для жилых, коммерческих и промышленных проектов. Обеспечиваем комплексное выполнение работ, реконструкции, технические монтажи и координацию последующих этапов с акцентом на качество, надежность и долгосрочную функциональность.',
  },
} as const

export function getInstallationCopy(language: SupportedLanguage) {
  return installationCopy[language] ?? installationCopy.cs
}
