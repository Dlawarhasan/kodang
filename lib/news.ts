import { newsDataWithTranslations } from './news-translations'

export interface NewsItem {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  authorInstagram?: string
  authorFacebook?: string
  authorTwitter?: string
  authorTelegram?: string
  authorYoutube?: string
  category?: string
  section?: 'hero' | 'breaking' | 'general'
  image?: string
  video?: string
  audio?: string
  images?: string[]
  tags?: string[]
}

// Old data removed - now using news-translations.ts
// Mock data removed - در داهاتوو دەتوانیت دەیتابەیس بەکاربهێنیت
/*const newsData: NewsItem[] = [
  {
    id: '1',
    slug: 'arrest-of-jafer-sadeqi',
    title: 'دەستگیرکردن و گواستنەوەی جەعفەر صادقی کەشتیوانی کورد بۆ زیندان',
    excerpt: 'روز دوشنبه ۲۱ مهرماه ۱۴۰۴ برابر با (۱۳ اکتبر ۲۰۲۵)، "جعفر صادقی"، کوهنورد و مربی سنگ‌نوردی اهل اشنویه، پس از احضار به شعبه اجرای احکام دادگاه عمومی و انقلاب این شهر، بازداشت و جهت اجرای حکم حبس به زندان اشنویه منتقل شد.',
    content: `روز دوشنبه ۲۱ مهرماه ۱۴۰۴ برابر با (۱۳ اکتبر ۲۰۲۵)، "جعفر صادقی"، کوهنورد و مربی سنگ‌نوردی اهل اشنویه، پس از احضار به شعبه اجرای احکام دادگاه عمومی و انقلاب این شهر، بازداشت و جهت اجرای حکم حبس به زندان اشنویه منتقل شد.

بر پایه این گزارش، در تاریخ ۱۶ تیرماه ۱۴۰۴، دادگاه کیفری دو شعبه ۱۰۱ اشنویه این شهروند کُرد را به اتهام (تبلیغ علیه نظام) به ۱۰ ماه حبس تعزیری محکوم کرده بود.

همچنین، جعفر صادقی پیش‌تر نیز توسط نیروهای امنیتی بازداشت و پس از پایان مراحل بازجویی با تودیع قرار وثیقه به‌صورت موقت آزاد شده بود.

لازم به ذکر است، آقای صادقی از مربیان فعال رشته کوهنوردی و سنگ‌نوردی و از اعضای گروه کوهنوردی باران اشنویه است.`,
    date: '2025-10-13',
    author: 'نووسەر',
    category: 'سیاسی',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    tags: ['اشنویه', 'جعفر صادقی', 'کوهنوردی'],
  },
  {
    id: '2',
    slug: 'health-care-workers-protest-kermanshah',
    title: 'کۆبوونەوەی ناڕەزایی کادرەکانی تەندروستی کرمانشاه لە بەرامبەر زانکۆی زانستەکانی پزیشکی',
    excerpt: 'کادرەکانی تەندروستی کرمانشاه لە کۆبوونەوەیەکی ناڕەزایی لە بەرامبەر زانکۆی زانستەکانی پزیشکی بەشداریان کردووە بۆ دەستپێکردنی دەسەڵاتیان و چارەسەرکردنی کێشەکانیان.',
    content: `کادرەکانی تەندروستی کرمانشاه لە کۆبوونەوەیەکی ناڕەزایی لە بەرامبەر زانکۆی زانستەکانی پزیشکی بەشداریان کردووە. ئەم کۆبوونەوەیە بە مەبەستی دەستپێکردنی دەسەڵاتیان و چارەسەرکردنی کێشەکانیان ڕێکخراوە.

بەپێی ڕاپۆرتەکان، کادرەکانی تەندروستی بە دوای چارەسەرکردنی کێشەکانی کارکردن و پارەی دەستپێکردن دەگەڕێن. هەروەها داوایان کردووە کە دەسەڵاتیان دەستپێبکرێت و پێویستەکان بە باشترین شێوە دابین بکرێن.

کۆبوونەوەکە بەبێ هیچ کێشەیەک تێپەڕیوە و بەشداربووان داوایان کردووە کە کێشەکانیان بە خێرایی چارەسەر بکرێن.`,
    date: '2025-11-03',
    author: 'نووسەری هەواڵ',
    category: 'کۆمەڵایەتی',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
    tags: ['کرمانشاه', 'کادر تەندروستی', 'کۆبوونەوە'],
  },
  {
    id: '3',
    slug: 'sports-football-tournament',
    title: 'پاڵەوانیەتی تۆپی پێ لە هەولێر بە سەرکەوتووی کۆتایی هات',
    excerpt: 'پاڵەوانیەتی تۆپی پێی ناوخۆی کوردستان لە شاری هەولێر بە سەرکەوتووی کۆتایی هات. یانەی هەولێر نازناوی پاڵەوانیەتییەکەی بەدەستهێنا.',
    content: `پاڵەوانیەتی تۆپی پێی ناوخۆی کوردستان لە شاری هەولێر بە سەرکەوتووی کۆتایی هات. یانەی هەولێر بە بردنەوەی یاری کۆتایی بە لێدانە یەکلاکەرەوەکان، نازناوی پاڵەوانیەتییەکەی بەدەستهێنا.

یارییەکە لە یاریگای فرانسۆ هەراری لە شاری هەولێر بەڕێوەچوو و بەشداربووانی زۆر بەشداربوون. یانەی هەولێر بە ئەنجامی ٣-٢ یارییەکەی بردەوە و بەم شێوەیە نازناوەکەی بەدەستهێنا.

ئەم پاڵەوانیەتییە یەکێکە لە گرنگترین پاڵەوانیەتییەکانی وەرزشی کوردستان و بەرزترین ئاستی وەرزشی نیشانداوە.`,
    date: '2025-11-02',
    author: 'نووسەری وەرزشی',
    category: 'وەرزش',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['تۆپی پێ', 'هەولێر', 'پاڵەوانیەتی'],
  },
  {
    id: '4',
    slug: 'technology-ai-development',
    title: 'پێشکەوتنی نوێ لە بواری دەستکردی زیرەک لە کوردستان',
    excerpt: 'زانکۆی سلێمانی پڕۆژەیەکی نوێی دەستکردی زیرەک دەستپێکردووە کە دەتوانێت شێوازی کارکردنی دەستەی پزیشکی بگۆڕێت.',
    content: `زانکۆی سلێمانی پڕۆژەیەکی نوێی دەستکردی زیرەک دەستپێکردووە. ئەم پڕۆژەیە بە مەبەستی یاریدانی دەستەی پزیشکی لە دۆزینەوەی نەخۆشی و چارەسەرکردن دروست کراوە.

پڕۆژەکە بە بەکارهێنانی تەکنەلۆژیای پێشەوە دەتوانێت وێنەکانی پزیشکی بە شێوەیەکی خۆکار شیکاری بکات و داکۆپی دەستەی پزیشکی بگاتە زیاتر. ئەمە دەتوانێت کات بۆ دەستەی پزیشکی هەڵبگرێت و تێبینی زیاتر بە نەخۆشەکان بدەن.

پڕۆژەکە لەگەڵ کۆمپانیاکانی تەکنەلۆژیای نێودەوڵەتی بەشداربووە و پێشبینی دەکرێت لە ماوەی ساڵێکدا بەکاربهێنرێت.`,
    date: '2025-11-01',
    author: 'نووسەری تەکنەلۆژیا',
    category: 'تەکنەلۆژیا',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
    ],
    tags: ['دەستکردی زیرەک', 'پزیشکی', 'سلێمانی'],
  },
  {
    id: '5',
    slug: 'culture-festival-sulaymaniyah',
    title: 'فێستیڤاڵی کلتوری سلێمانی بە سەرکەوتووی ڕێکخرا',
    excerpt: 'فێستیڤاڵی کلتوری ساڵانەی سلێمانی بە بەشداری ٥٠ هونەرمەند و کۆمەڵایەتی کلتووری بە سەرکەوتووی بەڕێوەچوو.',
    content: `فێستیڤاڵی کلتوری ساڵانەی سلێمانی بە بەشداری ٥٠ هونەرمەند و کۆمەڵایەتی کلتووری بە سەرکەوتووی بەڕێوەچوو. ئەم فێستیڤاڵە بۆ ٣ ڕۆژ بەردەوام بوو و لە چەندین شوێنی جیاوازی شاری سلێمانی بەڕێوەچوو.

لە فێستیڤاڵەکەدا چەندین بەرنامەی جیاواز وەک مۆسیقا، شانۆ، وێنەکێشان، شێعر و بەرنامەی کلتوری تر بەڕێوەچوون. هەروەها چەندین کۆمەڵایەتی کلتووری و هونەرمەندی ناوخۆیی و نێودەوڵەتی بەشداریان کرد.

فێستیڤاڵەکە بە مەبەستی گەشەپێدانی کلتور و هونەری کوردی و ناساندنی کلتوری کوردی بۆ جیهان ڕێکخراوە. بەشداربووانی زۆر بەرنامەکانیان ستایش کردووە و داوایان کردووە کە ساڵی داهاتوو دووبارە بکرێتەوە.`,
    date: '2025-10-30',
    author: 'نووسەری کلتور',
    category: 'کلتور',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    ],
    tags: ['فێستیڤاڵ', 'کلتور', 'سلێمانی'],
  },
  {
    id: '6',
    slug: 'health-new-hospital-erbíl',
    title: 'کرانەوەی نەخۆشخانەی نوێ لە هەولێر',
    excerpt: 'نەخۆشخانەی نوێی تەندروستی لە هەولێر کرایەوە کە دەتوانێت زیاتر لە ٣٠٠ نەخۆش بە شێوەی هاوکات چاودێری بکات.',
    content: `نەخۆشخانەی نوێی تەندروستی لە هەولێر بە فەرمی کرایەوە. ئەم نەخۆشخانەیە بە بڕی ٥٠ ملیۆن دۆلار دروست کراوە و دەتوانێت زیاتر لە ٣٠٠ نەخۆش بە شێوەی هاوکات چاودێری بکات.

نەخۆشخانەکە بە کەلوپەل و تەکنەلۆژیای پێشەوە دابین کراوە و دەتوانێت خزمەتگوزارییەکانی پزیشکی لە هەموو بوارەکاندا پێشکەش بکات. هەروەها ژمارەیەک لابراتوار و یونیتی تایبەت بۆ چارەسەری نەخۆشییە جیاوازەکان هەیە.

ئەم نەخۆشخانەیە گەورەترین نەخۆشخانەیە لە کوردستان و پێشبینی دەکرێت کە خزمەتگوزارییەکانی باشتر بکات بۆ نەخۆشەکان.`,
    date: '2025-10-28',
    author: 'نووسەری تەندروستی',
    category: 'تەندروستی',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    tags: ['نەخۆشخانە', 'هەولێر', 'تەندروستی'],
  },
  {
    id: '7',
    slug: 'politics-election-2025',
    title: 'ئەنجامدانی هەڵبژاردنی نوێ لە کوردستان',
    excerpt: 'هەڵبژاردنی نوێی پارتی دەستپێکراوە و بەشداربووانی زۆر بەشداریان کردووە بۆ دەستنیشانکردنی نوێنەرەکانیان.',
    content: `هەڵبژاردنی نوێی پارتی لە کوردستان دەستپێکراوە. بەپێی سەرژمێرییەکان، زیاتر لە ٧٠٪ی دەنگدەرەکان بەشداریان کردووە لە هەڵبژاردنەکەدا.

هەڵبژاردنەکە بە شێوەیەکی دیموکراتی و دڵنیا بەڕێوەچووە و هیچ کێشەیەکی تێدا نەبووە. کاندیدەکان بە شێوەیەکی یاسایی و ڕێک و پێک کەمپەینیان کردووە.

ئەنجامەکانی هەڵبژاردنەکە لە ماوەی چەند ڕۆژێکدا بڵاو دەکرێتەوە. ئەم هەڵبژاردنە گرنگە بۆ دەستنیشانکردنی نوێنەرەکانی داهاتوو.`,
    date: '2025-10-25',
    author: 'نووسەری سیاسی',
    category: 'سیاسی',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
    tags: ['هەڵبژاردن', 'سیاسی', 'کوردستان'],
  },
  {
    id: '8',
    slug: 'social-education-reform',
    title: 'چاکسازی لە سیستەمی پەروەردە لە کوردستان',
    excerpt: 'حکومەتی کوردستان پڕۆگرامێکی چاکسازی لە سیستەمی پەروەردە دەستپێکردووە کە دەتوانێت کۆمەڵگا باشتر بکات.',
    content: `حکومەتی کوردستان پڕۆگرامێکی چاکسازی لە سیستەمی پەروەردە دەستپێکردووە. ئەم پڕۆگرامە بە مەبەستی باشترکردنی کۆمەڵگا و دابینکردنی پەروەردەی بەرزتر بۆ منداڵان دروست کراوە.

پڕۆگرامەکە چەندین بەشی تێدایە وەک باشترکردنی کتێبخانەکان، زیادکردنی کەلوپەل و تەکنەلۆژیا لە قوتابخانەکان، و باشترکردنی پەروەردەی مامۆستاکان. هەروەها پڕۆگرامێک بۆ خوێندنی بەرزتر بۆ هەموو منداڵان دابین کراوە.

پێشبینی دەکرێت کە ئەم پڕۆگرامە کاریگەرییەکی گەورەی لەسەر کۆمەڵگا بێت و کۆمەڵگای باشتر دروست بکات. بەشداربووانی پەروەردە پڕۆگرامەکەیان ستایش کردووە.`,
    date: '2025-10-22',
    author: 'نووسەری کۆمەڵایەتی',
    category: 'کۆمەڵایەتی',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    tags: ['پەروەردە', 'چاکسازی', 'کوردستان'],
  },
]*/ // Old data removed

