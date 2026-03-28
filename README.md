# Hormuz Gambit — Geopolitical & Geoeconomics Research Series

## Game-theoretic analysis of the 2026 Hormuz crisis and Iran's de-dollarisation strategy.

# Introdction to use Analyst Platform for Stretegic briefing and Event Classification

https://github.com/user-attachments/assets/8f3a792e-8f84-4dab-893f-d23837d470a8



## 🚀 Deploy to GitHub Pages

1. Push this entire folder to a GitHub repository
2. Go to **Settings → Pages → Source: Deploy from branch → main → / (root)**
3. Live at `https://yourusername.github.io/hormuz/index.html`

---

## 📁 File Structure

```
github_site/
├── index.html             ← Public portal with breaking news banner
├── admin.html            ← Admin control panel (parameter calibration)
├── params.json           ← Shared parameters file (AI analysis + Brent)
├── README.md
│
├── eq4/                  ← Equation 4: U.S. accommodation vs escalation
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
│
├── eq5/                  ← Equation 5: Iran closure decision
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
│
├── eq7/                  ← Equation 7: Swing producer cascade
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
│
├── eq8/                  ← Equation 8: Dollar hegemony decay
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
│
└── eq12/                 ← Equation 12: Sanctions relief threshold
    ├── index.html
    ├── css/style.css
    └── js/main.js
```

---

## ⚙️ Admin Panel Workflow

The **admin.html** panel manages model parameters via AI calibration:

### **1. Setup (One-Time)**

Get free API keys:
- **Guardian API**: https://open-platform.theguardian.com/access/ (12,000 req/day)
- **Anthropic API**: https://console.anthropic.com/ (Claude calibration)

Enter keys in admin panel → Click "Save keys" (stored in browser localStorage only)

### **2. Calibration Workflow**

```
┌─────────────────────────────────────────────────┐
│  1. Fetch Brent Oil Price                        │
│     • Auto-scrapes oilprice.com (every 5 min)    │
│     • Fallback: Yahoo Finance                    │
│     • Manual override available                  │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  2. Fetch Headlines                              │
│     • Guardian API (customizable keywords)       │
│     • Auto-labeled by equation (Eq.4-12)        │
│     • 24h lookback (configurable)               │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  3. Run Claude Calibration                       │
│     • AI analyzes headlines + Brent price        │
│     • Updates 12 model parameters               │
│     • Provides justifications + confidence       │
│     • Stores changelog (learning tool)           │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  4. Review & Publish                            │
│     • View changelog history (insights)         │
│     • Add analyst notes                         │
│     • Download params.json                       │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  5. Deploy to GitHub                            │
│     • git add github_site/params.json           │
│     • git commit -m "Update params"             │
│     • git push                                  │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  6. Portal Auto-Updates                         │
│     • index.html fetches params.json (10 min)   │
│     • All equation pages update                 │
│     • Banner shows dynamic AI analysis          │
└─────────────────────────────────────────────────┘
```


## 📊 Model Parameters (12 total)

| Symbol | Name | Range | Description |
|--------|------|-------|-------------|
| **c** | Credibility | 0.0-1.0 | Iran closure threat credibility (0=bluff, 1=certain) |
| **E** | Base escalation cost | 1-15 | U.S. military intervention base cost |
| **m** | Geographic multiplier | 1.0-5.0 | Hormuz chokepoint impact (~3.0 = 20% global oil) |
| **H** | Hegemony loss | 1-12 | U.S. dollar dominance erosion |
| **G** | Iran yuan gain | 1-15 | Iran benefit from yuan adoption |
| **S** | Sanctions cost | 1-15 | Iran economic damage from sanctions |
| **Sr** | Sanctions relief | 0-25 | Sanctions relief amount (OFAC/SWIFT) |
| **k** | Cascade switchers | 0-10 | Swing producers switching to yuan |
| **nu** | Network gain | 1-8 | Utility gain per yuan switcher |
| **Ps** | U.S. guarantee value | 5-20 | U.S. security guarantee value to allies |
| **rhoI** | Iran decay rate | 0.005-0.15 | Iran's erosion rate from yuan settlements |
| **n** | Swing states | 0-5 | Number of swing producer states |

### **Derived Metrics:**
- **E\* (Effective escalation cost)**: `E × [1 + c(m−1)]`
- **Dominance margin**: `G + S - Sr` (positive = trap active)
- **Sr coverage**: `Sr/(G+S) × 100%`


### **Learning Workflow:**

