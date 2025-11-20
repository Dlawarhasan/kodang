// Category mapping for translations
export const categoryMapping: Record<string, { ku: string; fa: string; en: string }> = {
  politics: { ku: 'سیاسی', fa: 'سیاسی', en: 'Politics' },
  social: { ku: 'کۆمەڵایەتی', fa: 'اجتماعی', en: 'Social' },
  culture: { ku: 'کلتور', fa: 'فرهنگ', en: 'Culture' },
  health: { ku: 'تەندروستی', fa: 'سلامت', en: 'Health' },
  women: { ku: 'ژنان', fa: 'زنان', en: 'Women' },
  workers: { ku: 'کارگر', fa: 'کارگر', en: 'Workers' },
  kolbar: { ku: 'کۆڵبەر', fa: 'کولبر', en: 'Kolbar' },
  children: { ku: 'منداڵان', fa: 'کودکان', en: 'Children' },
  arrest: { ku: 'دەستبەسەرکردن', fa: 'بازداشت', en: 'Arrest' },
  students: { ku: 'خوێندکار', fa: 'دانشجو', en: 'Students' },
  suicide: { ku: 'خۆکوژی', fa: 'خودکشی', en: 'Suicide' },
}

export function getCategoryName(categoryId: string, locale: string): string {
  const mapping = categoryMapping[categoryId]
  if (!mapping) return categoryId
  
  if (locale === 'ku') return mapping.ku
  if (locale === 'fa') return mapping.fa
  return mapping.en
}

