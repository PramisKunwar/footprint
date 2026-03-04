# CarbonBrowse - Internet Carbon Foot print Tracker

A simple Chrome extension that estimates the carbon footprint of any webpage you visit.

## Core Concept

CarbonBrowse estimates CO₂ emissions based on page data transfer size using a simplified formula:

> **1 MB of data transfer ≈ 0.2 grams of CO₂**

This is an educational estimate, not a precise measurement.

## Features

- **Page size estimation** using the Performance API (with fallback to HTML length)
- **CO₂ calculation** displayed in a clean popup
- **Color-coded impact indicator**:
  - 🌿 Green — Low impact (`< 0.1g CO₂`)
  - 🌤️ Yellow — Moderate impact (`0.1g – 0.5g CO₂`)
  - ⚠️ Red — Heavy page (`> 0.5g CO₂`)
- **Eco-friendly message** to raise awareness
- **Landing page** with installation instructions and extension preview


## File Structure

```
├── footprint/
│       ├── manifest.json       # Extension manifest (permissions, scripts)
│       ├── content.js          # Injected into pages — calculates page size
│       ├── popup.html          # Extension popup UI
│       ├── popup.css           # Green-themed popup styling
│       └── popup.js            # Popup logic — communicates with content.js

```

## How the Extension Works

1. **`content.js`** runs on every webpage and calculates total page size:
   - Uses `performance.getEntriesByType("resource")` to sum `transferSize` / `encodedBodySize`
   - Adds main document size via `performance.getEntriesByType("navigation")`
   - Falls back to `document.documentElement.innerHTML.length` if the Performance API returns nothing
2. **`popup.js`** sends a message to `content.js`, receives the page size in MB, multiplies by `0.2` to get estimated CO₂, and displays the result
3. **`popup.html` + `popup.css`** render a clean, green-themed card UI

## Installation (Chrome Extension)

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer Mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `public/extension` folder
6. Click the CarbonBrowse icon on any webpage to see its carbon footprint

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Chrome Extension | Vanilla JS, Manifest V3             |

## Development (Landing Page)

```sh
npm install
npm run dev
```

## License

Built for Hack Club . Use freely.