```
After 10 calibrations, you notice:
• Eq.5 headlines (attacks) → Always boost 'c' (HIGH confidence)
• Eq.12 headlines → Only move 'Sr' when containing "OFAC/SWIFT"
• Eq.7 headlines (yuan switching) → Gradual 'H'/'G' increases
• Brent >$90 → c parameter jumps significantly

Use these insights to:
✓ Refine search keywords
✓ Write better analyst notes
✓ Understand model sensitivity
✓ Predict parameter moves
```

---

## 🔒 Data Privacy

| Data Type | Storage | Shared? |
|-----------|---------|---------|
| **API Keys** | Browser localStorage | ❌ Never (private) |
| **Changelog** | Browser localStorage | ❌ Never (learning tool) |
| **Parameters** | GitHub (params.json) | ✅ Yes (public) |
| **Headlines** | Session memory | ❌ No (cleared on refresh) |

**Zero server costs** - everything runs in browser or GitHub Pages.

---

## 🆕 Adding a New Analysis

1. Create folder: `/eqXX/`
2. Add files:
   - `index.html` (copy from existing eq folder)
   - `css/style.css` (shared stylesheet)
   - `js/main.js` (equation-specific logic)
3. Update `index.html` in root:
   - Change `.card.coming` to `.card.live`
   - Add correct `href` to `/eqXX/`
4. Ensure equation page fetches `params.json`:
   ```javascript
   fetch('../params.json')
     .then(r => r.json())
     .then(p => {
       // Use parameters in visualization
     });
   ```

---

## 📑 Analyses
see Article
https://persian-gulf.medium.com/the-hormuz-strait-coalition-why-a-naval-coalition-cannot-break-irans-trap-f05cd274bf95
| ID | Equation | Status | Path | Description |
|---|---|---|---|---|
| 001 | E* = E×[1 + c(m−1)] | ✅ Live | [/eq5/](eq5/) | Hormuz Commitment Device |
| 002 | a* = argmax min U_A | ✅ Live | [/eq4/](eq4/) | U.S. Dominant Strategy |
| 003 | Gs + kν > Ps(1−δ)^k | ✅ Live | [/eq7/](eq7/) | Swing Producer Cascade |
| 004 | Sr ≥ G+S | ✅ Live | [/eq12/](eq12/) | Sanctions Relief Threshold |
| 005 | H_{t+1} = H_t(1−ρI−nt·ρS) | ✅ Live | [/eq8/](eq8/) | Hegemony Decay |

---

## 🛠️ Tech Stack

- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **APIs**:
  - Guardian API (news headlines)
  - Anthropic Claude API (AI calibration)
  - oilprice.com scraper (Brent crude)
  - Yahoo Finance fallback (Brent crude backup)
- **Storage**:
  - localStorage (API keys, changelog)
  - GitHub Pages (params.json, static site)
- **Deployment**: GitHub Pages (zero cost, auto-updates)

---

## 🎯 Key Features

✅ **Auto-scraping Brent price** (every 5 minutes)  
✅ **Guardian API integration** (headline fetching)  
✅ **Claude AI calibration** (parameter updates)  
✅ **Changelog tracking** (learn from past calibrations)  
✅ **Manual overrides** (full control)  
✅ **Dynamic banner** (shows AI analysis from params.json)  
✅ **Slower scrolling** (60s cycle for readability)  
✅ **Bigger fonts** (15px for visibility)  
✅ **Zero server costs** (browser + GitHub Pages)  
✅ **Privacy-first** (API keys never leave browser)  
✅ **Real-time portal updates** (params.json auto-fetch)

---

## 📄 License

MIT License - Free to use and modify for research purposes.

---

## 🔗 Links

- **Admin Panel**: `/admin.html`
- **Public Portal**: `/index.html`
- **Guardian API**: https://open-platform.theguardian.com/
- **Anthropic Claude**: https://console.anthropic.com/
- **GitHub Pages Docs**: https://docs.github.com/en/pages

---

## 📅 Scenario Timeline

| Date | Event |
|------|-------|
| **28 FEB 2026** | Crisis begins - Hormuz closure |
| **23 MAR 2026** | Trump-Iran talks signal, Brent volatile |
| **26 MAR 2026** | U.S. invades Khargh Island, Houthis leverage Bab al-Mandan |

### **Current Crisis Metrics:**
- **Day 26** of Hormuz closure
- **Brent** $89+ (up 18% on invasion)
- **Trap Status** Active (dominance margin > 0)
- **Primary Threat** Military escalation + Bab al-Mandan leverage
