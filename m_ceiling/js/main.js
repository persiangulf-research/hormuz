// ── Pipeline Data ───────────────────────────────────────────────────
const pipelines = [
  {
    id: 'petroline',
    name: 'Saudi East-West Petroline (existing)',
    cap: 7, cost: 'Built (1980s)', timeline: 'Operating now',
    terminal: 'Yanbu, Red Sea',
    route: 'rs', // red sea
    active: true,
    note: '77.8% of current bypass. 4 pumping stations; Houthi + Iran missile range.',
    mresImpact: 0
  },
  {
    id: 'petroline-exp',
    name: 'Petroline Expansion (proposed)',
    cap: 11, cost: '$2-4B est.', timeline: '3-5 years',
    terminal: 'Yanbu + Neom, Red Sea',
    route: 'rs',
    active: false,
    note: '+15-20% m_res. Same corridor as existing; same vulnerability.',
    mresImpact: 0.15
  },
  {
    id: 'adcop',
    name: 'UAE ADCOP (existing/damaged)',
    cap: 1.5, cost: 'Built (2012)', timeline: 'Partially operational',
    terminal: 'Fujairah, Gulf of Oman',
    route: 'go',
    active: true,
    note: '9% of bypass when intact. Previously struck; Fujairah within Iranian drone range.',
    mresImpact: 0
  },
  {
    id: 'adcop-exp',
    name: 'UAE ADCOP Expansion',
    cap: 2.5, cost: '$1-2B est.', timeline: '2-4 years',
    terminal: 'Fujairah + Khor Fakkan',
    route: 'go',
    active: false,
    note: '+5-8% m_res. Fujairah attacked multiple times; no strategic depth.',
    mresImpact: 0.065
  },
  {
    id: 'kirkuk',
    name: 'Iraq-Turkey Kirkuk-Ceyhan (existing)',
    cap: 0.25, cost: 'Built (1970s)', timeline: '250K bpd restarted',
    terminal: 'Ceyhan, Mediterranean',
    route: 'go',
    active: true,
    note: '1.5% of bypass. 70+ prior attacks; most vulnerable pipeline globally.',
    mresImpact: 0
  },
  {
    id: 'ipsa',
    name: 'IPSA (Iraq-Saudi, dormant)',
    cap: 0, cost: '$600M restoration', timeline: '12-24 months restoration',
    terminal: 'Yanbu, Red Sea',
    route: 'rs',
    active: false,
    note: '+10% m_res if restored. Mothballed 1990; within Iranian/Houthi range.',
    mresImpact: 0.10
  },
  {
    id: 'iraq-jordan',
    name: 'Iraq-Jordan-Aqaba (proposed)',
    cap: 0, cost: '$5-8B', timeline: '5-7 years (optimistic)',
    terminal: 'Aqaba, Red Sea',
    route: 'rs',
    active: false,
    note: '+6% m_res if built. Never built; political obstacles remain.',
    mresImpact: 0.06
  },
  {
    id: 'imec',
    name: 'IMEC Corridor (revival proposed)',
    cap: 0, cost: '$15-20B full build', timeline: '7-10+ years',
    terminal: 'Haifa / Egypt ports',
    route: 'rs',
    active: false,
    note: 'Structural m_ceiling -0.5 to -0.6. Israel route politically impossible.',
    mresImpact: 0.0
  },
  {
    id: 'neom',
    name: 'Saudi-Neom New Terminal (proposed)',
    cap: 0, cost: '$2-5B est.', timeline: '3-6 years',
    terminal: 'Red Sea (deep water)',
    route: 'rs',
    active: false,
    note: '+5% m_res if built. Closer to Houthi range than Yanbu South.',
    mresImpact: 0.05
  },
  {
    id: 'oman',
    name: 'Gulf → Oman → Arabian Sea (not proposed)',
    cap: 0, cost: '$10-15B est.', timeline: '5-7 years minimum',
    terminal: 'Duqm / Sohar / Salalah',
    route: 'om',
    active: false,
    note: 'ONLY route bypassing both Hormuz AND Bab al-Mandab. Requires Gulf Railway + Omani port expansion.',
    mresImpact: 0.15
  }
];

// ── State ───────────────────────────────────────────────────────────
let state = {
  hormuzThroughput: 20,   // M bpd
  mBase: 3.0,
  alpha: 1.75,
  c: 0.87,
  E: 5.0,
  dualStrait: false,
  redSeaExposure: 0.80    // fraction of bypass that routes via Red Sea
};

