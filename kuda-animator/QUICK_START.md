# 🚀 Quick Start Guide - Henry George Educational Animations

## Accessing the Application in GitHub Codespaces

### Option 1: Development Server (Recommended)
```bash
# From the kuda-animator directory
npm run dev
```

Then:
1. Look for the "Ports" tab in VS Code
2. Find port 3000
3. Click the globe icon to open in browser
4. Or use the forwarded URL provided by Codespaces

### Option 2: Production Build
```bash
# Build the application
npm run build

# Serve with Express
node serve.js
```

### Option 3: Python HTTP Server
```bash
# Build first
npm run build

# Serve with Python
cd dist
python3 -m http.server 3000
```

### Option 4: Direct File Access
Open `/workspaces/vibecast/kuda-animator/dist/index.html` directly in your browser after building.

## Troubleshooting

### 502 Error?
- Make sure the server is running (`npm run dev`)
- Check the Ports tab in VS Code
- Ensure port 3000 is forwarded
- Try refreshing the page

### Can't see animations?
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser

### Server won't start?
```bash
# Kill any existing processes
pkill -f vite
pkill -f node

# Try again
npm run dev
```

## What You'll See

1. **Introduction**: Overview of Henry George's economic theories
2. **Land Value Gradient**: 3D visualization of how location creates value
3. **Rent Wedge**: Shows why workers get less as productivity rises
4. **Three Factors**: Historical timeline of wealth distribution
5. **LVT Simulator**: Interactive city builder demonstrating the Single Tax

Start with the Introduction and work through each animation to understand why poverty persists despite progress!