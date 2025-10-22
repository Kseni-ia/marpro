'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'cs' | 'ru'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.containers': 'Containers',
    'nav.excavators': 'Excavators',
    'nav.constructions': 'Constructions',
    'nav.home': 'Select a section to explore our services',
    
    // Containers
    'containers.title': 'Containers',
    'containers.explore': 'Explore our container solutions',
    'containers.subtitle': 'Choose from our most popular container sizes. Designed to match your project needs and delivered quickly.',
    'containers.order': 'Order container',
    'containers.3m3.desc': 'Compact container suitable for light waste, wood, small rubble, soil and similar materials.',
    'containers.5m3.desc': 'Medium container ideal for general construction waste, renovation materials and bulk debris.',
    'containers.7m3.desc': 'Medium container ideal for general construction waste, renovation materials and bulk debris.',
    'containers.9m3.desc': 'Large container perfect for extensive cleanup, demolition projects and high-volume waste.',
    'containers.price': 'Price from',
    'containers.vat': 'excl. VAT',
    
    // Excavators
    'excavators.title': 'Excavators',
    'excavators.discover': 'Discover our excavator services',
    'excavators.subtitle': 'Professional excavators for all your construction and earthmoving needs. High-quality equipment with experienced operators available.',
    'excavators.order': 'Order excavator',
    'excavators.mini': 'Mini Excavator',
    'excavators.standard': 'Standard Excavator',
    'excavators.large': 'Large Excavator',
    'excavators.tb145.desc': 'Compact and versatile mini excavator perfect for tight spaces, landscaping, and small construction projects.',
    'excavators.tb157.desc': 'Compact mini excavator ideal for digging, trenching, and light demolition work in confined areas.',
    'excavators.tb260.desc': 'Mid-size excavator suitable for general construction, foundation work, and material handling.',
    'excavators.tb285.desc': 'Mid-size excavator with extended reach, perfect for deeper excavations and utility installations.',
    'excavators.tb2150.desc': 'Heavy-duty excavator designed for large-scale projects, quarrying, and major earthmoving operations.',
    'excavators.tb2150r.desc': 'Large demolition excavator with enhanced reach and power for demanding industrial applications.',
    'excavators.price.day': 'day',
    
    // Constructions
    'constructions.title': 'Constructions',
    'constructions.view': 'View our construction projects',
    'constructions.demolishing': 'Demolishing',
    'constructions.demolishing.desc': 'Professional demolition and dismantling services',
    'constructions.building': 'Building',
    'constructions.building.desc': 'Construction and building services',
    'constructions.order': 'Order construction',
    
    // Demolishing page
    'demolishing.title': 'Demolishing & Demolition Works',
    'demolishing.subtitle': 'Professional demolition services with modern equipment and experienced team',
    'demolishing.types': 'Types of Demolition',
    'demolishing.complete': 'Complete Demolition',
    'demolishing.complete.desc': 'Full building demolition including foundations',
    'demolishing.partial': 'Partial Demolition',
    'demolishing.partial.desc': 'Selective demolition of specific building parts',
    'demolishing.interior': 'Interior Demolition',
    'demolishing.interior.desc': 'Removal of interior structures and finishes',
    'demolishing.concrete': 'Concrete Demolition',
    'demolishing.concrete.desc': 'Breaking and removal of concrete structures',
    'demolishing.industrial': 'Industrial Demolition',
    'demolishing.industrial.desc': 'Dismantling of industrial facilities and equipment',
    'demolishing.emergency': 'Emergency Demolition',
    'demolishing.emergency.desc': '24/7 emergency demolition services',
    'demolishing.features': 'Our Features',
    'demolishing.safety': 'Safety First',
    'demolishing.safety.desc': 'Strict safety protocols and certified personnel',
    'demolishing.eco': 'Eco-Friendly',
    'demolishing.eco.desc': 'Waste sorting and recycling of materials',
    'demolishing.equipment': 'Modern Equipment',
    'demolishing.equipment.desc': 'Latest demolition machinery and tools',
    'demolishing.order': 'Request Demolition Quote',
    
    // Building page
    'building.title': 'Building & Construction',
    'building.coming': 'Coming Soon',
    'building.desc': 'We are currently developing our building and construction services.',
    'building.check': 'Please check back soon for more information.',
    
    // Common
    'common.back': 'Back',
    'common.more': 'Learn More',
    
    // Order Form
    'order.title': 'Order Service',
    'order.firstName': 'First Name',
    'order.lastName': 'Last Name',
    'order.email': 'Email',
    'order.phone': 'Phone',
    'order.address': 'Service Address',
    'order.city': 'City',
    'order.zip': 'ZIP',
    'order.country': 'Country',
    'order.selectCountry': 'Select Country',
    'order.containerType': 'Container Type',
    'order.excavatorType': 'Excavator Type',
    'order.constructionType': 'Construction Type',
    'order.dateNeeded': 'Date Needed',
    'order.startTime': 'Start Time',
    'order.endTime': 'End Time',
    'order.additionalInfo': 'Additional Information (Optional)',
    'order.additionalInfoPlaceholder': 'Please provide any additional details about your order, special requirements, or delivery instructions...',
    'order.endTimeError': '⚠ End time must be after start time',
    'order.cancel': 'Cancel',
    'order.submit': 'Submit Order',
    'order.submitting': 'Submitting...',
    'order.success': 'Order submitted successfully!',
    'order.error': 'Failed to submit order. Please try again.',
    
    // Container options
    'order.container.3m3': '3m³ Container (2 x 0.5 x 3.8 m)',
    'order.container.5m3': '5m³ Container (2 x 0.7 x 3.8 m)',
    
    // Excavator options
    'order.excavator.tb145': 'TB145 - Mini Excavator (1.5t, 0.04m³ bucket)',
    'order.excavator.tb290-1': 'TB290-1 - Compact Excavator (2.9t, 0.09m³ bucket)',
    'order.excavator.tb290-2': 'TB290-2 - Heavy Excavator (2.9t, 0.11m³ bucket)',
    
    // Construction options
    'order.construction.general': 'General Construction',
    'order.construction.earthworks': 'Earthworks',
    'order.construction.foundation': 'Foundation Work',
    'order.construction.demolition': 'Demolition',
    
    // Countries
    'order.country.czechRepublic': 'Czech Republic',
    'order.country.slovakia': 'Slovakia',
    'order.country.germany': 'Germany',
    'order.country.poland': 'Poland',
    'order.country.austria': 'Austria',
    
    // Work With Us
    'work.buttonText': 'Join Our Growing Team!',
    'work.formTitle': 'We\'re Hiring!',
    'work.subtitle': 'We are actively expanding our team and welcome talented professionals to grow with us',
    'work.firstName': 'First Name',
    'work.lastName': 'Last Name',
    'work.email': 'Email',
    'work.phone': 'Phone',
    'work.expertise': 'Your Expertise',
    'work.experience': 'Years of Experience',
    'work.message': 'Tell us about yourself',
    'work.submit': 'Send Application',
    'work.cancel': 'Cancel',
    'work.sending': 'Sending...',
    'work.success': 'Application sent successfully!',
    'work.error': 'Failed to send application. Please try again.',
    'work.expertise.demolition': 'Demolition',
    'work.expertise.construction': 'Construction',
    'work.expertise.operator': 'Equipment Operator',
    'work.expertise.safety': 'Safety Specialist',
    'work.expertise.management': 'Project Management',
    'work.expertise.other': 'Other',
  },
  cs: {
    // Navigation
    'nav.containers': 'Kontejnery',
    'nav.excavators': 'Bagry',
    'nav.constructions': 'Stavby',
    'nav.home': 'Vyberte sekci pro prozkoumání našich služeb',
    
    // Containers
    'containers.title': 'Kontejnery',
    'containers.explore': 'Prozkoumejte naše kontejnerová řešení',
    'containers.subtitle': 'Vyberte si z našich nejoblíbenějších velikostí kontejnerů. Navrženo podle vašich potřeb a dodáno rychle.',
    'containers.order': 'Objednat kontejner',
    'containers.3m3.desc': 'Kompaktní kontejner vhodný pro lehký odpad, dřevo, drobnou suť, zeminu a podobné materiály.',
    'containers.5m3.desc': 'Střední kontejner ideální pro stavební odpad, renovační materiály a objemný odpad.',
    'containers.7m3.desc': 'Střední kontejner ideální pro stavební odpad, renovační materiály a objemný odpad.',
    'containers.9m3.desc': 'Velký kontejner perfektní pro rozsáhlý úklid, demoliční projekty a velkoobjemový odpad.',
    'containers.price': 'Cena od',
    'containers.vat': 'bez DPH',
    
    // Excavators
    'excavators.title': 'Bagry',
    'excavators.discover': 'Objevte naše služby bagrů',
    'excavators.subtitle': 'Profesionální bagry pro všechny vaše stavební a zemní práce. Kvalitní vybavení se zkušenými operátory.',
    'excavators.order': 'Objednat bagr',
    'excavators.mini': 'Mini bagr',
    'excavators.standard': 'Standardní bagr',
    'excavators.large': 'Velký bagr',
    'excavators.tb145.desc': 'Kompaktní a všestranný mini bagr ideální pro stísněné prostory, terénní úpravy a malé stavební projekty.',
    'excavators.tb157.desc': 'Kompaktní mini bagr ideální pro kopání, výkopy a lehké demoliční práce ve stísněných prostorách.',
    'excavators.tb260.desc': 'Středně velký bagr vhodný pro obecné stavební práce, základové práce a manipulaci s materiálem.',
    'excavators.tb285.desc': 'Středně velký bagr s prodlouženým dosahem, ideální pro hlubší výkopy a instalace inženýrských sítí.',
    'excavators.tb2150.desc': 'Těžký bagr určený pro velké projekty, těžbu a rozsáhlé zemní práce.',
    'excavators.tb2150r.desc': 'Velký demoliční bagr se zvýšeným dosahem a výkonem pro náročné průmyslové aplikace.',
    'excavators.price.day': 'den',
    
    // Constructions
    'constructions.title': 'Stavby',
    'constructions.view': 'Zobrazit naše stavební projekty',
    'constructions.demolishing': 'Demolice',
    'constructions.demolishing.desc': 'Profesionální demoliční a bouracích práce',
    'constructions.building': 'Výstavba',
    'constructions.building.desc': 'Stavební a konstrukční služby',
    'constructions.order': 'Objednat stavbu',
    
    // Demolishing page
    'demolishing.title': 'Demolice a demoliční práce',
    'demolishing.subtitle': 'Profesionální demoliční služby s moderním vybavením a zkušeným týmem',
    'demolishing.types': 'Typy demolic',
    'demolishing.complete': 'Kompletní demolice',
    'demolishing.complete.desc': 'Úplná demolice budov včetně základů',
    'demolishing.partial': 'Částečná demolice',
    'demolishing.partial.desc': 'Selektivní demolice konkrétních částí budov',
    'demolishing.interior': 'Interiérová demolice',
    'demolishing.interior.desc': 'Odstranění vnitřních konstrukcí a povrchů',
    'demolishing.concrete': 'Demolice betonu',
    'demolishing.concrete.desc': 'Bourání a odstraňování betonových konstrukcí',
    'demolishing.industrial': 'Průmyslová demolice',
    'demolishing.industrial.desc': 'Demontáž průmyslových zařízení a vybavení',
    'demolishing.emergency': 'Havarijní demolice',
    'demolishing.emergency.desc': '24/7 havarijní demoliční služby',
    'demolishing.features': 'Naše výhody',
    'demolishing.safety': 'Bezpečnost na prvním místě',
    'demolishing.safety.desc': 'Přísné bezpečnostní protokoly a certifikovaný personál',
    'demolishing.eco': 'Ekologicky šetrné',
    'demolishing.eco.desc': 'Třídění odpadu a recyklace materiálů',
    'demolishing.equipment': 'Moderní vybavení',
    'demolishing.equipment.desc': 'Nejnovější demoliční stroje a nástroje',
    'demolishing.order': 'Požádat o cenovou nabídku demolice',
    
    // Building page
    'building.title': 'Výstavba a konstrukce',
    'building.coming': 'Připravujeme',
    'building.desc': 'Momentálně pracujeme na našich stavebních a konstrukčních službách.',
    'building.check': 'Brzy zde najdete více informací.',
    
    // Common
    'common.back': 'Zpět',
    'common.more': 'Zjistit více',
    
    // Order Form
    'order.title': 'Objednat službu',
    'order.firstName': 'Jméno',
    'order.lastName': 'Příjmení',
    'order.email': 'Email',
    'order.phone': 'Telefon',
    'order.address': 'Adresa služby',
    'order.city': 'Město',
    'order.zip': 'PSČ',
    'order.country': 'Země',
    'order.selectCountry': 'Vyberte zemi',
    'order.containerType': 'Typ kontejneru',
    'order.excavatorType': 'Typ bagru',
    'order.constructionType': 'Typ stavby',
    'order.dateNeeded': 'Požadované datum',
    'order.startTime': 'Čas začátku',
    'order.endTime': 'Čas konce',
    'order.additionalInfo': 'Dodatečné informace (volitelné)',
    'order.additionalInfoPlaceholder': 'Uveďte prosím jakékoli další podrobnosti o vaší objednávce, speciální požadavky nebo pokyny pro doručení...',
    'order.endTimeError': '⚠ Čas konce musí být po času začátku',
    'order.cancel': 'Zrušit',
    'order.submit': 'Odeslat objednávku',
    'order.submitting': 'Odesílání...',
    'order.success': 'Objednávka byla úspěšně odeslána!',
    'order.error': 'Nepodařilo se odeslat objednávku. Zkuste to prosím znovu.',
    
    // Container options
    'order.container.3m3': '3m³ kontejner (2 x 0,5 x 3,8 m)',
    'order.container.5m3': '5m³ kontejner (2 x 0,7 x 3,8 m)',
    
    // Excavator options
    'order.excavator.tb145': 'TB145 - Mini bagr (1,5t, 0,04m³ lžíce)',
    'order.excavator.tb290-1': 'TB290-1 - Kompaktní bagr (2,9t, 0,09m³ lžíce)',
    'order.excavator.tb290-2': 'TB290-2 - Těžký bagr (2,9t, 0,11m³ lžíce)',
    
    // Construction options
    'order.construction.general': 'Obecné stavebnictví',
    'order.construction.earthworks': 'Zemní práce',
    'order.construction.foundation': 'Základové práce',
    'order.construction.demolition': 'Demolice',
    
    // Countries
    'order.country.czechRepublic': 'Česká republika',
    'order.country.slovakia': 'Slovensko',
    'order.country.germany': 'Německo',
    'order.country.poland': 'Polsko',
    'order.country.austria': 'Rakousko',
    
    // Work With Us
    'work.buttonText': 'Připojte se k našemu rostoucímu týmu!',
    'work.formTitle': 'Hledáme nové kolegy!',
    'work.subtitle': 'Aktivně rozšiřujeme náš tým a vítáme talentované odborníky, kteří s námi porostou',
    'work.firstName': 'Jméno',
    'work.lastName': 'Příjmení',
    'work.email': 'Email',
    'work.phone': 'Telefon',
    'work.expertise': 'Vaše odbornost',
    'work.experience': 'Roky zkušeností',
    'work.message': 'Řekněte nám o sobě',
    'work.submit': 'Odeslat žádost',
    'work.cancel': 'Zrušit',
    'work.sending': 'Odesílání...',
    'work.success': 'Žádost byla úspěšně odeslána!',
    'work.error': 'Nepodařilo se odeslat žádost. Zkuste to prosím znovu.',
    'work.expertise.demolition': 'Demolice',
    'work.expertise.construction': 'Stavebnictví',
    'work.expertise.operator': 'Obsluha strojů',
    'work.expertise.safety': 'Bezpečnostní specialista',
    'work.expertise.management': 'Projektový management',
    'work.expertise.other': 'Jiné',
  },
  ru: {
    // Navigation
    'nav.containers': 'Контейнеры',
    'nav.excavators': 'Экскаваторы',
    'nav.constructions': 'Строительство',
    'nav.home': 'Выберите раздел для изучения наших услуг',
    
    // Containers
    'containers.title': 'Контейнеры',
    'containers.explore': 'Изучите наши контейнерные решения',
    'containers.subtitle': 'Выберите из наших самых популярных размеров контейнеров. Разработано в соответствии с потребностями вашего проекта и быстро доставлено.',
    'containers.order': 'Заказать контейнер',
    'containers.3m3.desc': 'Компактный контейнер, подходящий для легких отходов, дерева, мелкого щебня, грунта и подобных материалов.',
    'containers.5m3.desc': 'Средний контейнер, идеальный для общих строительных отходов, материалов для ремонта и объемного мусора.',
    'containers.7m3.desc': 'Средний контейнер, идеальный для общих строительных отходов, материалов для ремонта и объемного мусора.',
    'containers.9m3.desc': 'Большой контейнер, идеальный для обширной уборки, проектов сноса и больших объемов отходов.',
    'containers.price': 'Цена от',
    'containers.vat': 'без НДС',
    
    // Excavators
    'excavators.title': 'Экскаваторы',
    'excavators.discover': 'Откройте для себя наши услуги экскаваторов',
    'excavators.subtitle': 'Профессиональные экскаваторы для всех ваших строительных и земляных работ. Качественное оборудование с опытными операторами.',
    'excavators.order': 'Заказать экскаватор',
    'excavators.mini': 'Мини-экскаватор',
    'excavators.standard': 'Стандартный экскаватор',
    'excavators.large': 'Большой экскаватор',
    'excavators.tb145.desc': 'Компактный и универсальный мини-экскаватор, идеальный для тесных пространств, ландшафтного дизайна и небольших строительных проектов.',
    'excavators.tb157.desc': 'Компактный мини-экскаватор, идеальный для копания, рытья траншей и легких демонтажных работ в ограниченных пространствах.',
    'excavators.tb260.desc': 'Средний экскаватор, подходящий для общих строительных работ, фундаментных работ и обработки материалов.',
    'excavators.tb285.desc': 'Средний экскаватор с увеличенным радиусом действия, идеальный для более глубоких раскопок и установки коммунальных услуг.',
    'excavators.tb2150.desc': 'Тяжелый экскаватор, предназначенный для крупномасштабных проектов, карьерных работ и крупных земляных работ.',
    'excavators.tb2150r.desc': 'Большой демонтажный экскаватор с увеличенным радиусом действия и мощностью для требовательных промышленных применений.',
    'excavators.price.day': 'день',
    
    // Constructions
    'constructions.title': 'Строительство',
    'constructions.view': 'Посмотреть наши строительные проекты',
    'constructions.demolishing': 'Снос',
    'constructions.demolishing.desc': 'Профессиональные услуги по сносу и демонтажу',
    'constructions.building': 'Строительство',
    'constructions.building.desc': 'Строительные и конструкционные услуги',
    'constructions.order': 'Заказать строительство',
    
    // Demolishing page
    'demolishing.title': 'Снос и демонтажные работы',
    'demolishing.subtitle': 'Профессиональные услуги по сносу с современным оборудованием и опытной командой',
    'demolishing.types': 'Типы сноса',
    'demolishing.complete': 'Полный снос',
    'demolishing.complete.desc': 'Полный снос зданий включая фундаменты',
    'demolishing.partial': 'Частичный снос',
    'demolishing.partial.desc': 'Селективный снос конкретных частей зданий',
    'demolishing.interior': 'Внутренний снос',
    'demolishing.interior.desc': 'Удаление внутренних конструкций и отделки',
    'demolishing.concrete': 'Снос бетона',
    'demolishing.concrete.desc': 'Разрушение и удаление бетонных конструкций',
    'demolishing.industrial': 'Промышленный снос',
    'demolishing.industrial.desc': 'Демонтаж промышленных объектов и оборудования',
    'demolishing.emergency': 'Аварийный снос',
    'demolishing.emergency.desc': 'Круглосуточные аварийные услуги по сносу',
    'demolishing.features': 'Наши преимущества',
    'demolishing.safety': 'Безопасность прежде всего',
    'demolishing.safety.desc': 'Строгие протоколы безопасности и сертифицированный персонал',
    'demolishing.eco': 'Экологически чистый',
    'demolishing.eco.desc': 'Сортировка отходов и переработка материалов',
    'demolishing.equipment': 'Современное оборудование',
    'demolishing.equipment.desc': 'Новейшие машины и инструменты для сноса',
    'demolishing.order': 'Запросить расценки на снос',
    
    // Building page
    'building.title': 'Строительство и конструкции',
    'building.coming': 'Скоро',
    'building.desc': 'В настоящее время мы разрабатываем наши строительные и конструкционные услуги.',
    'building.check': 'Пожалуйста, вернитесь позже для получения дополнительной информации.',
    
    // Common
    'common.back': 'Назад',
    'common.more': 'Узнать больше',
    
    // Order Form
    'order.title': 'Заказать услугу',
    'order.firstName': 'Имя',
    'order.lastName': 'Фамилия',
    'order.email': 'Email',
    'order.phone': 'Телефон',
    'order.address': 'Адрес услуги',
    'order.city': 'Город',
    'order.zip': 'Почтовый индекс',
    'order.country': 'Страна',
    'order.selectCountry': 'Выберите страну',
    'order.containerType': 'Тип контейнера',
    'order.excavatorType': 'Тип экскаватора',
    'order.constructionType': 'Тип строительства',
    'order.dateNeeded': 'Требуемая дата',
    'order.startTime': 'Время начала',
    'order.endTime': 'Время окончания',
    'order.additionalInfo': 'Дополнительная информация (необязательно)',
    'order.additionalInfoPlaceholder': 'Пожалуйста, предоставьте любые дополнительные детали о вашем заказе, особые требования или инструкции по доставке...',
    'order.endTimeError': '⚠ Время окончания должно быть после времени начала',
    'order.cancel': 'Отмена',
    'order.submit': 'Отправить заказ',
    'order.submitting': 'Отправка...',
    'order.success': 'Заказ успешно отправлен!',
    'order.error': 'Не удалось отправить заказ. Пожалуйста, попробуйте еще раз.',
    
    // Container options
    'order.container.3m3': '3м³ контейнер (2 x 0,5 x 3,8 м)',
    'order.container.5m3': '5м³ контейнер (2 x 0,7 x 3,8 м)',
    
    // Excavator options
    'order.excavator.tb145': 'TB145 - Мини-экскаватор (1,5т, 0,04м³ ковш)',
    'order.excavator.tb290-1': 'TB290-1 - Компактный экскаватор (2,9т, 0,09м³ ковш)',
    'order.excavator.tb290-2': 'TB290-2 - Тяжелый экскаватор (2,9т, 0,11м³ ковш)',
    
    // Construction options
    'order.construction.general': 'Общее строительство',
    'order.construction.earthworks': 'Земляные работы',
    'order.construction.foundation': 'Фундаментные работы',
    'order.construction.demolition': 'Снос',
    
    // Countries
    'order.country.czechRepublic': 'Чешская Республика',
    'order.country.slovakia': 'Словакия',
    'order.country.germany': 'Германия',
    'order.country.poland': 'Польша',
    'order.country.austria': 'Австрия',
    
    // Work With Us
    'work.buttonText': 'Присоединяйтесь к нашей растущей команде!',
    'work.formTitle': 'Мы нанимаем!',
    'work.subtitle': 'Мы активно расширяем нашу команду и приглашаем талантливых специалистов расти вместе с нами',
    'work.firstName': 'Имя',
    'work.lastName': 'Фамилия',
    'work.email': 'Email',
    'work.phone': 'Телефон',
    'work.expertise': 'Ваша специализация',
    'work.experience': 'Годы опыта',
    'work.message': 'Расскажите нам о себе',
    'work.submit': 'Отправить заявку',
    'work.cancel': 'Отмена',
    'work.sending': 'Отправка...',
    'work.success': 'Заявка успешно отправлена!',
    'work.error': 'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз.',
    'work.expertise.demolition': 'Снос',
    'work.expertise.construction': 'Строительство',
    'work.expertise.operator': 'Оператор техники',
    'work.expertise.safety': 'Специалист по безопасности',
    'work.expertise.management': 'Управление проектами',
    'work.expertise.other': 'Другое',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load saved language or detect from browser
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) {
      setLanguageState(savedLang)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('cs')) {
        setLanguageState('cs')
      } else if (browserLang.startsWith('ru')) {
        setLanguageState('ru')
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