// ── Pipeline Grid ───────────────────────────────────────────────────
function renderPipelines() {
  const grid = document.getElementById('pipeline-grid');
  if (!grid) return;
  grid.innerHTML = '';

  pipelines.forEach(p => {
    const card = document.createElement('div');
    const routeClass = p.route === 'rs' ? 'red-sea' : (p.route === 'om' ? 'omani' : '');
    card.className = `pipeline-card ${routeClass} ${p.active ? 'active' : ''}`;
    card.dataset.id = p.id;

    const routeLabel = p.route === 'rs' ? 'RED SEA TERMINAL' : (p.route === 'om' ? 'OMAN / ARABIAN SEA' : 'GULF OF OMAN');
    const capDisplay = p.cap > 0 ? `${p.cap}M bpd` : '0 bpd (not built)';

    card.innerHTML = `
      <div class="pc-toggle">✓</div>
      <div class="pc-name">${p.name}</div>
      <div class="pc-cap">${capDisplay}</div>
      <div class="pc-meta">${p.cost} · ${p.timeline} · ${p.terminal}</div>
      <span class="pc-route ${p.route === 'rs' ? 'rs' : (p.route === 'om' ? 'om' : 'go')}">${routeLabel}</span>
      <div class="pc-meta" style="margin-top:0.5rem;font-size:0.75rem;">${p.note}</div>
    `;

    card.addEventListener('click', () => {
      p.active = !p.active;
      updateAll();
    });

    grid.appendChild(card);
  });
}

function updatePipelineCards() {
  document.querySelectorAll('.pipeline-card').forEach(card => {
    const p = pipelines.find(x => x.id === card.dataset.id);
    if (p) {
      card.classList.toggle('active', p.active);
    }
  });
}

function updatePipelineSummary() {
  const summary = document.getElementById('pipeline-summary');
  if (!summary) return;

  const totalBypass = pipelines.filter(p => p.active).reduce((s, p) => s + p.cap, 0);
  const rsBypass = pipelines.filter(p => p.active && p.route === 'rs').reduce((s, p) => s + p.cap, 0);
  const bypassFrac = totalBypass / state.hormuzThroughput;
  const mRes = Math.min(bypassFrac, 0.99);
  const mCeiling = state.mBase + (1 - mRes) * state.alpha;
  const irrep = 1 - bypassFrac;

  summary.innerHTML = `
    <div style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.75rem;">Active Pipeline Summary</div>
    <div class="ps-row"><span class="ps-label">Total active bypass</span><span class="ps-val">${totalBypass.toFixed(1)}M bpd</span></div>
    <div class="ps-row"><span class="ps-label">Red Sea-terminating</span><span class="ps-val warn">${rsBypass.toFixed(1)}M bpd (${totalBypass > 0 ? Math.round(rsBypass/totalBypass*100) : 0}%)</span></div>
    <div class="ps-row"><span class="ps-label">Hormuz throughput</span><span class="ps-val">${state.hormuzThroughput.toFixed(1)}M bpd</span></div>
    <div class="ps-row"><span class="ps-label">Bypass fraction</span><span class="ps-val">${(bypassFrac * 100).toFixed(1)}%</span></div>
    <div class="ps-row"><span class="ps-label">m_resilience</span><span class="ps-val">${(mRes * 100).toFixed(1)}%</span></div>
    <div class="ps-row"><span class="ps-label">m_ceiling (Hormuz-only)</span><span class="ps-val highlight">${mCeiling.toFixed(2)}</span></div>
    ${state.dualStrait ? '<div class="ps-row"><span class="ps-label">m (dual-strait active)</span><span class="ps-val" style="color:#f87171;">4.75</span></div>' : ''}
  `;
}

