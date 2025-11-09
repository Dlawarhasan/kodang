'use client'

import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('about')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('title')}</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('aboutUs')}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t('description')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('goals')}</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>{t('goal1')}</li>
            <li>{t('goal2')}</li>
            <li>{t('goal3')}</li>
            <li>{t('goal4')}</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