export async function getNews(locale: string = 'fa'): Promise<NewsItem[]> { // Default to Farsi
  // Try to fetch from API first
  try {
    // Use window.location.origin in browser, or process.env in server
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime()
    const apiUrl = `${baseUrl}/api/news?locale=${locale}&_t=${timestamp}`
    console.log('Fetching news from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
    
    console.log('API response status:', response.status, response.statusText)
    
    if (response.ok) {
      const data = await response.json()
      console.log('Fetched news from API:', data.news?.length || 0, 'items')
      if (data.news && Array.isArray(data.news) && data.news.length > 0) {
        return data.news
      } else {
        console.log('API returned empty array, using static data')
      }
    } else {
      const errorText = await response.text()
      console.error('API response error:', response.status, response.statusText, errorText)
    }
  } catch (error: any) {
    console.error('API fetch error:', error.message, error)
  }

  // Fallback to static data
  console.log('Using static data fallback')
  return newsDataWithTranslations.map(item => ({
    ...item,
    title: item.translations[locale as keyof typeof item.translations]?.title || item.translations.ku.title,
    excerpt: item.translations[locale as keyof typeof item.translations]?.excerpt || item.translations.ku.excerpt,
    content: item.translations[locale as keyof typeof item.translations]?.content || item.translations.ku.content,
  })).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getNewsBySlug(slug: string, locale: string = 'fa'): Promise<NewsItem | undefined> { // Default to Farsi
  // Try to fetch from API first
  try {
    // Use window.location.origin in browser, or process.env in server
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime()
    const response = await fetch(`${baseUrl}/api/news/${encodeURIComponent(slug)}?locale=${locale}&_t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.news
    } else {
      console.log('API response not OK for slug:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('API not available, using static data:', error)
  }

  // Fallback to static data
  const item = newsDataWithTranslations.find(item => item.slug === slug)
  if (!item) return undefined
  
  const translation = item.translations[locale as keyof typeof item.translations] || item.translations.ku
  
  return {
    ...item,
    title: translation.title,
    excerpt: translation.excerpt,
    content: translation.content,
  }
}

export async function getNewsByCategory(category: string, locale: string = 'fa'): Promise<NewsItem[]> { // Default to Farsi
  const allNews = await getNews(locale)
  if (category === 'all') {
    return allNews
  }
  return allNews.filter(item => item.category === category)
}