// ── Scenarios ───────────────────────────────────────────────────────
const scenarios = [
  {
    id: 'current',
    label: 'CURRENT STATE',
    title: 'Existing bypass only',
    desc: 'Petroline 7M + ADCOP 1.5M + Kirkuk 0.25M = 8.75M bpd',
    pipelines: ['petroline', 'adcop', 'kirkuk']
  },
  {
    id: 'ft-short',
    label: 'SHORT-TERM (0-2 YRS)',
    title: 'FT Report — Near-term additions',
    desc: 'Current + ADCOP expansion + IPSA restoration. ~12.9M bpd.',
    pipelines: ['petroline', 'adcop', 'adcop-exp', 'kirkuk', 'ipsa']
  },
  {
    id: 'ft-medium',
    label: 'MEDIUM-TERM (2-5 YRS)',
    title: 'FT Report — Petroline expansion',
    desc: 'Petroline expanded to ~18M + ADCOP + Kirkuk + IPSA. ~18.25M bpd.',
    pipelines: ['petroline', 'petroline-exp', 'adcop', 'adcop-exp', 'kirkuk', 'ipsa']
  },
  {
    id: 'full-build',
    label: 'FULL BUILD (5-10 YRS)',
    title: 'All proposed pipelines completed',
    desc: '18.25M bpd theoretical bypass. m_ceiling = 3.15. Red Sea dominant.',
    pipelines: ['petroline', 'petroline-exp', 'adcop', 'adcop-exp', 'kirkuk', 'ipsa', 'iraq-jordan', 'neom']
  },
  {
    id: 'oman-route',
    label: 'OMAN ROUTE',
    title: 'Genuine m_ceiling reduction',
    desc: 'Gulf → Oman → Arabian Sea. Only bypass that avoids BOTH chokepoints.',
    pipelines: ['petroline', 'adcop', 'kirkuk', 'oman']
  },
  {
    id: 'dual-strait',
    label: 'DUAL-STRAIT ⚡',
    title: 'Houthi activates Bab al-Mandab',
    desc: 'All pipelines built but Bab al-Mandab closed. m = 4.75 regardless.',
    pipelines: ['petroline', 'petroline-exp', 'adcop', 'adcop-exp', 'kirkuk', 'ipsa', 'iraq-jordan', 'neom'],
    dualStrait: true
  }
];

function renderScenarios() {
  const grid = document.getElementById('scenario-grid');
  if (!grid) return;
  grid.innerHTML = '';

  scenarios.forEach(s => {
    const card = document.createElement('div');
    card.className = 'scenario-card';
    card.dataset.id = s.id;

    // Calculate m for this scenario
    const totalBypass = s.pipelines.reduce((sum, pid) => {
      const p = pipelines.find(x => x.id === pid);
      return sum + (p ? p.cap : 0);
    }, 0);
    const bypassFrac = totalBypass / 20; // default 20M bpd
    const mRes = Math.min(bypassFrac, 0.99);
    const mCeiling = 3.0 + (1 - mRes) * 1.75;
    const mDisplay = s.dualStrait ? 4.75 : mCeiling;
    const barPct = Math.max(5, Math.min(100, ((mDisplay - 1) / 4) * 100));

    card.innerHTML = `
      <div class="sc-label">${s.label}</div>
      <div class="sc-title">${s.title}</div>
      <div class="sc-m">m = ${mDisplay.toFixed(2)}</div>
      <div class="sc-detail">${s.desc}</div>
      <div class="sc-bar"><div class="sc-bar-fill ${mDisplay > 4 ? 'warn' : (mDisplay < 2.5 ? 'good' : '')}" style="width:${barPct}%"></div></div>
    `;

    card.addEventListener('click', () => {
      // Activate this scenario
      pipelines.forEach(p => p.active = s.pipelines.includes(p.id));
      state.dualStrait = !!s.dualStrait;
      updateAll();
    });

    grid.appendChild(card);
  });
}

