# Setup Environment Variables

## چۆن Supabase Keys بەدەست بهێنیت:

### 1. بچۆ بۆ Supabase
- بچۆ بۆ [supabase.com](https://supabase.com)
- Sign in بکە
- Project هەڵبژێرە (یان دروستی بکە)

### 2. بگەڕێ بۆ Settings → API
- لە left sidebar → Settings کلیک بکە
- API کلیک بکە

### 3. Keys کۆپی بکە
لە فایلی `.env.local` دا ئەم valuesانە پڕ بکە:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```
- لە Supabase → `Project URL` کۆپی بکە

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```
- لە Supabase → `anon public` key کۆپی بکە

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```
- لە Supabase → `service_role` key کۆپی بکە
- ⚠️ **گرنگ**: ئەم key-ە secret-ە! هەرگیز لە client-side بەکارمەهێنە!

### 4. Admin Credentials زیاد بکە (بۆ چوونەژوورەوەی Admin Panel)

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```
- ⚠️ **گرنگ**: Password-ەکەت بەهێز بنووسە! (کمتر لە 8 پیت نەبێت)

### 5. فایلی `.env.local` پڕ بکە
فایلی `.env.local` بکەوە و values زیاد بکە:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### 6. Dev Server Restart بکە
```bash
npm run dev
```

### 7. تاقی بکەوە
بچۆ بۆ `http://localhost:3000/ku/admin`
- Login page دەرکەوێت
- Username و Password بنووسە (لە `.env.local` دا دیاری کردووت)

---

**ئەگەر Supabase project نییە:**
1. بچۆ بۆ [supabase.com](https://supabase.com)
2. "New Project" کلیک بکە
3. ناوی project بنووسە
4. Database password هەڵبژێرە
5. "Create new project" کلیک بکە
6. چاوەڕێ بکە تا project ready بێت (2-3 خولەک)
7. پاشان بگەڕێ بۆ step 2

