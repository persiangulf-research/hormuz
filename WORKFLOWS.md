# Hormuz Gambit — Workflows Document

> Complete operational guide for running, updating, and publishing the Hormuz Gambit research platform.

---

## System Overview

The platform consists of **three interconnected apps** deployed as a static site on GitHub Pages:

| App | File | Purpose |
|-----|------|---------|
| **Main Portal** | `index.html` | Public research portal — analysis cards, briefing engine, live ticker |
| **IntelDash** | `index2.html` | AI news impact analysis + game theory simulation |
| **Admin Panel** | `admin.html` | Private operator tool — fetch news, calibrate model, publish params |
| **Shared Data** | `params.json` | AI-calibrated model parameters read by the portal |
| **Analysis Modules** | `eq4–eq12/` | Standalone deep-dive pages for each equation |

---

## Workflow 1 — Daily Calibration & Publish

**Purpose:** Update the portal with fresh model parameters and headlines from the real world.

**Run frequency:** Once per day, or after a significant geopolitical event.

### Steps

```
1. Open admin.html locally in browser (double-click or via local server)

2. Keys & Config (left column)
   └── Enter Anthropic API key (sk-ant-...)
   └── Enter Guardian API key (from theguardian.com/open-platform)
   └── (Optional) Enter FMP API key for financial data

3. Fetch Brent Price (auto-runs on load)
   └── Scrapes oilprice.com via AllOrigins proxy
   └── Refreshes every 5 minutes automatically
   └── Manual override: type price and click SET

4. Fetch Headlines (Step 1)
   └── Click "↓ FETCH HEADLINES"
   └── 15 Guardian articles load, each tagged with the equation it likely affects
   └── Review the tagged headlines — important events shown with eq labels

5. AI Calibration (Step 2)
   └── Click "⚡ RUN CLAUDE CALIBRATION"
   └── Claude reads all headlines and current Brent price
   └── Outputs updated values for: E, c, m, H, G, S, Sr, k, nu, Ps, rhoI, n
   └── Also generates: strategicSummary, mostSignificantEvent, trapStatus
   └── OR: paste your own analysis into "Manual Headline Paste" and use "USE MANUAL PASTE"

6. Review Parameters (right column)
   └── Sliders show new AI-suggested values
   └── Toggle any parameter off to keep the default value
   └── Manually adjust any slider if you disagree with AI read

7. Publish
   └── Click "↓ DOWNLOAD PARAMS.JSON"
   └── Save to github_site/params.json (overwrite existing)

8. Deploy
   └── git add github_site/params.json
   └── git commit -m "Update: calibration YYYY-MM-DD — [brief summary]"
   └── git push

9. Portal auto-refreshes
   └── index.html fetches params.json every 10 minutes
   └── Ticker updates: Brent, E*, c, Sr
   └── Breaking banner prepends: strategicSummary + mostSignificantEvent + LATEST headlines
   └── Automated Briefing (W1) regenerates with new parameters
```

---

## Workflow 2 — Live Event Classification (Portal)

**Purpose:** Instantly map a breaking news event to the correct game theory equation.

**Run from:** `index.html` → Automated Briefing section → **Workflow 2 panel**

### Steps

```
1. Paste or type a headline into the Event Classifier input box
   Example: "Iran seizes 3 tankers in Hormuz strait"

2. Click "Classify ↗"
   OR click one of the preset chips (e.g. "Trump offers sanctions waiver")

3. Result shows:
   └── Which equation the event maps to (Eq.4, Eq.5, Eq.7, Eq.8, Eq.12)
   └── Estimated parameter delta (e.g. c += 0.02, Sr = 0.78 units)
   └── Whether dominance trap is broken (★ Urgent alert if Sr ≥ 18)
   └── Link to open the full analysis module

4. Preset chips cover all major event types:
   └── Trump offers sanctions waiver → Eq.12 (Sr = 0.78)
   └── Iran attacks 3 tankers → Eq.5 (c += 0.02)
   └── Saudi yuan tranche → Eq.7 (k += 1.0)
   └── US deploys aircraft carrier → Eq.5 m-effect (m → 2.9)
   └── Brent falls $10 → Eq.5 Brent signal (c → lower)
   └── Germany refuses coalition → Eq.4 NE confirmation
   └── mBridge processes $10B → Eq.8 hegemony decay
   └── Iran denies talks → Eq.12 Sr unchanged
```

---

## Workflow 3 — IntelDash News Impact Analysis

**Purpose:** Analyze any news headline for its impact on financial markets and game theory parameters.

**Open from:** Main portal nav → **◈ INTELDASH** button

### Steps

