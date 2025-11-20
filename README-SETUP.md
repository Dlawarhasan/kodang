# Setup Guide - Backend System

## 1. Supabase Setup

### Create Supabase Project
1. بچۆ بۆ [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. "New Project" کلیک بکە
4. ناوی project بنووسە (نموونە: `kodang-news`)
5. Database password هەڵبژێرە
6. Region هەڵبژێرە (نزیکترین)
7. "Create new project" کلیک بکە

### Get API Keys
1. لە Supabase Dashboard → Settings → API
2. ئەم keyانە کۆپی بکە:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Secret - تەنها لە server بەکاربهێنە)

### Setup Database
1. لە Supabase Dashboard → SQL Editor
2. فایلی `supabase-setup.sql` بکەوە
3. هەموو SQL کۆدی کۆپی بکە و لە SQL Editor paste بکە
4. "Run" کلیک بکە

### Setup Storage
1. لە Supabase Dashboard → Storage
2. "Create bucket" کلیک بکە
3. ناوی bucket: `images`
4. Public bucket: ✅ (تیک بکە)
5. "Create bucket" کلیک بکە

## 2. Environment Variables

1. فایلی `.env.local` دروست بکە لە root directory
2. ئەم variablesانە زیاد بکە:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Update News Functions

دەبێت فایلەکانی `lib/news.ts` بگۆڕیت بۆ بەکارهێنانی API لە جیاتی static data.

## 5. Test

```bash
npm run dev
```

بچۆ بۆ `http://localhost:3000/ku/admin` و پۆستێکی test زیاد بکە.

## 6. Deploy to Vercel

1. لە Vercel → Project Settings → Environment Variables
2. هەموو environment variables زیاد بکە
3. Redeploy بکە

---

**تێبینی:** Service Role Key زۆر گرنگە - هەرگیز لە client-side بەکارمەهێنە!

