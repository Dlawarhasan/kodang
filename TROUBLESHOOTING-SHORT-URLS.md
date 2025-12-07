# Troubleshooting Short URLs - 404 Error

## کێشە: کاتێک کلیک لە short URL دەکەم، 404 دەردەکەوێت

### 🔍 Test Endpoint

یەکەم شت - تاقی بکەوە system کار دەکات:

بچۆ بۆ:
```
https://kodang.news/api/shorten/test
```

ئەمە دەڵێت:
- خشتەی `short_urls` هەیە یان نا
- چەند short URL هەیە
- Sample short URLs

---

## کێشە: کاتێک کلیک لە short URL دەکەم، 404 دەردەکەوێت

### هەنگاو 1: چێک بکە خشتەی short_urls هەیە

لە Supabase SQL Editor:

```sql
-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'short_urls'
);
```

ئەگەر `false` دەرکەوێت، SQL script-ەکە run بکە:
- فایلی `supabase-create-short-urls-table.sql` بنووسە
- Run بکە

---

### هەنگاو 2: چێک بکە data هەیە

```sql
-- Check if there are any short URLs
SELECT COUNT(*) FROM short_urls;

-- See all short URLs
SELECT code, slug, locale, created_at FROM short_urls ORDER BY created_at DESC LIMIT 10;
```

ئەگەر هیچ data نییە، واتای ئەمەیە:
- Short URL هێشتا دروست نەکراوە
- کاتێک لینک کۆپی دەکەیت، short URL دروست دەبێت

---

### هەنگاو 3: چێک بکە Short URL دروست دەبێت

1. بچۆ بۆ پۆستێک: `https://kodang.news/fa/news/some-slug`
2. کلیک لە "کۆپی لینک" بکە
3. لە browser console (F12) چێک بکە:
   - Network tab → `/api/shorten` request
   - Response چێک بکە - دەبێت `shortUrl` هەبێت

---

### هەنگاو 4: چێک بکە Code دروستە

کاتێک لینک کۆپی دەکەیت، لینکێکی وەک ئەمە دەبێت:
```
https://kodang.news/s/aBc123
```

ئەگەر لینکەکە وەک ئەمە بێت:
```
https://kodang.news/s/...?l=fa&s=slug
```
واتای ئەمەیە short URL دروست نەبووە و fallback بەکارهاتووە.

---

### هەنگاو 5: Test بکە API

لە browser console:

```javascript
// Test creating a short URL
fetch('/api/shorten?slug=test-slug&locale=fa')
  .then(r => r.json())
  .then(console.log)

// Test resolving a short URL
fetch('/api/shorten/resolve?code=YOUR_CODE_HERE')
  .then(r => r.json())
  .then(console.log)
```

---

### کێشەکانی باو

#### 1. Table نەدۆزرایەوە
**Error:** `relation "short_urls" does not exist`
**چارەسەر:** SQL script-ەکە run بکە

#### 2. Code نەدۆزرایەوە
**Error:** `Short URL not found`
**چارەسەر:** 
- چێک بکە code-ەکە دروستە
- لە database چێک بکە code-ەکە هەیە

#### 3. RLS Policy کێشە
**Error:** `permission denied`
**چارەسەر:** SQL script-ەکە دوبارە run بکە (policies دروست دەبن)

---

### چۆن Debug بکەیت

1. **Browser Console:**
   - F12 بکە
   - Network tab → چێک بکە API calls
   - Console tab → چێک بکە errors

2. **Supabase Logs:**
   - بچۆ بۆ Supabase Dashboard
   - Logs → API Logs
   - چێک بکە errors

3. **Vercel Logs:**
   - بچۆ بۆ Vercel Dashboard
   - Deployments → Latest → Functions Logs
   - چێک بکە errors

---

### تێبینی گرنگ

- Short URLs تەنها کاتێک دروست دەبن کە لینک کۆپی دەکەیت
- ئەگەر لینکێک کۆپی نەکردبیت، short URL نییە
- هەر slug+locale یەک short URL دروست دەکات (ئەگەر پێشتر دروست بووبێت، هەمان code بەکاردەهێنێت)

