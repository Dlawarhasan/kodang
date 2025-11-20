# چۆن کۆد push بکەیت بۆ GitHub

## کێشەکە:
GitHub password authentication ناکات. پێویستە **Personal Access Token** بەکاربهێنیت.

---

## چارەسەر 1️⃣: Personal Access Token دروست بکە

### هەنگاوەکان:

1. **بچۆ بۆ GitHub:**
   - بچۆ بۆ [github.com/settings/tokens](https://github.com/settings/tokens)
   - Sign in بکە

2. **Token دروست بکە:**
   - "Generate new token" → "Generate new token (classic)" کلیک بکە
   - Note: `kodang-news-push` بنووسە
   - Expiration: `90 days` (یان هەرچی دەتەوێت)
   - Scopes: `repo` چێک بکە
   - "Generate token" کلیک بکە

3. **Token کۆپی بکە:**
   - ⚠️ **گرنگ**: تەنها یەک جار دەرکەوێت! کۆپی بکە

---

## چارەسەر 2️⃣: لە Terminal Push بکە

```bash
git push origin main
```

کاتێک username داوە:
- Username: `dlawarhasan`
- Password: (Token کۆپی کردووت بکە لێرە)

---

## چارەسەر 3️⃣: لە Cursor/VS Code Push بکە (ئاسانتر)

1. Source Control panel (Cmd+Shift+G)
2. "..." → "Push" کلیک بکە
3. کاتێک username داوە: `dlawarhasan`
4. کاتێک password داوە: **Token** بنووسە (نەک password)

---

## چارەسەر 4️⃣: SSH Key Setup (بۆ داهاتوو)

ئەگەر دەتەوێت هەر جارێک password نەنووسیت:
1. SSH key دروست بکە
2. لە GitHub → Settings → SSH Keys زیاد بکە
3. Git remote بگۆڕە بۆ SSH

---

**ئایا Personal Access Token دروستت کرد؟** پاشان push بکە!