```
1. Connect Claude API (first time only)
   └── Click "• Connect API" in top right
   └── Enter Anthropic API key (sk-ant-...)
   └── Click "Save & Connect"

2. Enable/disable tracked metrics (left panel)
   └── Default: Oil Price, US Dollar (DXY), S&P 500, 10Y Treasuries, Gold
   └── Toggle: VIX Volatility, Natural Gas, Bitcoin
   └── Add custom metric: type name in "Add custom metric..." and press +

3. Paste news headline(s) in the NEWS INPUT box
   └── Can paste multiple headlines at once
   └── OR click one of the sample buttons (Fed rates, OPEC, Hormuz, GPT-5)

4. Click "Analyze Impact"
   └── Claude analyzes the headline
   └── Returns:
       ├── Overall sentiment (POSITIVE/NEGATIVE/NEUTRAL/MIXED) + confidence %
       ├── 2-3 sentence executive summary
       ├── Impact cards for each tracked metric:
       │   ├── Direction (↑ Bullish / ↓ Bearish / → Neutral)
       │   ├── Magnitude (Low/Moderate/High/Critical)
       │   └── Reasoning
       ├── Timeframes: Immediate (24h), Short-term (1-4w), Long-term (3-6m)
       ├── Key Risks (3 items)
       └── Opportunities (2 items)

5. Hormuz Auto-Bridge (for Hormuz-related headlines only)
   └── If keywords detected (hormuz, irgc, tanker, 5th fleet, etc.)
   └── Claude returns hormuzImpact object with:
       └── irEcon, irAsym, usDeter, usEsc (1-10 scales)
       └── escalationRung (1-5)
       └── rationale (1 sentence)
   └── Blue banner appears: "Game Theory Simulation Updated"
   └── Click "View & Run Simulation →" to jump to the Game Theory tab

6. Analysis History (left panel bottom)
   └── All analyses stored in localStorage
   └── Click any history item to reload that result
   └── Max 20 analyses stored
```

---

## Workflow 4 — IntelDash Game Theory Simulation

**Purpose:** Simulate US-Iran Hormuz crisis outcomes using payoff matrix, escalation ladder, or Monte Carlo.

**Tab:** IntelDash → **⚔ Hormuz Game Theory**

### Sub-workflow 4A: Payoff Matrix

```
1. Click "⚔ Hormuz Game Theory" tab
2. Default view: Payoff Matrix
3. Read the 4×4 matrix (US strategies × Iran strategies)
   └── Nash Equilibria highlighted in green (★ Nash Eq.)
   └── Cells show (US payoff, Iran payoff) — higher = better for that actor
4. Bar chart below shows best-response payoffs by scenario
5. Note: Multiple Nash Equilibria exist — the "Strike + closure" row is dominant
```

### Sub-workflow 4B: Escalation Ladder

```
1. Click "Escalation Ladder" tab
2. View 5-rung ladder from Status Quo → Full Blockade/War
3. Each rung shows:
   └── Actors involved (🇺🇸 US / 🇮🇷 Iran)
   └── Escalation risk % (colored bar)
4. Click any rung to expand conditional probabilities:
   └── US next move probabilities (e.g. Naval build-up 62%, back off 38%)
   └── Iran next move probabilities (e.g. Mine deployment 40%, hold 60%)
5. If a Hormuz headline was analyzed: the relevant rung is auto-highlighted
```

### Sub-workflow 4C: Monte Carlo Simulation

```
1. Click "Monte Carlo" tab
2. Adjust parameters:
   US: Deterrence credibility, Oil dependency, Alliance pressure, Escalation tolerance
   Iran: Economic pressure, Asymmetric capability, Domestic legitimacy, Proxy strength
3. Click "▶ Run 10,000-iteration Monte Carlo Simulation"
4. Results show % probability for each outcome:
   └── Stable deterrence
   └── Active tensions
   └── Crisis / standoff
   └── Limited conflict
   └── Full war
5. Equilibrium classification:
   └── Nash Equilibrium: Mutual Deterrence (stable, green)
   └── Unstable Equilibrium: Coercive Bargaining (amber)
   └── Dominant Outcome: Escalation to Conflict (red)
6. If Hormuz news was analyzed: parameters are pre-populated from AI read
   └── The blue "AI detected Hormuz-relevant signals" banner appears
   └── Click "▶ Re-run Simulation" to use AI-updated parameters
```

---

## Workflow 5 — Add a New Analysis Module

**Purpose:** Publish a new standalone equation analysis (e.g. Eq.9, Eq.11).

### Steps

