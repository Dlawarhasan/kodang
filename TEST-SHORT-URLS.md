# Test Short URL System

## 🔍 هەنگاوەکانی تاقیکردنەوە

### هەنگاو 1: Diagnostic Endpoint

بچۆ بۆ:
```
https://kodang.news/api/shorten/diagnose
```

ئەمە دەڵێت:
- ✅ Environment variables هەن یان نا
- ✅ Table هەیە یان نا
- ✅ Can read/write
- ✅ چەند record هەیە
- ✅ Sample records
- ✅ هەموو errors

---

### هەنگاو 2: Test Endpoint

بچۆ بۆ:
```
https://kodang.news/api/shorten/test
```

ئەمە دەڵێت:
- ✅ Table exists
- ✅ Total short URLs
- ✅ Sample URLs

---

### هەنگاو 3: Test Script

Run بکە:
```bash
node test-short-urls.js
```

ئەمە:
- ✅ Diagnostic endpoint test دەکات
- ✅ Test endpoint test دەکات
- ✅ Short URL creation test دەکات
- ✅ Short URL resolution test دەکات

---

### هەنگاو 4: Browser Console

1. بچۆ بۆ پۆستێک
2. F12 بکە (Browser Console)
3. Console tab بکەرەوە
4. کلیک لە "کۆپی لینک" بکە
5. چێک بکە logs:
   ```
   Fetching short URL from: ...
   Short URL created successfully: ...
   ```

---

### هەنگاو 5: Network Tab

1. F12 بکە
2. Network tab بکەرەوە
3. کلیک لە "کۆپی لینک" بکە
4. چێک بکە `/api/shorten` request:
   - Status: 200
   - Response: `{ "shortUrl": "...", "code": "..." }`

---

## 📋 Checklist

- [ ] Diagnostic endpoint کار دەکات
- [ ] Test endpoint کار دەکات
- [ ] Table هەیە (tableExists: true)
- [ ] Can read (canRead: true)
- [ ] Can write (canWrite: true)
- [ ] Short URL creation کار دەکات
- [ ] Short URL resolution کار دەکات
- [ ] Console logs پیشان دەدات
- [ ] Network request successful

---

## 🐛 ئەگەر کێشە هەبوو

### Table نەدۆزرایەوە
**Error:** `tableExists: false`
**چارەسەر:**
1. بچۆ بۆ Supabase SQL Editor
2. فایلی `supabase-create-short-urls-table.sql` run بکە

### Cannot Read
**Error:** `canRead: false`
**چارەسەر:**
- RLS policies چێک بکە
- SQL script دوبارە run بکە

### Cannot Write
**Error:** `canWrite: false`
**چارەسەر:**
- Service role key چێک بکە
- RLS policies چێک بکە

---

## 📝 Notes

- Diagnostic endpoint هەموو شتێک چێک دەکات
- Test script automatic test دەکات
- Browser console logs پیشان دەدات
- Network tab API calls پیشان دەدات

