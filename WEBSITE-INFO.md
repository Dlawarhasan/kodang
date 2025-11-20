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

## 💰 Costs (نرخ) & Limits (سنوورەکان)

### ✅ Free Tier (فری - بەهەتاهەتایە):

#### **Vercel Free Plan**:
- ✅ **بەهەتاهەتایە فرییە** (هەتاهەتایە)
- ✅ **Unlimited Projects**: ژمارەیەکی بێسنووری پڕۆژە
- ✅ **100GB Bandwidth/month**: 100 گیگابایت باندوێید لە مانگێکدا
- ✅ **Unlimited Requests**: ژمارەیەکی بێسنووری request
- ✅ **Automatic HTTPS**: خۆکار SSL certificate
- ✅ **Custom Domain**: دۆمەینی تایبەت (فری)
- ⚠️ **Build Time**: 45 hours/month (بۆ پڕۆژەی بچووک بەسە)

#### **Supabase Free Plan**:
- ✅ **بەهەتاهەتایە فرییە** (هەتاهەتایە)
- ✅ **500MB Database**: 500 مێگابایت دەیتابەیس
- ✅ **1GB File Storage**: 1 گیگابایت storage بۆ وێنە/ڤیدیۆ/ئۆدیۆ
- ✅ **2GB Bandwidth/month**: 2 گیگابایت باندوێید لە مانگێکدا
- ✅ **50,000 Monthly Active Users**: 50,000 بەکارهێنەری چالاک لە مانگێکدا
- ✅ **Unlimited API Requests**: ژمارەیەکی بێسنووری API request
- ✅ **500MB Database Size**: 500 مێگابایت قەبارەی دەیتابەیس
- ⚠️ **7 Days Backup Retention**: 7 ڕۆژ backup

### 📊 چەند پۆست دەتوانیت ڕۆژانە بکەیت؟

#### **بەپێی Database Size**:
- **هەر پۆستێک**: ~5-10KB (بەپێی ناوەڕۆک)
- **500MB Database**: ~50,000 - 100,000 پۆست
- **ڕۆژانە**: **بێسنوور** (بەپێی database size)

#### **بەپێی Storage**:
- **وێنە**: ~500KB - 2MB (بەپێی قەبارە)
- **1GB Storage**: ~500 - 2,000 وێنە
- **ڕۆژانە**: **~16 - 66 وێنە** (ئەگەر 1GB بەکاربهێنیت)

#### **بەپێی Bandwidth**:
- **2GB/month Supabase**: ~66MB/day
- **100GB/month Vercel**: ~3.3GB/day
- **ڕۆژانە**: **بێسنوور** (بەپێی bandwidth)

### 💡 Recommendation (پێشنیار):

#### **بۆ پڕۆژەی بچووک-ناوەند**:
- ✅ **Free Tier بەسە**: 0$/month
- ✅ **~50-100 پۆست/ڕۆژ**: بەبێ کێشە
- ✅ **~500-1,000 وێنە**: بەبێ کێشە

#### **ئەگەر پێویستت بە زیاترە**:
- **Supabase Pro**: $25/month
  - 8GB database
  - 100GB storage
  - 50GB bandwidth
- **Vercel Pro**: $20/month
  - 1TB bandwidth
  - Better performance
  - Priority support

### 📈 Usage Tracking (چێککردنی بەکارهێنان):

#### **Supabase**:
1. بچۆ بۆ [Supabase Dashboard](https://supabase.com/dashboard)
2. Project هەڵبژێرە
3. Settings → Usage → ببینیت چەنێک بەکارهاتووە

#### **Vercel**:
1. بچۆ بۆ [Vercel Dashboard](https://vercel.com/dashboard)
2. Project هەڵبژێرە
3. Analytics → ببینیت bandwidth usage

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

