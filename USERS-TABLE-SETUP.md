# دامەزراندنی خشتەی بەکارهێنەران | Users Table Setup

## کێشە
ئەگەر ئەم error-ەت دەبینیت:
```
Could not find the table 'public.users' in the schema cache
```

واتای ئەمەیە خشتەی `users` لە دەیتابەیسدا دروست نەکراوە.

## چارەسەر

### هەنگاو 1: بچۆ بۆ Supabase Dashboard
1. بچۆ بۆ [Supabase Dashboard](https://supabase.com/dashboard)
2. Project-ەکەت هەڵبژێرە
3. لە لای چەپ، کلیک لە **SQL Editor** بکە

### هەنگاو 2: SQL کۆد بنووسە
لە SQL Editor، ئەم SQL کۆدە بنووسە:

```sql
-- Create users table for admin user management
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can manage users
CREATE POLICY "Service role can manage users" ON users
  FOR ALL
  USING (auth.role() = 'service_role');
```

### هەنگاو 3: SQL جێبەجێ بکە
1. کلیک لە **Run** بکە (یان Ctrl+Enter)
2. چاوەڕوان بکە تا SQL جێبەجێ بێت
3. ئەگەر error نەبوو، خشتەکە دروست بووە

### هەنگاو 4: تاقیکردنەوە
1. بگەڕێوە بۆ admin panel
2. هەوڵ بدە بەکارهێنەرێکی نوێ دروست بکەیت
3. ئێستا دەبێت کار بکات

## تێبینی گرنگ

### RLS (Row Level Security)
- خشتەی `users` RLS چالاکە
- تەنها **service role** دەتوانێت بەکارهێنەر زیاد/دەستکاری/سڕێتەوە
- ئەمەش بەهۆی API routes-ەکانەوەیە کە service role key بەکاردەهێنن

### Password Hashing
- Passwords بە bcrypt hash دەکرێن
- لە production، هەرگیز plain text password مەنووسە

## کێشەکان

### ئەگەر هێشتا error دەبینیت:
1. چێک بکە SQL بە دروستی جێبەجێ کرا
2. چێک بکە service role key لە `.env.local` هەیە
3. چێک بکە API routes دروست کار دەکەن

### ئەگەر "permission denied" دەبینیت:
- دڵنیابە کە service role key دروستە
- دڵنیابە کە RLS policy دروستە

