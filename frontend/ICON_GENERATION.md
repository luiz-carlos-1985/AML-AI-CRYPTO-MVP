# Generate App Icon

## Quick Method (Recommended)

### Option 1: Use Online Tool
1. Go to https://icon.kitchen
2. Upload `resources/icon.svg`
3. Select "Capacitor" as platform
4. Download and extract to project root
5. Icons will be automatically placed in correct folders

### Option 2: Use Capacitor Assets CLI
```bash
# Install
npm install -g @capacitor/assets

# Convert SVG to PNG first (use any tool or online converter)
# Save as resources/icon.png (1024x1024)

# Generate all sizes
npx capacitor-assets generate --iconBackgroundColor '#111827' --splashBackgroundColor '#111827'
```

### Option 3: Manual Conversion
Use any of these tools to convert SVG to PNG:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com
- Photoshop/GIMP/Inkscape

Save as: `resources/icon.png` (1024x1024px)

## Current Icon Design

The icon features:
- Dark background (#111827) matching app theme
- Shield symbol representing security
- Checkmark indicating verification
- "AML" text for brand recognition
- Emerald green accent (#10b981) matching brand color

## Next Steps

After generating icon:
```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

## Icon Requirements by Platform

- **iOS**: 1024x1024, no transparency, PNG
- **Android**: 512x512, can have transparency, PNG
- **PWA**: 512x512, SVG or PNG
- **Windows**: 256x256, ICO format
- **Mac**: 1024x1024, PNG

The Capacitor Assets tool will generate all required sizes automatically.
