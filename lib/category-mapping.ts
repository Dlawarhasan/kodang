// Category mapping for translations
export const categoryMapping: Record<string, { ku: string; fa: string; en: string }> = {
  politics: { ku: 'سیاسی', fa: 'سیاسی', en: 'Politics' },
  social: { ku: 'کۆمەڵایەتی', fa: 'اجتماعی', en: 'Social' },
  sports: { ku: 'وەرزش', fa: 'ورزش', en: 'Sports' },
  technology: { ku: 'تەکنەلۆژیا', fa: 'فناوری', en: 'Technology' },
  culture: { ku: 'کلتور', fa: 'فرهنگ', en: 'Culture' },
  health: { ku: 'تەندروستی', fa: 'سلامت', en: 'Health' },
}

export function getCategoryName(categoryId: string, locale: string): string {
  const mapping = categoryMapping[categoryId]
  if (!mapping) return categoryId
  
  if (locale === 'ku') return mapping.ku
  if (locale === 'fa') return mapping.fa
  return mapping.en
}