// ── Simulator Calculation ───────────────────────────────────────────
function calc() {
  const totalBypass = pipelines.filter(p => p.active).reduce((s, p) => s + p.cap, 0);
  const rsBypass = pipelines.filter(p => p.active && p.route === 'rs').reduce((s, p) => s + p.cap, 0);

  // Update bypass slider
  const bypassSlider = document.getElementById('sim-bypass');
  const bypassVal = document.getElementById('sim-bypassv');
  if (bypassSlider) { bypassSlider.value = Math.round(totalBypass * 4) / 4; }
  if (bypassVal) { bypassVal.textContent = totalBypass.toFixed(1); }

  const bypassFrac = totalBypass / state.hormuzThroughput;
  const mRes = Math.min(bypassFrac, 0.99);

  // Calculate m_ceiling
  let mCeiling = state.mBase + (1 - mRes) * state.alpha;
  if (state.dualStrait) mCeiling = 4.75;

  // Calculate E* impact
  const estar = state.E * (1 + state.c * (mCeiling - 1));
  const irrep = Math.max(0, 1 - bypassFrac);
  const gap = estar;

  // Update display
  document.getElementById('sm-m').textContent = mCeiling.toFixed(2);
  document.getElementById('sm-mres').textContent = (mRes * 100).toFixed(0) + '%';
  document.getElementById('sm-bypass').textContent = (bypassFrac * 100).toFixed(0) + '%';
  document.getElementById('sm-estar').textContent = estar.toFixed(1);
  document.getElementById('sm-irrep').textContent = (irrep * 100).toFixed(0) + '%';
  document.getElementById('sm-gap').textContent = gap.toFixed(1);

  // Equation display
  if (state.dualStrait) {
    document.getElementById('sim-eq').textContent =
      `DUAL-STRAIT: m = 4.75 (Bab al-Mandab closed). Bypass fraction ${(bypassFrac*100).toFixed(0)}% irrelevant — all Red Sea routes neutralised.`;
  } else {
    document.getElementById('sim-eq').textContent =
      `m = ${state.mBase.toFixed(1)} + (1−${mRes.toFixed(2)})×${state.alpha.toFixed(2)} = ${mCeiling.toFixed(2)}`;
  }

  // Verdict
  const vEl = document.getElementById('sim-verdict');
  if (state.dualStrait) {
    vEl.textContent = `⚡ Dual-strait: m=4.75 regardless of pipeline build. E*=${estar.toFixed(1)}. Gap=${gap.toFixed(1)} = ${(gap/7).toFixed(1)}×H. Escalation structurally infeasible. Bab al-Mandab neutralises all Red Sea bypass.`;
    vEl.style.borderColor = '#2563eb';
    vEl.style.background = 'rgba(37,99,235,0.12)';
  } else if (mCeiling < 2.0) {
    vEl.textContent = `Significant m reduction. m=${mCeiling.toFixed(2)}. E*=${estar.toFixed(1)}. Oman-type bypasses genuinely reduce Iran's leverage. Gap=${gap.toFixed(1)}.`;
    vEl.style.borderColor = '#22c55e';
    vEl.style.background = 'rgba(34,197,94,0.08)';
  } else if (mCeiling < 2.8) {
    vEl.textContent = `Marginal m reduction. m=${mCeiling.toFixed(2)}. E*=${estar.toFixed(1)}. Pipeline build has modest effect but Red Sea exposure limits benefit. Gap=${gap.toFixed(1)}.`;
    vEl.style.borderColor = '#fbbf24';
    vEl.style.background = 'rgba(251,191,36,0.08)';
  } else {
    vEl.textContent = `m barely changes. m=${mCeiling.toFixed(2)} (vs 3.0 baseline). E*=${estar.toFixed(1)}. Pipeline expansion substitutes Bab al-Mandab exposure for Hormuz exposure. Gap=${gap.toFixed(1)} = ${(gap/7).toFixed(1)}×H.`;
    vEl.style.borderColor = '#3b82f6';
    vEl.style.background = 'rgba(59,130,246,0.08)';
  }

  // Update chart
  updateChart(mCeiling, mRes, bypassFrac, rsBypass, totalBypass);

  // Update pipeline cards and summary
  updatePipelineCards();
  updatePipelineSummary();
}

// ── Chart ───────────────────────────────────────────────────────────
let chart = null;

