# 📱 Store Submission Checklist

## ✅ Pre-Deployment Setup (COMPLETE)

- [x] Capacitor installed and configured
- [x] Privacy Policy created (public/privacy-policy.html)
- [x] Terms of Service created (public/terms-of-service.html)
- [x] HTTPS-only configuration
- [x] PWA configured with service workers
- [x] Deployment scripts added to package.json
- [x] App Store deployment guide created

## 📋 Before First Submission

### 1. Create App Icons
```bash
# Place 1024x1024 icon.png in resources/ folder
# Then run:
npm install -g @capacitor/assets
npx capacitor-assets generate
```

### 2. Update App Information
Edit `capacitor.config.ts`:
- [ ] Update `appId` to your actual bundle ID
- [ ] Update `server.hostname` to your production domain
- [ ] Update `App.launchUrl` to your production URL

### 3. Build Production App
```bash
npm run build
```

### 4. iOS Submission

#### Setup
- [ ] Apple Developer Account ($99/year)
- [ ] Xcode 15+ installed
- [ ] Certificates and provisioning profiles created

#### Build
```bash
npm run build:ios
```

#### In Xcode
- [ ] Set Team and Bundle ID
- [ ] Add app icons (1024x1024)
- [ ] Add launch screens
- [ ] Set deployment target (iOS 13+)
- [ ] Configure Info.plist permissions
- [ ] Archive and validate
- [ ] Upload to App Store Connect

#### App Store Connect
- [ ] Create new app
- [ ] Fill metadata (name, description, keywords)
- [ ] Add screenshots (6.7", 6.5", 5.5")
- [ ] Set Privacy Policy URL: https://yourdomain.com/privacy-policy.html
- [ ] Set Support URL: https://yourdomain.com/support
- [ ] Set age rating: 17+
- [ ] Provide test account
- [ ] Submit for review

### 5. Android Submission

#### Setup
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Android Studio installed

#### Build
```bash
npm run build:android
```

#### In Android Studio
- [ ] Update versionCode and versionName
- [ ] Generate signed AAB
- [ ] Test on real device

#### Google Play Console
- [ ] Create new app
- [ ] Fill store listing
- [ ] Add screenshots (phone, tablet)
- [ ] Set Privacy Policy URL
- [ ] Complete content rating
- [ ] Set pricing (Free with IAP)
- [ ] Submit for review

### 6. Windows Store (Optional)

#### Setup
- [ ] Microsoft Partner Center account ($19/year)
- [ ] Install electron and electron-builder

```bash
npm install --save-dev electron electron-builder
npm run build:win
```

#### Partner Center
- [ ] Create new app
- [ ] Upload MSIX package
- [ ] Fill metadata
- [ ] Submit for review

### 7. Mac App Store (Optional)

```bash
npm run build:mac
```

- [ ] Sign with Mac App Store certificate
- [ ] Enable sandboxing
- [ ] Upload to App Store Connect

### 8. Linux (Optional)

#### Snap Store
```bash
snapcraft
snapcraft upload cryptoaml_1.0.0_amd64.snap --release=stable
```

#### Flathub
- [ ] Create flatpak manifest
- [ ] Submit PR to flathub/flathub

## 🔐 Security Checklist

- [x] HTTPS-only connections
- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] Rate limiting
- [x] Input validation
- [x] XSS protection
- [x] CSRF protection
- [x] SQL injection prevention
- [ ] Certificate pinning (add if needed)
- [ ] Biometric authentication (add if needed)

## 📝 Required URLs (UPDATE THESE!)

Replace with your actual URLs:
- Privacy Policy: https://app.cryptoaml.com/privacy-policy.html
- Terms of Service: https://app.cryptoaml.com/terms-of-service.html
- Support: https://app.cryptoaml.com/support
- Website: https://cryptoaml.com

## 🎨 Required Assets

### Icons
- [ ] 1024x1024 app icon (PNG, no transparency for iOS)
- [ ] 512x512 Android icon
- [ ] Favicon (32x32, 16x16)

### Screenshots
- [ ] iOS: 6.7" (1290x2796), 6.5" (1242x2688), 5.5" (1242x2208)
- [ ] Android: Phone (1080x1920), 7" tablet, 10" tablet
- [ ] Windows: 1366x768, 1920x1080
- [ ] Feature graphic (Google Play): 1024x500

### Splash Screens
- [ ] 2732x2732 universal splash screen

## 📄 Store Descriptions

### Short (80 chars)
"AI-powered cryptocurrency AML monitoring for compliance and risk management"

### Keywords
cryptoaml, aml, anti-money laundering, cryptocurrency, blockchain, compliance, risk analysis, bitcoin, ethereum, crypto monitoring

### Category
Finance

### Age Rating
- iOS: 17+ (Financial Services)
- Android: ESRB Everyone
- Windows: ESRB 17+

## 🧪 Testing Checklist

Before submission, test:
- [ ] App launches successfully
- [ ] Login/Register works
- [ ] All pages load correctly
- [ ] Payment flows work
- [ ] Offline mode works (PWA)
- [ ] Push notifications (if implemented)
- [ ] Deep linking works
- [ ] No crashes or memory leaks
- [ ] Works on different screen sizes
- [ ] Works on slow network
- [ ] Privacy policy link works
- [ ] Terms of service link works
- [ ] Support link works

## 📞 Support Information

Provide for reviewers:
- [ ] Test account email
- [ ] Test account password
- [ ] Demo video (optional but helpful)
- [ ] Contact email for review team
- [ ] Phone number for urgent issues

## 🚀 Deployment Commands

```bash
# Build web app
npm run build

# iOS
npm run build:ios

# Android
npm run build:android

# Sync changes to mobile platforms
npm run sync:ios
npm run sync:android

# Open in IDE
npm run open:ios
npm run open:android
```

## 📊 Post-Launch

After approval:
- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Track analytics
- [ ] Plan regular updates
- [ ] Optimize store listings (ASO)

## 🔄 Update Process

For future updates:
1. Update version in package.json
2. Update versionCode/versionName (Android)
3. Update CFBundleVersion (iOS)
4. Build and test
5. Submit update to stores
6. Use phased rollout (10% → 50% → 100%)

## 📚 Documentation

Full guide: See `APP_STORE_DEPLOYMENT.md`

## ⚠️ Important Notes

1. **Privacy Policy & Terms MUST be publicly accessible** before submission
2. **Test accounts** required for iOS review
3. **Real device testing** mandatory before submission
4. **App size** should be < 200MB for better downloads
5. **First review** takes 1-7 days (iOS), 1-3 days (Android)
6. **Rejections are common** - address feedback and resubmit
7. **Keep app updated** - stores favor actively maintained apps

## 🎯 Success Criteria

Your app is ready when:
- ✅ All checklist items completed
- ✅ Tested on real devices
- ✅ No crashes or critical bugs
- ✅ Privacy policy accessible
- ✅ Screenshots look professional
- ✅ Description is clear and accurate
- ✅ Test account provided
- ✅ All links work

---

**Next Steps:**
1. Create app icons (resources/icon.png)
2. Update URLs in capacitor.config.ts
3. Run `npm run build:ios` or `npm run build:android`
4. Follow platform-specific steps above
5. Submit to stores!

Good luck! 🚀
