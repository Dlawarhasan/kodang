// Date formatting utility for Kurdish, Farsi, and English

const kurdishMonths = [
  'کانوونی دووەم',
  'شوبات',
  'ئازار',
  'نیسان',
  'ئایار',
  'حوزەیران',
  'تەممووز',
  'ئاب',
  'ئەیلوول',
  'تشرینی یەکەم',
  'تشرینی دووەم',
  'مێژوو' // December
]

const farsiMonths = [
  'ژانویه',
  'فوریه',
  'مارس',
  'آوریل',
  'مه',
  'ژوئن',
  'جولای',
  'آگوست',
  'سپتامبر',
  'اکتبر',
  'نوامبر',
  'دسامبر'
]

export function formatDate(date: string | Date, locale: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return date.toString()
  }

  const day = dateObj.getDate()
  const month = dateObj.getMonth()
  const year = dateObj.getFullYear()

  if (locale === 'ku') {
    // Kurdish format: 22ê مێژووی 2025an
    const monthName = kurdishMonths[month]
    // Add "ê" suffix to day, "ی" to month, and "an" to year
    return `${day}ی ${monthName}ی ${year}`
  } else if (locale === 'fa') {
    // Farsi format: 22 می 2025
    const monthName = farsiMonths[month]
    return `${day} ${monthName} ${year}`
  } else {
    // English format: December 22, 2025
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

export function formatDateShort(date: string | Date, locale: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return date.toString()
  }

  const day = dateObj.getDate()
  const month = dateObj.getMonth()
  const year = dateObj.getFullYear()

  if (locale === 'ku') {
    // Kurdish short format: 22 مێژوو 2025
    const monthName = kurdishMonths[month]
    return `${day} ${monthName} ${year}`
  } else if (locale === 'fa') {
    // Farsi short format: 22 می 2025
    const monthName = farsiMonths[month]
    return `${day} ${monthName} ${year}`
  } else {
    // English short format: Dec 22, 2025
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

