# Google Search Console Setup Guide

## ✅ Current Setup Status

### 1. Meta Tag Verification (HTML Tag Method) ✅
- **Status:** Configured and Active
- **Location:** `app/[locale]/layout.tsx`
- **Meta Tag:** `<meta name="google-site-verification" content="Pcg4d5GxxOVKeX0wsDDicp0xbebGwrLXHok2MjJeAtE"/>`
- **Accessible at:** All pages (https://kodang.news/fa, https://kodang.news/ku, https://kodang.news/en)

### 2. HTML File Verification ✅
- **Status:** Configured and Active
- **Location:** `app/google6df8cc884e12b968.html/route.ts`
- **URL:** https://kodang.news/google6df8cc884e12b968.html
- **Content:** `google-site-verification: google6df8cc884e12b968.html`

### 3. Sitemap ✅
- **Status:** Configured and Active
- **URL:** https://kodang.news/sitemap.xml
- **Location:** `app/sitemap.ts`

### 4. Robots.txt ✅
- **Status:** Configured and Active
- **URL:** https://kodang.news/robots.txt
- **Location:** `app/robots.ts`

---

## 📋 Verification Steps

### Method 1: HTML Tag (Recommended - Easiest) ✅

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click on "Add Property" or select your property
3. Choose **"HTML tag"** as verification method
4. Copy the verification code: `Pcg4d5GxxOVKeX0wsDDicp0xbebGwrLXHok2MjJeAtE`
5. Click **"Verify"**
6. ✅ Verification should succeed immediately (meta tag is already in the HTML)

### Method 2: HTML File

1. Go to Google Search Console
2. Choose **"HTML file"** as verification method
3. The file is already available at: `https://kodang.news/google6df8cc884e12b968.html`
4. Click **"Verify"**
5. ✅ Verification should succeed

### Method 3: Domain Name Provider (DNS)

If you want to verify using DNS:

1. Go to Google Search Console
2. Choose **"Domain name provider"** as verification method
3. Google will provide you with a TXT record to add
4. Go to your DNS provider (where you manage kodang.news domain):
   - **Cloudflare**: DNS → Records → Add Record
   - **Namecheap**: Domain List → Manage → Advanced DNS
   - **GoDaddy**: DNS Management → Records
   - **Other providers**: Look for DNS/DNS Management section

5. Add a TXT record:
   - **Type:** `TXT`
   - **Name/Host:** `@` or leave blank (for root domain)
   - **Value:** The verification code Google provides
   - **TTL:** `3600` or default
   - **Save** the record

6. Wait for DNS propagation (5 minutes to 48 hours, usually 15-30 minutes)
7. Go back to Google Search Console and click **"Verify"**

---

## 🚀 After Verification

Once verified, you should:

1. **Submit Sitemap:**
   - Go to Sitemaps section in Search Console
   - Add: `https://kodang.news/sitemap.xml`
   - Click "Submit"

2. **Request Indexing:**
   - Go to URL Inspection tool
   - Enter your homepage: `https://kodang.news/fa`
   - Click "Request Indexing"

3. **Monitor Performance:**
   - Check Coverage report for indexing status
   - Monitor Search Performance for impressions and clicks
   - Check for any errors or warnings

---

## 🔍 Testing Verification

### Test Meta Tag:
```bash
curl -s https://kodang.news/fa | grep "google-site-verification"
```

### Test HTML File:
```bash
curl -s https://kodang.news/google6df8cc884e12b968.html
```

### Test Sitemap:
```bash
curl -s https://kodang.news/sitemap.xml | head -20
```

### Test Robots.txt:
```bash
curl -s https://kodang.news/robots.txt
```

---

## 📝 Notes

- Meta tag method is the easiest and works immediately
- HTML file method is also configured and ready
- DNS method requires access to your domain's DNS settings
- All verification methods are already set up in the codebase
- Sitemap includes all news articles in all three languages (fa, ku, en)
- Robots.txt allows all search engines to crawl the site

---

## ❓ Troubleshooting

### If verification fails:

1. **Meta Tag Method:**
   - Check if meta tag appears in page source
   - Make sure deployment is complete
   - Clear browser cache and try again

2. **HTML File Method:**
   - Verify file is accessible: `https://kodang.news/google6df8cc884e12b968.html`
   - Check file content matches exactly

3. **DNS Method:**
   - Verify TXT record is added correctly
   - Wait for DNS propagation (can take up to 48 hours)
   - Use DNS checker tools to verify record is live
   - Make sure you're adding record to root domain (@) not subdomain

---

## ✅ Current Status

All verification methods are configured and ready. You can use any of the three methods:
- ✅ HTML Tag (Meta Tag) - Recommended
- ✅ HTML File
- ✅ DNS (requires DNS access)

Choose the method that's easiest for you!

