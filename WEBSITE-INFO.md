# زانیاری وێبسایت | Website Information

## 📦 Storage (Supabase)

### Storage Buckets:
- **images** - بۆ وێنەکان (50MB limit per file)
- **videos** - بۆ ڤیدیۆکان (100MB limit per file)
- **audio** - بۆ ڤۆیس/ئۆدیۆکان (50MB limit per file)

### Storage Location:
- **Supabase Storage**: `https://mllmvvxjkuiihaekswpd.supabase.co/storage/v1/object/public/`
- **Total Storage**: بەپێی پلانی Supabase (Free plan: 1GB, Pro: 100GB+)

### چۆن بزانیت چەنێک storage بەکارهاتووە:
1. بچۆ بۆ [Supabase Dashboard](https://supabase.com/dashboard)
2. Project هەڵبژێرە
3. Storage → ببینیت چەنێک storage بەکارهاتووە

---

## 🔒 Security (ئاسایش)

### Authentication:
- **Service Role Key**: بەکاردێت لە server-side بۆ admin operations
- **Anon Key**: بەکاردێت لە client-side بۆ public access

### Database Security (RLS):
- ✅ **Row Level Security (RLS)** چالاکە
- ✅ **Public Read Access**: هەموو کەس دەتوانێت پۆست بخوێنێتەوە
- ✅ **Admin Only Write**: تەنها service role دەتوانێت پۆست زیاد/دەستکاری/سڕێتەوە

### API Security:
- ✅ **Server-side API Routes**: هەموو admin operations لە server-side
- ✅ **Environment Variables**: Keys لە `.env.local` دا (نابێت commit بکرێن)
- ✅ **CORS Protection**: Next.js خۆکار CORS handle دەکات

### Storage Security:
- ✅ **Public Buckets**: وێنە/ڤیدیۆ/ئۆدیۆ بۆ public access
- ✅ **Upload Policies**: تەنها service role دەتوانێت upload بکات
- ✅ **File Type Validation**: تەنها file types دیاریکراو قبوڵ دەکرێن

---

## 🌐 Domain (دۆمەین)

### Development (گەشەپێدان):
- **URL**: `http://localhost:3000`
- **Status**: ✅ کار دەکات

### Production (بەکارهێنان):
- **Status**: ⚠️ هێشتا configure نەکراوە
- **Options**:
  1. **Vercel** (Recommended):
     - بچۆ بۆ [vercel.com](https://vercel.com)
     - Project connect بکە بە GitHub
     - Domain زیاد بکە (یان Vercel subdomain بەکاربهێنە)
  
  2. **Custom Domain**:
     - Domain بکڕە (نموونە: GoDaddy, Namecheap)
     - لە Vercel → Project Settings → Domains
     - Domain زیاد بکە
     - DNS settings configure بکە

### Current Setup:
- **Supabase URL**: `https://mllmvvxjkuiihaekswpd.supabase.co`
- **GitHub**: (ئەگەر push کردیت)

---

## 📊 Database (دەیتابەیس)

### Supabase Database:
- **Provider**: Supabase (PostgreSQL)
- **Location**: بەپێی region هەڵبژێردراو
- **Backup**: خۆکار backup (Supabase Free plan: 7 days)

### Tables:
- **news**: پۆستەکان
  - Columns: id, slug, date, author, category, image, video, audio, tags, translations, etc.

---

## 🚀 Deployment (بڵاوکردنەوە)

### Steps to Deploy:
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - بچۆ بۆ [vercel.com](https://vercel.com)
   - "New Project" کلیک بکە
   - GitHub repository connect بکە
   - Environment Variables زیاد بکە:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - "Deploy" کلیک بکە

3. **Add Custom Domain** (Optional):
   - لە Vercel → Project Settings → Domains
   - Domain زیاد بکە
   - DNS records configure بکە

---

## 💰 Costs (نرخ)

### Free Tier:
- **Supabase Free**: 500MB database, 1GB storage, 2GB bandwidth
- **Vercel Free**: Unlimited bandwidth, 100GB bandwidth/month
- **Total**: $0/month (بۆ پڕۆژەی بچووک)

### If You Need More:
- **Supabase Pro**: $25/month (8GB database, 100GB storage)
- **Vercel Pro**: $20/month (100GB bandwidth, better performance)

---

## 📝 Notes (تێبینیەکان)

1. **Environment Variables**: هەرگیز `.env.local` commit مەکە بۆ GitHub
2. **Service Role Key**: زۆر گرنگە - هەرگیز لە client-side بەکارمەهێنە
3. **Storage Limits**: چاو لە storage usage بکە لە Supabase Dashboard
4. **Backup**: Supabase خۆکار backup دەکات بەڵام دەتوانیت manual backup بکەیت

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub**: (ئەگەر repository هەیە)

