# App Icons and Splash Screens

## Required Assets

### App Icon (icon.png)
- Size: 1024x1024px
- Format: PNG
- No transparency for iOS
- Will be automatically resized for all platforms

### Splash Screen (splash.png)
- Size: 2732x2732px
- Format: PNG
- Center content in safe area (1200x1200px)
- Background: #111827 (dark theme)

## Generate Icons

Use Capacitor's asset generator:
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#111827' --splashBackgroundColor '#111827'
```

Or use online tools:
- https://icon.kitchen
- https://appicon.co
- https://makeappicon.com

## Icon Design Guidelines

### iOS
- No transparency
- Rounded corners applied automatically
- Simple, recognizable at small sizes
- Avoid text (except logo)

### Android
- Can have transparency
- Adaptive icon (foreground + background)
- Material Design guidelines

### Design Suggestions
1. Shield with "AML" text
2. Crypto coin with checkmark
3. Lock with blockchain symbol
4. Graph with security badge