function updateChart(mCeiling, mRes, bypassFrac, rsBypass, totalBypass) {
  if (typeof Chart === 'undefined') return;

  const ctx = document.getElementById('sim-chart');
  if (!ctx) return;

  // Generate bypass fraction sweep data
  const steps = 50;
  const bypassFracs = Array.from({length: steps + 1}, (_, i) => i / steps);
  const mValues = bypassFracs.map(f => state.mBase + (1 - f) * state.alpha);
  const estarValues = bypassFracs.map(f => {
    const m = state.mBase + (1 - f) * state.alpha;
    return state.E * (1 + state.c * (m - 1));
  });

  const tc = '#9ca3af';
  const gc = 'rgba(255,255,255,0.06)';

  const datasets = [
    {
      label: 'm_ceiling',
      data: bypassFracs.map((f, i) => ({x: f * 100, y: mValues[i]})),
      borderColor: '#3b82f6',
      borderWidth: 2.5,
      pointRadius: 0,
      yAxisID: 'y'
    },
    {
      label: 'E*',
      data: bypassFracs.map((f, i) => ({x: f * 100, y: estarValues[i]})),
      borderColor: '#fbbf24',
      borderWidth: 1.8,
      borderDash: [6, 3],
      pointRadius: 0,
      yAxisID: 'y2'
    },
    {
      label: 'Dual-strait m (4.75)',
      data: bypassFracs.map(f => ({x: f * 100, y: 4.75})),
      borderColor: 'rgba(239,68,68,0.4)',
      borderWidth: 1,
      borderDash: [4, 4],
      pointRadius: 0,
      yAxisID: 'y'
    }
  ];

  const annot = {
    id: 'cur',
    afterDatasetsDraw(ch) {
      const {ctx: c2, scales: {x, y}} = ch;
      const xPx = x.getPixelForValue(bypassFrac * 100);
      const yPx = y.getPixelForValue(mCeiling);
      c2.save();
      c2.strokeStyle = 'rgba(255,255,255,0.15)';
      c2.lineWidth = 1;
      c2.setLineDash([3, 3]);
      c2.beginPath();
      c2.moveTo(xPx, y.getPixelForValue(y.max));
      c2.lineTo(xPx, y.getPixelForValue(y.min));
      c2.stroke();
      c2.setLineDash([]);
      c2.beginPath();
      c2.arc(xPx, yPx, 6, 0, Math.PI * 2);
      c2.fillStyle = '#3b82f6';
      c2.fill();
      c2.strokeStyle = '#fff';
      c2.lineWidth = 2;
      c2.stroke();
      c2.fillStyle = '#3b82f6';
      c2.font = '600 11px "IBM Plex Mono", monospace';
      c2.textAlign = 'left';
      c2.fillText(`m=${mCeiling.toFixed(2)}`, xPx + 10, yPx - 8);
      c2.fillText(`${(bypassFrac*100).toFixed(0)}% bypass`, xPx + 10, yPx + 8);
      c2.restore();
    }
  };

  if (chart) { chart.destroy(); chart = null; }
  chart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: { datasets },
    plugins: [annot],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      parsing: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#e5e7eb',
          bodyColor: '#9ca3af',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 0.5,
          padding: 9,
          callbacks: {
            title: items => 'Bypass: ' + items[0].parsed.x.toFixed(0) + '%',
            label: item => item.dataset.label + ': ' + item.parsed.y.toFixed(2)
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 100,
          title: { display: true, text: 'Bypass fraction (%)', color: tc, font: { size: 11 } },
          grid: { color: gc },
          ticks: { color: tc, font: { size: 10 }, stepSize: 10 }
        },
        y: {
          type: 'linear',
          position: 'left',
          min: 1,
          max: 5.5,
          title: { display: true, text: 'm_ceiling', color: '#3b82f6', font: { size: 11 } },
          grid: { color: gc },
          ticks: { color: '#3b82f6', font: { size: 10 } }
        },
        y2: {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 30,
          title: { display: true, text: 'E*', color: '#fbbf24', font: { size: 11 } },
          grid: { drawOnChartArea: false },
          ticks: { color: '#fbbf24', font: { size: 10 } }
        }
      }
    }
  });
}

// ── Slider Wiring ───────────────────────────────────────────────────
function gv(id) { return +document.getElementById('sim-' + id).value; }
function sv(id, v) { document.getElementById('sim-' + id + 'v').textContent = v; }

function wireSliders() {
  const sliders = [
    { id: 'hormuz', get: () => gv('hormuz') / 10, set: v => sv('hormuz', v.toFixed(1)), apply: v => state.hormuzThroughput = v },
    { id: 'mbase', get: () => gv('mbase') / 100, set: v => sv('mbase', v.toFixed(2)), apply: v => state.mBase = v },
    { id: 'alpha', get: () => gv('alpha') / 100, set: v => sv('alpha', v.toFixed(2)), apply: v => state.alpha = v },
    { id: 'redsea', get: () => gv('redsea'), set: v => sv('redsea', v + '%'), apply: v => state.redSeaExposure = v / 100 },
    { id: 'c', get: () => gv('c') / 100, set: v => sv('c', v.toFixed(2)), apply: v => state.c = v },
    { id: 'E', get: () => gv('E') / 10, set: v => sv('E', v.toFixed(1)), apply: v => state.E = v }
  ];

  sliders.forEach(s => {
    const el = document.getElementById('sim-' + s.id);
    if (el) {
      el.addEventListener('input', () => {
        const val = s.get();
        s.set(val);
        s.apply(val);
        calc();
      });
    }
  });

  // Dual-strait toggle
  const dualBtn = document.getElementById('dual-toggle-btn');
  if (dualBtn) {
    dualBtn.addEventListener('click', function() {
      const currentState = this.getAttribute('data-on');
      state.dualStrait = currentState !== '1';
      this.setAttribute('data-on', state.dualStrait ? '1' : '0');
      updateToggleVisual(state.dualStrait);
      const banner = document.getElementById('dual-strait-banner');
      if (banner) banner.style.display = state.dualStrait ? 'block' : 'none';
      calc();
    });
  }
}

