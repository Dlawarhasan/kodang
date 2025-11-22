# Google Translate API Setup Guide

## هەنگاوەکان بۆ دامەزراندنی Google Translate API

### 1. دروستکردنی هەژمار لە Google Cloud Platform

1. بڕۆ بۆ [Google Cloud Console](https://console.cloud.google.com/)
2. ئەگەر هەژمارت نیە، هەژمارێک دروست بکە (Free tier هەیە)

### 2. دروستکردنی پڕۆژەی نوێ

1. لە کۆنسۆڵی GCP، لە گوشەی سەرەوەی لای چەپ، "Select a project" کلیک بکە
2. "New Project" هەڵبژێرە
3. ناوی پڕۆژەکە بنووسە (وەک: `kodang-news`)
4. "Create" کلیک بکە

### 3. چالاککردنی Google Translate API

1. لە پڕۆژەکە، بڕۆ بۆ "APIs & Services" → "Library"
2. لە search box بنووسە: "Cloud Translation API"
3. "Cloud Translation API" هەڵبژێرە
4. "Enable" کلیک بکە

### 4. دروستکردنی API Key

1. بڕۆ بۆ "APIs & Services" → "Credentials"
2. لە سەرەوە "Create Credentials" کلیک بکە
3. "API key" هەڵبژێرە
4. API key دروست دەبێت - کۆپی بکە (ئەمە تەنها جارێک پیشان دەدرێت!)

### 5. سنووردارکردنی API Key (ئیختیاری بەڵام پێشنیار دەکرێت)

1. لە "Credentials" page، API key-ەکەت کلیک بکە
2. لە "API restrictions"، "Restrict key" هەڵبژێرە
3. "Cloud Translation API" تەنها هەڵبژێرە
4. "Save" کلیک بکە

### 6. زیادکردنی API Key بۆ Environment Variables

1. لە پڕۆژەکەت، فایلی `.env.local` دروست بکە (یان بگۆڕە)
2. API key-ەکە زیاد بکە:

```env
GOOGLE_TRANSLATE_API_KEY=your-api-key-here
```

3. فایلەکە save بکە

### 7. Restart کردنەوەی Development Server

```bash
npm run dev
```

## تێبینی گرنگ

### Free Tier Limits
- Google Translate API لە free tier دا:
  - 500,000 characters/month بەخۆڕایی
  - پاشان $20 per 1 million characters

### Language Codes
- فارسی (Farsi): `fa`
- کوردی (Kurdish): `ckb` (Central Kurdish/Sorani)
- ئینگلیزی (English): `en`
- عەرەبی (Arabic): `ar`
- تورکی (Turkish): `tr`

### Security
- **هەرگیز API key لە کۆددا hardcode مەکە**
- API key تەنها لە `.env.local` دابنێ (کە لە git ignore هەیە)
- لە production، لە deployment platform (Vercel/Netlify) environment variables زیاد بکە

## تاقیکردنەوە

1. پۆستێک بکەرەوە بە فارسی
2. زمان بگۆڕە بۆ کوردی یان ئینگلیزی
3. پۆستەکە دەبێت خۆکارانە وەرگێڕدرێت

## کێشەکان

### ئەگەر Translation کار ناکات:
1. چێک بکە API key دروست بووە
2. چێک بکە Cloud Translation API چالاک کراوە
3. چێک بکە environment variable دروست بووە
4. لە browser console بڕوانە بۆ error messages

### ئەگەر "Translation service not configured" دەبینیت:
- دڵنیابە کە `GOOGLE_TRANSLATE_API_KEY` لە `.env.local` هەیە
- Server restart بکە

## Cost Management

بۆ کۆنتڕۆڵکردنی cost:
1. لە Google Cloud Console، بڕۆ بۆ "Billing" → "Budgets & alerts"
2. Budget دروست بکە بۆ پڕۆژەکەت
3. Alert زیاد بکە کاتێک cost دەگاتە سنوورێک

## پشتیوانی

بۆ زانیاری زیاتر:
- [Google Cloud Translation API Documentation](https://cloud.google.com/translate/docs)
- [Pricing](https://cloud.google.com/translate/pricing)

