# Google reCAPTCHA v3 Setup Guide

## What I've Implemented

I've added Google reCAPTCHA v3 to your login form. This protection:
- Works invisibly in the background (no user interaction needed)
- Scores each interaction on a scale of 0.0 to 1.0
- Rejects obvious bots while allowing legitimate users through

## Setup Steps

### 1. Get Your reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account (create one if needed)
3. Click **"Create +"** or **"+"** button to create a new site
4. Fill in the form:
   - **Label**: UMERCH (or your preferred name)
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domain(s):
     - `localhost` (for local development)
     - `your-domain.com` (for production)
   - Accept the terms and click **Create**

5. You'll receive two keys:
   - **Site Key** (public key)
   - **Secret Key** (private key)

### 2. Add Keys to `.env`

Open `.env` in your project root and update these lines:

```env
VITE_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY_HERE
RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY_HERE
```

Replace `YOUR_SITE_KEY_HERE` and `YOUR_SECRET_KEY_HERE` with the actual keys from Google.

### 3. Files Modified

The following files have been updated to support reCAPTCHA:

1. **Backend:**
   - `app/Http/Controllers/UsersideControllers/LoginControllers/LoginCont.php` - Added reCAPTCHA verification
   - `config/recaptcha.php` - New config file with reCAPTCHA settings

2. **Frontend:**
   - `resources/js/components/ui/Knowledge.jsx` - Added reCAPTCHA script and token handling

3. **Configuration:**
   - `.env` - Added reCAPTCHA keys
   - `composer.json` - Added `google/recaptcha` package

### 4. How It Works

**Frontend (React):**
- When the page loads, the reCAPTCHA script is loaded from Google
- When the user submits the login form, a reCAPTCHA token is generated
- The token is sent to the backend with login credentials

**Backend (Laravel):**
- The token is validated using the Google reCAPTCHA API
- If the score is above the threshold (0.5 by default), login proceeds
- Otherwise, login is rejected with a reCAPTCHA error

### 5. Configuration Options

You can adjust the reCAPTCHA threshold in `config/recaptcha.php`:

```php
'threshold' => 0.5, // 0.0 (definitely bot) to 1.0 (definitely human)
```

**Recommended thresholds:**
- `0.9` - Very permissive (only block obvious bots)
- `0.5` - Balanced (default)
- `0.3` - Strict (may block some legitimate users)

### 6. Testing

After setting up:
1. Clear your application cache: `php artisan config:clear`
2. Test the login form
3. You should see the reCAPTCHA badge in the bottom-right corner
4. Legitimate logins should work without interruption

### 7. Troubleshooting

**Issue: "reCAPTCHA verification failed"**
- Check that your Site Key is correct in `.env`
- Verify the domain in Google Admin Console matches your site
- Clear the config cache: `php artisan config:clear`

**Issue: Keys not loading**
- Restart your Laravel server
- Restart your frontend dev server (if using `npm run dev`)
- Check that `.env` changes are saved

**Issue: Still seeing placeholder text on login**
- Make sure both keys are properly set in `.env`
- Check browser console for JavaScript errors

### 8. Production Deployment

Before going live:
1. Add your production domain to Google reCAPTCHA Admin Console
2. Update `.env` on your production server with the production keys
3. Test login on production before releasing

### 9. Package Installed

```
google/recaptcha ^1.3.1
```

This package handles the verification of reCAPTCHA tokens on the backend.

---

**Need help?** Check the Google reCAPTCHA documentation: https://developers.google.com/recaptcha/docs/v3