function updateToggleVisual(isDual) {
  const track = document.getElementById('dual-toggle-track');
  const thumb = document.getElementById('dual-toggle-thumb');
  const btn = document.getElementById('dual-toggle-btn');
  if (track) track.style.background = isDual ? '#2563eb' : '#374151';
  if (thumb) thumb.style.transform = isDual ? 'translateX(20px)' : 'translateX(0)';
  if (btn) {
    btn.style.background = isDual ? 'rgba(37,99,235,0.18)' : 'rgba(37,99,235,0.12)';
    btn.style.borderColor = isDual ? 'rgba(37,99,235,0.5)' : 'rgba(37,99,235,0.35)';
  }
}

// ── Hero Canvas ─────────────────────────────────────────────────────
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], raf;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initDots();
  }

  function initDots() {
    dots = [];
    const bypassVals = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const alphaVals = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5];
    bypassVals.forEach(b => {
      alphaVals.forEach(a => {
        const m = 3.0 + (1 - b) * a;
        dots.push({ x: b, y: m, phase: Math.random() * Math.PI * 2, speed: 0.002 + Math.random() * 0.004 });
      });
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const maxM = 5.5;
    dots.forEach(d => {
      const xPx = d.x * W;
      const yPx = H - ((d.y - 1) / (maxM - 1)) * H * 0.85 - H * 0.05;
      const alpha = 0.12 + 0.08 * Math.sin(t * d.speed + d.phase);
      const ratio = (d.y - 1) / (maxM - 1);
      const r = Math.round(59 + ratio * 180);
      const g = Math.round(130 - ratio * 80);
      const b = Math.round(246 - ratio * 146);
      ctx.beginPath();
      ctx.arc(xPx, yPx, 2 + ratio * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  raf = requestAnimationFrame(draw);
})();

// ── Nav burger ──────────────────────────────────────────────────────
document.getElementById('burger')?.addEventListener('click', function() {
  const links = document.querySelector('.nav-links');
  if (links) {
    const isOpen = links.style.display === 'flex';
    links.style.display = isOpen ? '' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '56px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = '#0a1628';
    links.style.padding = '1rem 0';
    links.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
  }
});

// ── Update All ──────────────────────────────────────────────────────
function updateAll() {
  calc();
}

// ── Load params.json ────────────────────────────────────────────────
function loadParams() {
  fetch('../params.json')
    .then(res => res.json())
    .then(data => {
      if (data.parameters) {
        state.c = data.parameters.c || 0.87;
        state.E = data.parameters.E || 5.0;
        if (data.parameters.m_base) state.mBase = data.parameters.m_base;
        if (data.parameters.dual_strait) state.dualStrait = data.parameters.dual_strait === 1;
      }
      // Update slider defaults
      const cSlider = document.getElementById('sim-c');
      const eSlider = document.getElementById('sim-E');
      if (cSlider) cSlider.value = Math.round(state.c * 100);
      if (eSlider) eSlider.value = Math.round(state.E * 10);
      sv('c', state.c.toFixed(2));
      sv('E', state.E.toFixed(1));
      const dualBtn = document.getElementById('dual-toggle-btn');
      if (dualBtn) {
        dualBtn.setAttribute('data-on', state.dualStrait ? '1' : '0');
        updateToggleVisual(state.dualStrait);
        const banner = document.getElementById('dual-strait-banner');
        if (banner) banner.style.display = state.dualStrait ? 'block' : 'none';
      }
      calc();
    })
    .catch(err => {
      console.warn('Failed to load params.json, using defaults:', err);
      calc();
    });
}

// ── Init ────────────────────────────────────────────────────────────
renderPipelines();
renderScenarios();
wireSliders();
loadParams();
