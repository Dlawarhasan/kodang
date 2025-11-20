# 🚀 چۆن وێبسایتەکەت بکەیت بە Live

## هەنگاو 1️⃣: Commit و Push بکە بۆ GitHub

```bash
# هەموو فایلەکان زیاد بکە
git add .

# Commit بکە
git commit -m "Ready for deployment"

# Push بکە بۆ GitHub
git push origin main
```

---

## هەنگاو 2️⃣: لە Vercel Project دروست بکە

### ئەگەر لە Vercel project نییە:
1. بچۆ بۆ [vercel.com](https://vercel.com)
2. Sign in بکە
3. "Add New..." → "Project" کلیک بکە
4. GitHub repository هەڵبژێرە (kodang-news)
5. "Import" کلیک بکە

### ئەگەر لە Vercel project هەیە:
1. بچۆ بۆ Vercel Dashboard
2. Project هەڵبژێرە

---

## هەنگاو 3️⃣: Environment Variables زیاد بکە

لە Vercel → Project → Settings → Environment Variables:

### زیاد بکە:

```
NEXT_PUBLIC_SUPABASE_URL
```
- Value: `https://mllmvvxjkuiihaekswpd.supabase.co`

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
- Value: (لە Supabase → Settings → API → anon public key)

```
SUPABASE_SERVICE_ROLE_KEY
```
- Value: (لە Supabase → Settings → API → service_role key)
- ⚠️ **گرنگ**: ئەم key-ە secret-ە!

### بۆ Production, Preview, Development:
- هەموو environment variables-ەکان بۆ Production, Preview, Development چێک بکە

---

## هەنگاو 4️⃣: Deploy بکە

### ئۆتۆماتیک:
- کاتێک `git push` دەکەیت، Vercel خۆکار deploy دەکات

### یان دەستکرد:
1. لە Vercel Dashboard → Project
2. "Deployments" tab
3. "Redeploy" کلیک بکە

---

## هەنگاو 5️⃣: Domain بەستن

### ئەگەر domain زیادت کرد (kodang.news):
1. لە Vercel → Project → Settings → Domains
2. `kodang.news` هەڵبژێرە
3. DNS Records کۆپی بکە
4. لە GoDaddy → DNS Management → زیاد بکە
5. 5-30 خولەک چاوەڕێ بکە
6. "Refresh" کلیک بکە لە Vercel

---

## ✅ تاقی بکەوە

پاش deploy:
- بچۆ بۆ `https://kodang.vercel.app` (یان domain-ەکەت)
- بچۆ بۆ `/ku/admin` بۆ admin panel

---

## 🐛 ئەگەر کێشە هەبوو:

### Build Error:
- Environment variables چێک بکە
- `npm run build` لە local تاقی بکەوە

### API Error:
- Supabase keys چێک بکە
- Supabase RLS policies چێک بکە

### Domain Error:
- DNS records چێک بکە
- Propagation time چاوەڕێ بکە (تا 48 کاتژمێر)

