# Translation Setup Guide

## Overview
The website now supports automatic translation of post content when users change the language. If a post doesn't have a translation in the selected language, it will be automatically translated.

## Translation Service Options

### Option 1: LibreTranslate (Free, Recommended)
LibreTranslate is a free, open-source translation service.

1. **Self-hosted (Free)**: Set up your own LibreTranslate server
   - Docker: `docker run -ti --rm -p 5000:5000 libretranslate/libretranslate`
   - Set environment variable: `LIBRETRANSLATE_URL=http://your-server:5000/translate`

2. **Public API (Limited)**: Use the public LibreTranslate API
   - Default URL: `https://libretranslate.com/translate`
   - Note: May have rate limits

### Option 2: Google Translate API (Paid)
1. Get API key from Google Cloud Console
2. Add to environment variables: `GOOGLE_TRANSLATE_API_KEY=your-key`
3. Update `/app/api/translate/route.ts` to use Google Translate API

### Option 3: Microsoft Translator API (Paid)
1. Get API key from Azure
2. Add to environment variables: `MICROSOFT_TRANSLATOR_KEY=your-key`
3. Update `/app/api/translate/route.ts` to use Microsoft Translator

## Environment Variables

Add to your `.env.local`:
```env
# LibreTranslate (if self-hosted)
LIBRETRANSLATE_URL=http://localhost:5000/translate

# Or use Google Translate API
GOOGLE_TRANSLATE_API_KEY=your-api-key

# Or use Microsoft Translator
MICROSOFT_TRANSLATOR_KEY=your-api-key
MICROSOFT_TRANSLATOR_REGION=your-region
```

## How It Works

1. When a user changes the language:
   - System checks if translation exists in database
   - If not, automatically translates using the translation API
   - Shows "Translating..." indicator while translating
   - Displays translated content

2. Translation Priority:
   - First: Check database for existing translation
   - Second: Use Farsi translation as fallback
   - Third: Auto-translate using API

## Testing

1. Create a post with only Farsi content
2. Change language to Kurdish or English
3. Post should automatically translate
4. Check browser console for translation logs

## Notes

- Translations are not saved to database (on-the-fly translation)
- For better performance, add translations manually in admin panel
- Auto-translation may have slight quality differences from manual translation

