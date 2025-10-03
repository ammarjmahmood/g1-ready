# Assets Directory

This directory contains all the static assets for the G1 Ready app.

## Structure

```
assets/
├── fonts/                  # Custom fonts
│   ├── Poppins-Regular.ttf
│   ├── Poppins-SemiBold.ttf
│   └── Poppins-Bold.ttf
├── signs/                  # Road sign images
│   ├── stop_sign.png
│   ├── pedestrian_crossing.png
│   ├── curve_ahead.png
│   ├── no_entry.png
│   └── speed_limit_50.png
├── icon.png               # App icon (1024x1024)
├── adaptive-icon.png      # Android adaptive icon
├── splash.png            # Splash screen image
└── favicon.png           # Web favicon
```

## Image Requirements

### App Icons
- **icon.png**: 1024x1024px, PNG format
- **adaptive-icon.png**: 1024x1024px, PNG format (for Android)
- **favicon.png**: 32x32px, PNG format

### Road Signs
- Format: PNG with transparent background
- Size: 200x200px recommended
- High contrast for visibility
- Clear, crisp images

### Splash Screen
- **splash.png**: 1284x2778px (iPhone 13 Pro Max resolution)
- Should work well with the blue gradient background (#4F8EF7)

## Adding New Signs

When adding new road sign images:

1. Save the image in `assets/signs/` directory
2. Use descriptive filename (e.g., `yield_sign.png`)
3. Update the question data in `src/data/questionBank.js`
4. Reference the image using: `require('../../assets/signs/filename.png')`

## Font Installation

The app uses Poppins font family. Download from Google Fonts:
- Poppins Regular (400)
- Poppins SemiBold (600) 
- Poppins Bold (700)

Place the .ttf files in the `assets/fonts/` directory.