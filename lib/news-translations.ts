export interface NewsTranslation {
  title: string
  excerpt: string
  content: string
}

export interface NewsTranslations {
  ku: NewsTranslation
  fa: NewsTranslation
  en: NewsTranslation
}

export interface NewsItemBase {
  id: string
  slug: string
  date: string
  author: string
  category?: string
  image?: string
  video?: string
  audio?: string
  images?: string[]
  tags?: string[]
  translations: NewsTranslations
}

// News data with translations
export const newsDataWithTranslations: NewsItemBase[] = [
  {
    id: '9',
    slug: 'sample-instagram-style-post',
    date: '2025-11-05',
    author: 'دەستەی دەستکاریکردن',
    category: 'social',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1080&h=1350&fit=crop',
    tags: ['sample', 'instagram', 'aspect-4-5'],
    translations: {
      ku: {
        title: 'نمونە پۆستێکی شێوازێکی ئینستاگرام (4:5)',
        excerpt: 'ئەم پۆستە بۆ تاقیکردنەوەی قەبارەی 4:5 لە لیستەکانی هەواڵەکان سازکراوە.',
        content: `ئەمە تەنها پۆستێکی نمونەیە بۆ ئەوەی دڵنیابین کە وێنەکان بە شێوەی 4:5 (1080x1350) لە لیستەکە وەکوو ئینستاگرام نمایش دەکرێن. دەتوانی ئەم دانەیە بسڕیتەوە یان بگۆڕیت بەپێی پێویستت.`,
      },
      fa: {
        title: 'نمونه پست با سبک اینستاگرام (4:5)',
        excerpt: 'این پست برای تست اندازه 4:5 در لیست خبرها تنظیم شده است.',
        content: `این یک پست نمونه است تا مطمئن شویم تصاویر با نسبت 4:5 (1080x1350) در لیست مانند اینستاگرام نمایش داده می‌شوند. می‌توانید این مورد را حذف یا مطابق نیاز ویرایش کنید.`,
      },
      en: {
        title: 'Sample Instagram-style Post (4:5)',
        excerpt: 'This post is configured to test 4:5 sizing in the news list.',
        content: `This is a sample post to verify that images with a 4:5 ratio (1080x1350) render like Instagram in the list. You can delete or edit this entry as needed.`,
      },
    },
  },
  {
    id: '1',
    slug: 'arrest-of-jafer-sadeqi',
    date: '2025-10-13',
    author: 'نووسەر',
    category: 'politics',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    tags: ['اشنویه', 'جعفر صادقی', 'کوهنوردی'],
    translations: {
      ku: {
        title: 'دەستگیرکردن و گواستنەوەی جەعفەر صادقی کەشتیوانی کورد بۆ زیندان',
        excerpt: 'روز دوشنبه ۲۱ مهرماه ۱۴۰۴ برابر با (۱۳ اکتبر ۲۰۲۵)، "جعفر صادقی"، کوهنورد و مربی سنگ‌نوردی اهل اشنویه، پس از احضار به شعبه اجرای احکام دادگاه عمومی و انقلاب این شهر، بازداشت و جهت اجرای حکم حبس به زندان اشنویه منتقل شد.',
        content: `روز دوشنبه ۲۱ مهرماه ۱۴۰۴ برابر با (۱۳ اکتبر ۲۰۲۵)، "جعفر صادقی"، کوهنورد و مربی سنگ‌نوردی اهل اشنویه، پس از احضار به شعبه اجرای احکام دادگاه عمومی و انقلاب این شهر، بازداشت و جهت اجرای حکم حبس به زندان اشنویه منتقل شد.

بر پایه این گزارش، در تاریخ ۱۶ تیرماه ۱۴۰۴، دادگاه کیفری دو شعبه ۱۰۱ اشنویه این شهروند کُرد را به اتهام (تبلیغ علیه نظام) به ۱۰ ماه حبس تعزیری محکوم کرده بود.

همچنین، جعفر صادقی پیش‌تر نیز توسط نیروهای امنیتی بازداشت و پس از پایان مراحل بازجویی با تودیع قرار وثیقه به‌صورت موقت آزاد شده بود.

لازم به ذکر است، آقای صادقی از مربیان فعال رشته کوهنوردی و سنگ‌نوردی و از اعضای گروه کوهنوردی باران اشنویه است.`,
      },
      fa: {
        title: 'بازداشت و انتقال جعفر صادقی کوهنورد کُرد به زندان اشنویه',
        excerpt: 'روز دوشنبه ۲۱ مهرماه ۱۴۰۴ برابر با (۱۳ اکتبر ۲۰۲۵)، "جعفر صادقی"، کوهنورد و مربی سنگ‌نوردی اهل اشنویه، پس از احضار به شعبه اجرای احکام دادگاه عمومی و انقلاب این شهر، بازداشت و جهت اجرای حکم حبس به زندان اشنویه منتقل شد.',
        content: `روز دوشنبه ۲۱ مهرماه ۱۴۰۴ برابر با (۱۳ اکتبر ۲۰۲۵)، "جعفر صادقی"، کوهنورد و مربی سنگ‌نوردی اهل اشنویه، پس از احضار به شعبه اجرای احکام دادگاه عمومی و انقلاب این شهر، بازداشت و جهت اجرای حکم حبس به زندان اشنویه منتقل شد.

بر پایه این گزارش، در تاریخ ۱۶ تیرماه ۱۴۰۴، دادگاه کیفری دو شعبه ۱۰۱ اشنویه این شهروند کُرد را به اتهام (تبلیغ علیه نظام) به ۱۰ ماه حبس تعزیری محکوم کرده بود.

همچنین، جعفر صادقی پیش‌تر نیز توسط نیروهای امنیتی بازداشت و پس از پایان مراحل بازجویی با تودیع قرار وثیقه به‌صورت موقت آزاد شده بود.

لازم به ذکر است، آقای صادقی از مربیان فعال رشته کوهنوردی و سنگ‌نوردی و از اعضای گروه کوهنوردی باران اشنویه است.`,
      },
      en: {
        title: 'Arrest and Transfer of Jafer Sadeqi, Kurdish Mountaineer, to Ushnuyeh Prison',
        excerpt: 'On Monday, October 13, 2025, "Jafer Sadeqi", a mountaineer and rock climbing instructor from Ushnuyeh, was arrested and transferred to Ushnuyeh prison to serve his sentence after being summoned to the enforcement branch of the Revolutionary Court.',
        content: `On Monday, October 13, 2025, "Jafer Sadeqi", a mountaineer and rock climbing instructor from Ushnuyeh, was arrested and transferred to Ushnuyeh prison to serve his sentence after being summoned to the enforcement branch of the Revolutionary Court.

According to this report, on July 7, 2024, Criminal Court Branch 101 of Ushnuyeh had sentenced this Kurdish citizen to 10 months of imprisonment on charges of "propaganda against the regime".

Also, Jafer Sadeqi had previously been arrested by security forces and temporarily released on bail after completing interrogation procedures.

It should be noted that Mr. Sadeqi is one of the active instructors in mountaineering and rock climbing and a member of the Baran Ushnuyeh mountaineering group.`,
      },
    },
  },
  {
    id: '2',
    slug: 'health-care-workers-protest-kermanshah',
    date: '2025-11-03',
    author: 'نووسەری هەواڵ',
    category: 'social',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
    tags: ['کرمانشاه', 'کادر تەندروستی', 'کۆبوونەوە'],
    translations: {
      ku: {
        title: 'کۆبوونەوەی ناڕەزایی کادرەکانی تەندروستی کرمانشاه لە بەرامبەر زانکۆی زانستەکانی پزیشکی',
        excerpt: 'کادرەکانی تەندروستی کرمانشاه لە کۆبوونەوەیەکی ناڕەزایی لە بەرامبەر زانکۆی زانستەکانی پزیشکی بەشداریان کردووە بۆ دەستپێکردنی دەسەڵاتیان و چارەسەرکردنی کێشەکانیان.',
        content: `کادرەکانی تەندروستی کرمانشاه لە کۆبوونەوەیەکی ناڕەزایی لە بەرامبەر زانکۆی زانستەکانی پزیشکی بەشداریان کردووە. ئەم کۆبوونەوەیە بە مەبەستی دەستپێکردنی دەسەڵاتیان و چارەسەرکردنی کێشەکانیان ڕێکخراوە.

بەپێی ڕاپۆرتەکان، کادرەکانی تەندروستی بە دوای چارەسەرکردنی کێشەکانی کارکردن و پارەی دەستپێکردن دەگەڕێن. هەروەها داوایان کردووە کە دەسەڵاتیان دەستپێبکرێت و پێویستەکان بە باشترین شێوە دابین بکرێن.

کۆبوونەوەکە بەبێ هیچ کێشەیەک تێپەڕیوە و بەشداربووان داوایان کردووە کە کێشەکانیان بە خێرایی چارەسەر بکرێن.`,
      },
      fa: {
        title: 'تجمع اعتراضی کادر بهداشت کرمانشاه در مقابل دانشگاه علوم پزشکی',
        excerpt: 'کادر بهداشت کرمانشاه در تجمع اعتراضی در مقابل دانشگاه علوم پزشکی شرکت کردند تا خواسته‌های خود را مطرح کنند.',
        content: `کادر بهداشت کرمانشاه در تجمع اعتراضی در مقابل دانشگاه علوم پزشکی شرکت کردند. این تجمع به منظور طرح خواسته‌های آنها و حل مشکلاتشان برگزار شد.

بر اساس گزارش‌ها، کادر بهداشت به دنبال حل مشکلات کاری و دریافت حقوق خود هستند. همچنین خواستار آن شده‌اند که حقوقشان پرداخت شود و نیازهایشان به بهترین شکل تأمین شود.

تجمع بدون هیچ مشکلی برگزار شد و شرکت‌کنندگان خواستار آن شده‌اند که مشکلاتشان به سرعت حل شود.`,
      },
      en: {
        title: 'Protest Gathering of Health Workers in Kermanshah in Front of Medical University',
        excerpt: 'Health workers in Kermanshah participated in a protest gathering in front of the medical university to raise their demands and address their issues.',
        content: `Health workers in Kermanshah participated in a protest gathering in front of the medical university. This gathering was organized to raise their demands and address their issues.

According to reports, health workers are seeking to resolve work-related problems and receive their salaries. They have also demanded that their rights be paid and their needs be met in the best possible way.

The gathering was held without any problems and participants have demanded that their issues be resolved quickly.`,
      },
    },
  },
  {
    id: '3',
    slug: 'sports-football-tournament',
    date: '2025-11-02',
    author: 'نووسەری وەرزشی',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['تۆپی پێ', 'هەولێر', 'پاڵەوانیەتی'],
    translations: {
      ku: {
        title: 'پاڵەوانیەتی تۆپی پێ لە هەولێر بە سەرکەوتووی کۆتایی هات',
        excerpt: 'پاڵەوانیەتی تۆپی پێی ناوخۆی کوردستان لە شاری هەولێر بە سەرکەوتووی کۆتایی هات. یانەی هەولێر نازناوی پاڵەوانیەتییەکەی بەدەستهێنا.',
        content: `پاڵەوانیەتی تۆپی پێی ناوخۆی کوردستان لە شاری هەولێر بە سەرکەوتووی کۆتایی هات. یانەی هەولێر بە بردنەوەی یاری کۆتایی بە لێدانە یەکلاکەرەوەکان، نازناوی پاڵەوانیەتییەکەی بەدەستهێنا.

یارییەکە لە یاریگای فرانسۆ هەراری لە شاری هەولێر بەڕێوەچوو و بەشداربووانی زۆر بەشداربوون. یانەی هەولێر بە ئەنجامی ٣-٢ یارییەکەی بردەوە و بەم شێوەیە نازناوەکەی بەدەستهێنا.

ئەم پاڵەوانیەتییە یەکێکە لە گرنگترین پاڵەوانیەتییەکانی وەرزشی کوردستان و بەرزترین ئاستی وەرزشی نیشانداوە.`,
      },
      fa: {
        title: 'مسابقات فوتبال در اربیل با موفقیت به پایان رسید',
        excerpt: 'مسابقات فوتبال محلی کردستان در شهر اربیل با موفقیت به پایان رسید. تیم اربیل قهرمانی مسابقات را به دست آورد.',
        content: `مسابقات فوتبال محلی کردستان در شهر اربیل با موفقیت به پایان رسید. تیم اربیل با پیروزی در فینال در ضربات پنالتی، قهرمانی مسابقات را به دست آورد.

بازی در ورزشگاه فرانسوا هاراری در شهر اربیل برگزار شد و تماشاگران زیادی حضور داشتند. تیم اربیل با نتیجه ۳-۲ بازی را برد و به این ترتیب قهرمانی را به دست آورد.

این مسابقات یکی از مهم‌ترین مسابقات ورزشی کردستان است و بالاترین سطح ورزشی را نشان داده است.`,
      },
      en: {
        title: 'Football Tournament in Erbil Successfully Concluded',
        excerpt: 'The local Kurdistan football tournament in Erbil city successfully concluded. Erbil FC won the tournament championship.',
        content: `The local Kurdistan football tournament in Erbil city successfully concluded. Erbil FC won the tournament championship by winning the final match in penalty kicks.

The match was held at François Hariri Stadium in Erbil city and many spectators attended. Erbil FC won the match 3-2 and thus won the championship.

This tournament is one of the most important sports tournaments in Kurdistan and has shown the highest level of sports.`,
      },
    },
  },
  {
    id: '4',
    slug: 'technology-ai-development',
    date: '2025-11-01',
    author: 'نووسەری تەکنەلۆژیا',
    category: 'social',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
    ],
    tags: ['دەستکردی زیرەک', 'پزیشکی', 'سلێمانی'],
    translations: {
      ku: {
        title: 'پێشکەوتنی نوێ لە بواری دەستکردی زیرەک لە کوردستان',
        excerpt: 'زانکۆی سلێمانی پڕۆژەیەکی نوێی دەستکردی زیرەک دەستپێکردووە کە دەتوانێت شێوازی کارکردنی دەستەی پزیشکی بگۆڕێت.',
        content: `زانکۆی سلێمانی پڕۆژەیەکی نوێی دەستکردی زیرەک دەستپێکردووە. ئەم پڕۆژەیە بە مەبەستی یاریدانی دەستەی پزیشکی لە دۆزینەوەی نەخۆشی و چارەسەرکردن دروست کراوە.

پڕۆژەکە بە بەکارهێنانی تەکنەلۆژیای پێشەوە دەتوانێت وێنەکانی پزیشکی بە شێوەیەکی خۆکار شیکاری بکات و داکۆپی دەستەی پزیشکی بگاتە زیاتر. ئەمە دەتوانێت کات بۆ دەستەی پزیشکی هەڵبگرێت و تێبینی زیاتر بە نەخۆشەکان بدەن.

پڕۆژەکە لەگەڵ کۆمپانیاکانی تەکنەلۆژیای نێودەوڵەتی بەشداربووە و پێشبینی دەکرێت لە ماوەی ساڵێکدا بەکاربهێنرێت.`,
      },
      fa: {
        title: 'پیشرفت جدید در زمینه هوش مصنوعی در کردستان',
        excerpt: 'دانشگاه سلیمانیه پروژه جدیدی در زمینه هوش مصنوعی آغاز کرده است که می‌تواند نحوه کار کادر پزشکی را تغییر دهد.',
        content: `دانشگاه سلیمانیه پروژه جدیدی در زمینه هوش مصنوعی آغاز کرده است. این پروژه با هدف کمک به کادر پزشکی در تشخیص بیماری و درمان ایجاد شده است.

پروژه با استفاده از فناوری پیشرفته می‌تواند تصاویر پزشکی را به صورت خودکار تجزیه و تحلیل کند و دقت کادر پزشکی را افزایش دهد. این می‌تواند زمان را برای کادر پزشکی ذخیره کند و توجه بیشتری به بیماران بدهند.

پروژه با شرکت‌های فناوری بین‌المللی مشارکت داشته و پیش‌بینی می‌شود که در مدت یک سال استفاده شود.`,
      },
      en: {
        title: 'New Progress in Artificial Intelligence in Kurdistan',
        excerpt: 'Sulaymaniyah University has started a new artificial intelligence project that can change the way medical staff work.',
        content: `Sulaymaniyah University has started a new artificial intelligence project. This project has been created to help medical staff in disease diagnosis and treatment.

The project can automatically analyze medical images using advanced technology and increase the accuracy of medical staff. This can save time for medical staff and give more attention to patients.

The project has collaborated with international technology companies and is expected to be used within a year.`,
      },
    },
  },
  {
    id: '5',
    slug: 'culture-festival-sulaymaniyah',
    date: '2025-10-30',
    author: 'نووسەری کلتور',
    category: 'culture',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    ],
    tags: ['فێستیڤاڵ', 'کلتور', 'سلێمانی'],
    translations: {
      ku: {
        title: 'فێستیڤاڵی کلتوری سلێمانی بە سەرکەوتووی ڕێکخرا',
        excerpt: 'فێستیڤاڵی کلتوری ساڵانەی سلێمانی بە بەشداری ٥٠ هونەرمەند و کۆمەڵایەتی کلتووری بە سەرکەوتووی بەڕێوەچوو.',
        content: `فێستیڤاڵی کلتوری ساڵانەی سلێمانی بە بەشداری ٥٠ هونەرمەند و کۆمەڵایەتی کلتووری بە سەرکەوتووی بەڕێوەچوو. ئەم فێستیڤاڵە بۆ ٣ ڕۆژ بەردەوام بوو و لە چەندین شوێنی جیاوازی شاری سلێمانی بەڕێوەچوو.

لە فێستیڤاڵەکەدا چەندین بەرنامەی جیاواز وەک مۆسیقا، شانۆ، وێنەکێشان، شێعر و بەرنامەی کلتوری تر بەڕێوەچوون. هەروەها چەندین کۆمەڵایەتی کلتووری و هونەرمەندی ناوخۆیی و نێودەوڵەتی بەشداریان کرد.

فێستیڤاڵەکە بە مەبەستی گەشەپێدانی کلتور و هونەری کوردی و ناساندنی کلتوری کوردی بۆ جیهان ڕێکخراوە. بەشداربووانی زۆر بەرنامەکانیان ستایش کردووە و داوایان کردووە کە ساڵی داهاتوو دووبارە بکرێتەوە.`,
      },
      fa: {
        title: 'فستیوال فرهنگی سلیمانیه با موفقیت برگزار شد',
        excerpt: 'فستیوال فرهنگی سالانه سلیمانیه با حضور ۵۰ هنرمند و انجمن فرهنگی با موفقیت برگزار شد.',
        content: `فستیوال فرهنگی سالانه سلیمانیه با حضور ۵۰ هنرمند و انجمن فرهنگی با موفقیت برگزار شد. این فستیوال به مدت ۳ روز ادامه داشت و در چندین مکان مختلف شهر سلیمانیه برگزار شد.

در فستیوال برنامه‌های مختلفی مانند موسیقی، تئاتر، نقاشی، شعر و برنامه‌های فرهنگی دیگر برگزار شد. همچنین چندین انجمن فرهنگی و هنرمندان محلی و بین‌المللی شرکت کردند.

فستیوال با هدف توسعه فرهنگ و هنر کردی و معرفی فرهنگ کردی به جهان برگزار شده است. شرکت‌کنندگان بسیار از برنامه‌ها استقبال کردند و خواستار برگزاری مجدد آن در سال آینده شدند.`,
      },
      en: {
        title: 'Sulaymaniyah Cultural Festival Successfully Held',
        excerpt: 'The annual Sulaymaniyah cultural festival was successfully held with the participation of 50 artists and cultural associations.',
        content: `The annual Sulaymaniyah cultural festival was successfully held with the participation of 50 artists and cultural associations. This festival lasted for 3 days and was held in several different locations in Sulaymaniyah city.

Various programs such as music, theater, painting, poetry, and other cultural programs were held at the festival. Several cultural associations and local and international artists also participated.

The festival was organized to develop Kurdish culture and art and introduce Kurdish culture to the world. Participants greatly welcomed the programs and requested that it be held again next year.`,
      },
    },
  },
  {
    id: '6',
    slug: 'health-new-hospital-erbíl',
    date: '2025-10-28',
    author: 'نووسەری تەندروستی',
    category: 'health',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    tags: ['نەخۆشخانە', 'هەولێر', 'تەندروستی'],
    translations: {
      ku: {
        title: 'کرانەوەی نەخۆشخانەی نوێ لە هەولێر',
        excerpt: 'نەخۆشخانەی نوێی تەندروستی لە هەولێر کرایەوە کە دەتوانێت زیاتر لە ٣٠٠ نەخۆش بە شێوەی هاوکات چاودێری بکات.',
        content: `نەخۆشخانەی نوێی تەندروستی لە هەولێر بە فەرمی کرایەوە. ئەم نەخۆشخانەیە بە بڕی ٥٠ ملیۆن دۆلار دروست کراوە و دەتوانێت زیاتر لە ٣٠٠ نەخۆش بە شێوەی هاوکات چاودێری بکات.

نەخۆشخانەکە بە کەلوپەل و تەکنەلۆژیای پێشەوە دابین کراوە و دەتوانێت خزمەتگوزارییەکانی پزیشکی لە هەموو بوارەکاندا پێشکەش بکات. هەروەها ژمارەیەک لابراتوار و یونیتی تایبەت بۆ چارەسەری نەخۆشییە جیاوازەکان هەیە.

ئەم نەخۆشخانەیە گەورەترین نەخۆشخانەیە لە کوردستان و پێشبینی دەکرێت کە خزمەتگوزارییەکانی باشتر بکات بۆ نەخۆشەکان.`,
      },
      fa: {
        title: 'افتتاح بیمارستان جدید در اربیل',
        excerpt: 'بیمارستان جدید بهداشتی در اربیل افتتاح شد که می‌تواند بیش از ۳۰۰ بیمار را به صورت همزمان مراقبت کند.',
        content: `بیمارستان جدید بهداشتی در اربیل به طور رسمی افتتاح شد. این بیمارستان با هزینه ۵۰ میلیون دلار ساخته شده و می‌تواند بیش از ۳۰۰ بیمار را به صورت همزمان مراقبت کند.

بیمارستان با تجهیزات و فناوری پیشرفته تجهیز شده و می‌تواند خدمات پزشکی را در تمام زمینه‌ها ارائه دهد. همچنین چندین آزمایشگاه و واحد تخصصی برای درمان بیماری‌های مختلف وجود دارد.

این بیمارستان بزرگترین بیمارستان در کردستان است و پیش‌بینی می‌شود که خدمات بهتری را برای بیماران ارائه دهد.`,
      },
      en: {
        title: 'New Hospital Opened in Erbil',
        excerpt: 'A new health hospital was opened in Erbil that can care for more than 300 patients simultaneously.',
        content: `A new health hospital was officially opened in Erbil. This hospital was built at a cost of 50 million dollars and can care for more than 300 patients simultaneously.

The hospital is equipped with advanced equipment and technology and can provide medical services in all fields. There are also several laboratories and specialized units for treating various diseases.

This hospital is the largest hospital in Kurdistan and is expected to provide better services for patients.`,
      },
    },
  },
  {
    id: '7',
    slug: 'politics-election-2025',
    date: '2025-10-25',
    author: 'نووسەری سیاسی',
    category: 'politics',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
    tags: ['هەڵبژاردن', 'سیاسی', 'کوردستان'],
    translations: {
      ku: {
        title: 'ئەنجامدانی هەڵبژاردنی نوێ لە کوردستان',
        excerpt: 'هەڵبژاردنی نوێی پارتی دەستپێکراوە و بەشداربووانی زۆر بەشداریان کردووە بۆ دەستنیشانکردنی نوێنەرەکانیان.',
        content: `هەڵبژاردنی نوێی پارتی لە کوردستان دەستپێکراوە. بەپێی سەرژمێرییەکان، زیاتر لە ٧٠٪ی دەنگدەرەکان بەشداریان کردووە لە هەڵبژاردنەکەدا.

هەڵبژاردنەکە بە شێوەیەکی دیموکراتی و دڵنیا بەڕێوەچووە و هیچ کێشەیەکی تێدا نەبووە. کاندیدەکان بە شێوەیەکی یاسایی و ڕێک و پێک کەمپەینیان کردووە.

ئەنجامەکانی هەڵبژاردنەکە لە ماوەی چەند ڕۆژێکدا بڵاو دەکرێتەوە. ئەم هەڵبژاردنە گرنگە بۆ دەستنیشانکردنی نوێنەرەکانی داهاتوو.`,
      },
      fa: {
        title: 'برگزاری انتخابات جدید در کردستان',
        excerpt: 'انتخابات جدید حزبی در کردستان آغاز شده و شرکت‌کنندگان زیادی برای انتخاب نمایندگان خود شرکت کرده‌اند.',
        content: `انتخابات جدید حزبی در کردستان آغاز شده است. بر اساس آمار، بیش از ۷۰٪ از رأی‌دهندگان در انتخابات شرکت کرده‌اند.

انتخابات به صورت دموکراتیک و امن برگزار شد و هیچ مشکلی در آن وجود نداشت. کاندیداها به صورت قانونی و منظم کمپین خود را انجام داده‌اند.

نتایج انتخابات در طی چند روز آینده اعلام خواهد شد. این انتخابات مهم است برای انتخاب نمایندگان آینده.`,
      },
      en: {
        title: 'New Elections Held in Kurdistan',
        excerpt: 'New party elections have begun in Kurdistan and many participants have voted to choose their representatives.',
        content: `New party elections have begun in Kurdistan. According to statistics, more than 70% of voters participated in the elections.

The elections were held democratically and securely and there were no problems. Candidates have conducted their campaigns legally and systematically.

The election results will be announced within a few days. This election is important for choosing future representatives.`,
      },
    },
  },
  {
    id: '8',
    slug: 'social-education-reform',
    date: '2025-10-22',
    author: 'نووسەری کۆمەڵایەتی',
    category: 'social',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    tags: ['پەروەردە', 'چاکسازی', 'کوردستان'],
    translations: {
      ku: {
        title: 'چاکسازی لە سیستەمی پەروەردە لە کوردستان',
        excerpt: 'حکومەتی کوردستان پڕۆگرامێکی چاکسازی لە سیستەمی پەروەردە دەستپێکردووە کە دەتوانێت کۆمەڵگا باشتر بکات.',
        content: `حکومەتی کوردستان پڕۆگرامێکی چاکسازی لە سیستەمی پەروەردە دەستپێکردووە. ئەم پڕۆگرامە بە مەبەستی باشترکردنی کۆمەڵگا و دابینکردنی پەروەردەی بەرزتر بۆ منداڵان دروست کراوە.

پڕۆگرامەکە چەندین بەشی تێدایە وەک باشترکردنی کتێبخانەکان، زیادکردنی کەلوپەل و تەکنەلۆژیا لە قوتابخانەکان، و باشترکردنی پەروەردەی مامۆستاکان. هەروەها پڕۆگرامێک بۆ خوێندنی بەرزتر بۆ هەموو منداڵان دابین کراوە.

پێشبینی دەکرێت کە ئەم پڕۆگرامە کاریگەرییەکی گەورەی لەسەر کۆمەڵگا بێت و کۆمەڵگای باشتر دروست بکات. بەشداربووانی پەروەردە پڕۆگرامەکەیان ستایش کردووە.`,
      },
      fa: {
        title: 'اصلاح سیستم آموزش و پرورش در کردستان',
        excerpt: 'دولت کردستان برنامه اصلاحی در سیستم آموزش و پرورش آغاز کرده است که می‌تواند جامعه را بهتر کند.',
        content: `دولت کردستان برنامه اصلاحی در سیستم آموزش و پرورش آغاز کرده است. این برنامه با هدف بهتر کردن جامعه و ارائه آموزش بهتر برای کودکان ایجاد شده است.

برنامه شامل بخش‌های مختلفی مانند بهتر کردن کتابخانه‌ها، افزودن تجهیزات و فناوری به مدارس، و بهتر کردن آموزش معلمان است. همچنین برنامه‌ای برای آموزش عالی برای همه کودکان ارائه شده است.

پیش‌بینی می‌شود که این برنامه تأثیر بزرگی بر جامعه داشته باشد و جامعه بهتری ایجاد کند. شرکت‌کنندگان در آموزش از برنامه استقبال کرده‌اند.`,
      },
      en: {
        title: 'Education System Reform in Kurdistan',
        excerpt: 'The Kurdistan government has started a reform program in the education system that can improve society.',
        content: `The Kurdistan government has started a reform program in the education system. This program has been created to improve society and provide better education for children.

The program includes various sections such as improving libraries, adding equipment and technology to schools, and improving teacher education. A program for higher education for all children has also been provided.

It is expected that this program will have a great impact on society and create a better society. Education participants have welcomed the program.`,
      },
    },
  },
  {
    id: '10',
    slug: 'suicide-maziyar-ahmadi-sardasht',
    date: '2024-11-13',
    author: 'کۆدەنگ',
    category: 'social',
    image: '/images/maziyar-ahmadi.jpg',
    tags: ['کۆدەنگ', 'کورد', 'کوردستان', 'سردشت', 'جوان'],
    translations: {
      ku: {
        title: 'خودکشی مازیار احمدی ٢٢ ساڵە لە سردشت',
        excerpt: 'ڕۆژی دووشەممە ٢٢ی ئابانی ١٤٠٤، یەک دانیشتووی بە ناوی "مازیار احمدی" ٢٢ ساڵە، کوڕی ئەمیر و خەڵکی شاری سردشت بە کردنی خودکشی لە ڕێگەی خنکاندنەوە ژیانی خۆی کۆتایی هێنا.',
        content: `ڕۆژی دووشەممە ٢٢ی ئابانی ١٤٠٤، یەک دانیشتووی بە ناوی "مازیار احمدی" ٢٢ ساڵە، کوڕی ئەمیر و خەڵکی شاری سردشت بە کردنی خودکشی لە ڕێگەی خنکاندنەوە ژیانی خۆی کۆتایی هێنا.

ئەم ڕووداوە کەش و هەواکانی کۆمەڵایەتی و دەروونی کوردستان نیشان دەدات. پێویستە کۆمەڵگا و دەسەڵاتداران بەرپرسیارێتی خۆیان بگرن بەرامبەر کێشەکانی دەروونی و کۆمەڵایەتی خەڵک.

کۆدەنگ داوای دەکات کە لەم جۆرە ڕووداوانەدا زیاتر سەرنج بدەین و هەوڵ بدەین کێشەکانی کۆمەڵگا چارەسەر بکەین.`,
      },
      fa: {
        title: 'خودکشی مازیار احمدی ۲۲ ساله در سردشت',
        excerpt: 'روز دوشنبه ۲۲ آبان ماه ۱۴۰۴، یک شهروند با هویت "مازیار احمدی" ۲۲ ساله، فرزند امیر و اهل شهرستان سردشت با اقدام به خودکشی از طریق حلق آویز کردن به زندگی خود پایان داد.',
        content: `روز دوشنبه ۲۲ آبان ماه ۱۴۰۴، یک شهروند با هویت "مازیار احمدی" ۲۲ ساله، فرزند امیر و اهل شهرستان سردشت با اقدام به خودکشی از طریق حلق آویز کردن به زندگی خود پایان داد.

این رویداد نشان‌دهنده مشکلات اجتماعی و روانی در کردستان است. جامعه و مسئولان باید مسئولیت خود را در قبال مشکلات روانی و اجتماعی مردم بپذیرند.

کۆدەنگ خواستار توجه بیشتر به این گونه رویدادها و تلاش برای حل مشکلات جامعه است.`,
      },
      en: {
        title: 'Suicide of Maziyar Ahmadi, 22 years old, in Sardasht',
        excerpt: 'On Monday, November 13, 2024, a citizen named "Maziyar Ahmadi", 22 years old, son of Amir and resident of Sardasht city, ended his life by committing suicide through hanging.',
        content: `On Monday, November 13, 2024, a citizen named "Maziyar Ahmadi", 22 years old, son of Amir and resident of Sardasht city, ended his life by committing suicide through hanging.

This incident reflects the social and psychological challenges in Kurdistan. Society and authorities must take responsibility for addressing the mental health and social issues of the people.

KODANG calls for greater attention to such incidents and efforts to address community problems.`,
      },
    },
  },
]