```
1. Create new directory: github_site/eq9/
2. Copy structure from existing module: github_site/eq5/
   └── eq9/index.html
   └── eq9/css/style.css
   └── eq9/js/main.js

3. Edit eq9/index.html:
   └── Update nav formula: <div class="nav-logo">YOUR_EQUATION</div>
   └── Update page title and all content

4. Add card to index.html:
   └── Copy a .card block in the <!-- ANALYSIS GRID --> section
   └── Update: href, card-id, card-eq, card-title, card-desc, card-tags
   └── Change class to "live" when ready to publish

5. Update masthead stats in index.html:
   └── "Active analyses published" count
   └── "Equations formalised" count

6. Update footer:
   └── "13 equations · X active modules · Y in preparation"

7. Deploy:
   └── git add github_site/eq9/ github_site/index.html
   └── git commit -m "Publish: Analysis-006 Eq.9 — [title]"
   └── git push
```

---

## Workflow 6 — Changelog & Parameter Learning

**Purpose:** Track why each parameter was changed and correlate with news events.

**Available in:** `admin.html` → below the publish button

### Steps

```
1. After AI calibration, before publishing:
   └── Admin panel records all parameter changes vs previous values
   └── Each change is tagged with the triggering headlines

2. Click "📋 View Changelog" in admin panel
   └── Shows full history of all calibration events
   └── Each entry shows:
       ├── Timestamp
       ├── Parameter changed (e.g. c: 0.84 → 0.87)
       ├── Triggering headline (e.g. "IRGC seizes tanker")
       └── Equation affected (e.g. Eq.5)

3. Changelog is stored in browser localStorage (key: hg_changelog)
   └── Persists across sessions
   └── Never uploaded — stays private in your browser

4. Use for retrospective analysis:
   └── "Why did E* jump from 13.4 to 15.2 on March 21?"
   └── Answer: tanker seizure → c: 0.84 → 0.90 → E* amplification
```

---

## Workflow 7 — Brent Price Manual Override

**Purpose:** Set a known Brent price when the auto-scraper fails (weekend data gap, API outage).

### Steps

```
1. Open admin.html
2. In "BRENT CRUDE — AUTO-SCRAPE" section:
   └── "Fetching..." shows auto-scrape in progress
   └── If price appears: auto-scrape worked ✓
   └── If price shows "–": auto-scraper failed

3. Manual override:
   └── Type the current Brent price in the override box (e.g. 101.40)
   └── Click "SET"
   └── This price is used for calibration

4. Sources for manual Brent price:
   └── oilprice.com (search "Brent Crude")
   └── TradingView (symbol: UKOIL)
   └── Bloomberg (BRENT)
   └── Reuters commodities

5. After publishing params.json with manual Brent:
   └── Portal will show price from params.json brentPrice field
   └── No live dot indicator (live dot = auto-scraped data only)
```

---

## Workflow 8 — GitHub Pages Deployment

**Purpose:** Deploy the full site to GitHub Pages from scratch or update existing.

### Initial Setup

```bash
# Clone or create repo
git clone https://github.com/[username]/hormuz-gambit.git
cd hormuz-gambit

# Copy all files from github_site/ to repo root (or keep in subdir)
cp -r github_site/* .

# Commit and push
git add .
git commit -m "Initial deploy: Hormuz Gambit v3"
git push origin main

# Enable GitHub Pages:
# Repo Settings → Pages → Source: Deploy from branch → Branch: main → / (root)
```

### Daily Update (params.json only)

```bash
# After downloading fresh params.json from admin panel:
git add params.json
git commit -m "Calibration $(date +%Y-%m-%d): [brief summary]"
git push
# Live in ~60 seconds
```

### Full Site Update

```bash
git add .
git commit -m "Update: [description of changes]"
git push
# Live in ~60 seconds
```

---

## Quick Reference — Key Values

| Metric | Current Value | Breaks Trap At |
|--------|--------------|----------------|
| E (base escalation) | 5 | — |
| c (credibility) | 0.84–0.90 | — |
| m (geographic multiplier) | 3.0 | — |
| E* (effective cost) | 13.4 | — |
| G (Iran yuan gain) | 8 | — |
| S (Iran sanction cost) | 10 | — |
| Sr (sanctions relief offered) | 0.78 | ≥ 18 (G+S) |
| Sr coverage | 4.3% | 100% |
| Dominant strategy | Yuan ≻ Dollar | Sr ≥ 18 |
| Closure day | 26 | — |
| Brent | $101.10 | <$85 signals de-escalation |

---

## File Map

```
github_site/
├── index.html          ← Main portal (public)
├── index2.html         ← IntelDash (AI news + game theory)
├── admin.html          ← Admin panel (operator only)
├── params.json         ← Shared AI-calibrated data
├── README.md           ← Technical documentation
├── WORKFLOWS.md        ← This file
├── eq4/                ← Dominant Strategy Trap analysis
├── eq5/                ← Hormuz Commitment Device (featured)
├── eq7/                ← Swing Producer Cascade
├── eq8/                ← Hegemony Decay & Repeated Game
└── eq12/               ← Sanctions Relief Threshold
```

---

*Last updated: 26 March 2026 · Hormuz Gambit v3*
