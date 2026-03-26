// ── Hero canvas animation ────────────────────────────────────────────
(function(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, lines = [], raf;

  function resize(){
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initLines();
  }

  function initLines(){
    lines = [];
    const cVals = [0,0.2,0.4,0.6,0.8,0.9,1.0];
    const mVals = [1.5,2.0,2.5,3.0,3.5,4.0];
    const E = 5;
    mVals.forEach((m,mi) => {
      cVals.forEach((c,ci) => {
        const estar = E * (1 + c*(m-1));
        lines.push({ c, m, estar, phase: Math.random()*Math.PI*2, speed: 0.003+Math.random()*0.003 });
      });
    });
  }

  function draw(t){
    ctx.clearRect(0,0,W,H);
    const E=5, maxEstar=15;
    lines.forEach(l => {
      const x = (l.c / 1.0) * W;
      const y = H - (l.estar / maxEstar) * H * 0.85 - H*0.05;
      const alpha = 0.15 + 0.1 * Math.sin(t*l.speed + l.phase);
      const ratio = l.estar / maxEstar;
      const r = Math.round(ratio * 220 + 30);
      const g = Math.round((1-ratio)*180 + 20);
      const b = 100;
      ctx.beginPath();
      ctx.arc(x, y, 2+ratio*3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    });
    // draw current position
    const curX = (0.9/1.0)*W;
    const curEstar = 14;
    const curY = H - (curEstar/maxEstar)*H*0.85 - H*0.05;
    const pulse = 0.6 + 0.4*Math.sin(t*0.005);
    ctx.beginPath();
    ctx.arc(curX, curY, 8, 0, Math.PI*2);
    ctx.fillStyle = `rgba(239,159,39,${pulse*0.8})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(curX, curY, 14, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(239,159,39,${pulse*0.3})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  raf = requestAnimationFrame(draw);
})();

// ── Sensitivity table population ────────────────────────────────────
(function(){
  const mVals = [1.5,2.0,2.5,3.0,3.5,4.0];
  const cVals = [0.0,0.2,0.4,0.6,0.8,0.9,1.0];
  const tbody = document.getElementById('sens-body');
  if(!tbody) return;

  mVals.forEach(m => {
    const tr = document.createElement('tr');
    const mCell = document.createElement('td');
    mCell.textContent = 'm='+m.toFixed(1);
    if(m===3.0) mCell.style.color='#fbbf24';
    tr.appendChild(mCell);
    cVals.forEach(c => {
      const td = document.createElement('td');
      const val = 1 + c*(m-1);
      td.textContent = val.toFixed(2);
      const isCurrent = (m===3.0 && c===0.9);
      if(isCurrent){
        td.className = 'cell-current';
        td.textContent = '★ '+val.toFixed(2);
      } else if(val >= 3.0) td.className='cell-max';
      else if(val >= 2.5) td.className='cell-high';
      else if(val >= 2.0) td.className='cell-mid';
      else td.className='cell-low';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
})();

// ── Examples accordion ───────────────────────────────────────────────
(function(){
  const examples = [
    {
      num:'01', title:'Pre-2024 Iran Hormuz threats (bluff regime)',
      params:'c=0.15, m=3.0, E=5, H=7',
      estar:'E*=6.5',
      steps:[
        {label:'Compute E*', eq:'E* = 5×[1+0.15×(3−1)] = 5×1.30 = 6.5', note:'30% amplification. Threat largely discounted by markets. Oil futures barely moved on announcements.'},
        {label:'U.S. Escalate payoff', eq:'U_A = −7 − 6.5 = −13.5', note:'Gap = 6.5. Smaller than H=7. Escalation costly but not politically impossible.'},
        {label:'Verdict', eq:'Deterrence gap 6.5 < H = 7 → escalation feasible', note:'Threat credible enough to price into futures but insufficient to alter military planning.'},
      ]
    },
    {
      num:'02', title:'Abqaiq-Khurais drone attack (September 2019)',
      params:'c=0.45, m=2.5, E=5, H=7',
      estar:'E*=8.4',
      steps:[
        {label:'Compute E*', eq:'E* = 5×[1+0.45×(2.5−1)] = 5×1.675 = 8.375', note:'67.5% amplification. Significant but not decisive. Brent rose ~15% then retreated within 2 weeks.'},
        {label:'U.S. Escalate payoff', eq:'U_A = −7 − 8.375 = −15.375', note:'Trump chose not to strike Iran. Consistent with E*=8.4 making escalation unattractive.'},
        {label:'Model validation', eq:'c=0.45 sufficient at m=2.5 to deter escalation', note:'Observed outcome (non-escalation) matches model prediction exactly.'},
      ]
    },
    {
      num:'03', title:'Operation Earnest Will, 1987–88 (low m era)',
      params:'c=0.60, m=1.6, E=4, H=6',
      estar:'E*=5.4',
      steps:[
        {label:'Calibrate 1987 m', eq:'Hormuz 1987: ~8M bpd ≈ 10% global oil. m ≈ 1.6', note:'Global oil share was roughly half of 2026 levels. Bypass options more viable.'},
        {label:'Compute E*', eq:'E* = 4×[1+0.60×(1.6−1)] = 4×1.36 = 5.44', note:'Only 36% amplification. Escort was feasible.'},
        {label:'1987 vs 2026 comparison', eq:'E*(1987) = 5.44  vs  E*(2026) = 14.0 → ratio 2.57×', note:'The 2.57× difference explains why the same escort strategy worked then and fails now. Both c and m have doubled.'},
      ]
    },
    {
      num:'04', title:'Current active closure — March 2026 (day 19)',
      params:'c=0.90, m=3.0, E=5, H=7',
      estar:'E*=14.0',
      steps:[
        {label:'Compute E*', eq:'E* = 5×[1+0.90×(3.0−1)] = 5×[1+1.80] = 5×2.80 = 14.0', note:'E* tripled from base. 180% increase above baseline escalation cost.'},
        {label:'Payoff comparison', eq:'Accommodate: −7  |  Escalate: −21  |  Gap: 14', note:'Deterrence gap = 14 = 2×H. Even strong hawks face 14-unit penalty for choosing Escalate. Germany, France, Australia refusing = empirical validation.'},
        {label:'Market translation', eq:'Brent $65→$105 = 62% premium. ΔP/P consistent with E*/E=2.80', note:'The 62% Brent premium is the market\'s real-world read of E*. Oil markets have priced effective escalation cost into the forward curve.'},
      ]
    },
    {
      num:'05', title:'Swing Producer endorsement scenario',
      params:'c: 0.90→0.96, m: 3.0→3.4, E=5',
      estar:'E*=16.5',
      steps:[
        {label:'Effect on c', eq:'c: 0.90 + 0.06 = 0.96 (Saudi implicit backing)', note:'Swing endorsement does not require formal statement. Market reads safe passage for yuan-denominated Gulf cargo as credibility boost.'},
        {label:'Effect on m', eq:'m: 3.0 + 0.4 = 3.4 (Gulf volume now under yuan conditions)', note:'Iraq, Kuwait, Qatar have no bypass. Their volume adds to the irreplaceable fraction.'},
        {label:'New E*', eq:'E* = 5×[1+0.96×(3.4−1)] = 5×3.304 = 16.52', note:'18% increase over Iran-alone scenario. Swing endorsement — even implicit — adds significant deterrence pressure.'},
      ]
    },
    {
      num:'06', title:'Bessent 140-million-barrel waiver (19 March 2026)',
      params:'Sr analysis against Eq. 12',
      estar:'Sr≈0.78',
      steps:[
        {label:'Sr calculation', eq:'140M bbl × $100/bbl = $14B ÷ $18B/yr = Sr ≈ 0.78 units', note:'On a scale where G = 8 units ≈ $18B/year, the one-time $14B = 0.78 units. Temporary, asset-specific.'},
        {label:'Effect on dominance', eq:'G+(S−Sr) = 8+(10−0.78) = 17.22 > 0 → Yuan still dominant', note:'Dominant strategy unchanged. Iran\'s payoff advantage = 17.22 units. 0.78 of 18 required achieved (4.3%).'},
        {label:'Effect on E*', eq:'ΔE*(from Sr) = 0. E* remains 14.0', note:'Sr does not change c (empirically resolved), m (geology), or E (war costs). E* is unaffected by the waiver entirely.'},
      ]
    },
    {
      num:'07', title:'Genuine Sr=18 (hypothetical diplomacy)',
      params:'Full sanctions relief package',
      estar:'Sr=18',
      steps:[
        {label:'Required Sr', eq:'Sr(min) = G+S = 8+10 = 18 units ≈ $36B/year equivalent', note:'Near-total sanctions removal required. Equivalent to OFAC removal + SWIFT + $10B assets + yuan trade formalisation.'},
        {label:'c collapses after deal', eq:'If Sr=18 + reopening: c → 0.10 (threat irrational)', note:'Once dominant strategy breaks, maintaining closure at c=0.9 becomes costly without benefit. c decays naturally.'},
        {label:'New E* after genuine deal', eq:'E* = 5×[1+0.10×(3−1)] = 5×1.2 = 6.0', note:'E* falls from 14.0 to 6.0. Deterrence gap shrinks from 14 to 6. Brent expected: $105→$70–75. Market option value ~$30–35/bbl.'},
      ]
    },
  ];

  const list = document.getElementById('examples-list');
  if(!list) return;

  examples.forEach((ex, i) => {
    const item = document.createElement('div');
    item.className = 'example-item';
    item.innerHTML = `
      <div class="example-header">
        <span class="ex-num">${ex.num}</span>
        <span class="ex-title">${ex.title}</span>
        <span class="ex-params">${ex.params}</span>
        <span class="ex-estar">${ex.estar}</span>
        <span class="ex-chevron">▶</span>
      </div>
      <div class="example-body">
        <div class="ex-steps">
          ${ex.steps.map(s=>`
            <div class="ex-step">
              <div class="ex-step-label">${s.label}</div>
              <div class="ex-step-content">
                <div class="ex-step-eq">${s.eq}</div>
                <div class="ex-step-note">${s.note}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    item.querySelector('.example-header').addEventListener('click', () => {
      item.classList.toggle('open');
    });
    list.appendChild(item);
    if(i===3) item.classList.add('open'); // open example 4 by default (current)
  });
})();

// ── Live Simulator ───────────────────────────────────────────────────
(function(){
  const ids = ['E','c','m','H','G','S'];
  let chart = null;
  const STEPS = 50;

  function gv(id){ return +document.getElementById('sim-'+id).value; }
  function sv(id,v){ document.getElementById('sim-'+id+'v').textContent = v; }

  function calc(){
    const E=gv('E'), cv=gv('c')/10, mv=gv('m')/10, H=gv('H'), G=gv('G'), S=gv('S');
    sv('E', E); sv('c', cv.toFixed(1)); sv('m', mv.toFixed(1)); sv('H', H); sv('G', G); sv('S', S);

    const estar = E*(1+cv*(mv-1));
    const ef = Math.round(estar*10)/10;
    const ratio = Math.round(estar/E*100)/100;
    const uAcc = -H, uEsc = -H-estar, gap = estar;
    const dom = G+S;
    const iranYuan = G, iranDol = -S;
    const iranYuanEsc = G-estar, iranDolEsc = -S-estar;

    document.getElementById('sim-eq').textContent =
      `E* = ${E} × [1 + ${cv.toFixed(1)}(${mv.toFixed(1)}−1)] = ${E} × [1 + ${Math.round(cv*(mv-1)*100)/100}] = ${ef}`;

    document.getElementById('sm-estar').textContent = ef;
    document.getElementById('sm-ratio').textContent = ratio.toFixed(2)+'×';
    document.getElementById('sm-acc').textContent = (uAcc>=0?'+':'')+Math.round(uAcc);
    document.getElementById('sm-esc').textContent = (uEsc>=0?'+':'')+Math.round(uEsc*10)/10;
    document.getElementById('sm-gap').textContent = Math.round(gap*10)/10;
    document.getElementById('sm-dom').textContent = (dom>=0?'+':'')+dom;

    // Matrix
    document.getElementById('mat-ya').textContent = `Iran +${G}, U.S. ${Math.round(uAcc)}`;
    document.getElementById('mat-ye').textContent = `Iran ${Math.round(iranYuanEsc*10)/10}, U.S. ${Math.round(uEsc*10)/10}`;
    document.getElementById('mat-da').textContent = `Iran ${Math.round(iranDol)}, U.S. +${G} (locked)`;
    document.getElementById('mat-de').textContent = `Iran ${Math.round(iranDolEsc*10)/10}, U.S. ${Math.round((G-estar)*10)/10} (locked)`;

    // Verdict
    const vEl = document.getElementById('sim-verdict');
    if(dom<=0){
      vEl.textContent = `Dominant strategy BROKEN: G+S=${dom} ≤ 0. Yuan no longer dominant for Iran.`;
      vEl.style.borderColor='#f87171'; vEl.style.background='rgba(239,68,68,0.08)';
    } else if(ef>12){
      vEl.textContent = `Suicidal escalation zone. E*=${ef} creates a deterrence gap of ${Math.round(gap*10)/10} units. U.S. Escalate payoff (${Math.round(uEsc*10)/10}) vs Accommodate (${Math.round(uAcc)}). Coalition-level resistance to High Response is structurally justified.`;
      vEl.style.borderColor='#f87171'; vEl.style.background='rgba(239,68,68,0.06)';
    } else if(ef>7){
      vEl.textContent = `Active deterrence. E*=${ef} (${ratio.toFixed(2)}× base). Deterrence gap = ${Math.round(gap*10)/10}. U.S. prefers Accommodate (${Math.round(uAcc)}) over Escalate (${Math.round(uEsc*10)/10}).`;
      vEl.style.borderColor='#fbbf24'; vEl.style.background='rgba(251,191,36,0.06)';
    } else {
      vEl.textContent = `Low deterrence. E*=${ef} (${ratio.toFixed(2)}× base). Limited amplification. U.S. might still escalate if political pressure exceeds cost calculation.`;
      vEl.style.borderColor='#86efac'; vEl.style.background='rgba(34,197,94,0.06)';
    }

    updateChart(E, cv, mv, H, G, S, estar);
  }

  function updateChart(E, cv, mv, H, G, S, estar){
    const cVals = Array.from({length:STEPS+1},(_,i)=>i/STEPS);
    const isDark = true; // always dark chart
    const tc = '#9ca3af', gc = 'rgba(255,255,255,0.06)', zc = 'rgba(255,255,255,0.18)';

    const datasets = [
      { label:'U.S. Accommodate', data: cVals.map(c=>({x:c,y:-H})), borderColor:'#4a9eff', borderWidth:2.5, pointRadius:0 },
      { label:'U.S. Escalate', data: cVals.map(c=>({x:c,y:-H-E*(1+c*(mv-1))})), borderColor:'#7bbfff', borderWidth:1.8, borderDash:[6,3], pointRadius:0 },
      { label:'Iran Yuan', data: cVals.map(()=>({x:cVals[0],y:G})), borderColor:'#6abf69', borderWidth:2.5, pointRadius:0 },
      { label:'Iran Dollar', data: cVals.map(()=>({x:cVals[0],y:-S})), borderColor:'#e57373', borderWidth:1.5, borderDash:[5,3], pointRadius:0 },
      { label:'Minimax a*', data: cVals.map(c=>({x:c,y:-H})), borderColor:'#ffb74d', borderWidth:2, borderDash:[4,2], pointRadius:0 },
    ];

    const annot = {
      id:'cur',
      afterDatasetsDraw(ch){
        const {ctx:c2,scales:{x,y}} = ch;
        const xPx = x.getPixelForValue(cv);
        const yPx = y.getPixelForValue(-H-estar);
        c2.save();
        c2.strokeStyle='rgba(255,255,255,0.2)'; c2.lineWidth=1; c2.setLineDash([3,3]);
        c2.beginPath(); c2.moveTo(xPx,y.getPixelForValue(y.max)); c2.lineTo(xPx,y.getPixelForValue(y.min)); c2.stroke();
        c2.setLineDash([]);
        c2.beginPath(); c2.arc(xPx,yPx,5,0,Math.PI*2);
        c2.fillStyle='#fbbf24'; c2.fill();
        const yAcc = y.getPixelForValue(-H);
        c2.beginPath(); c2.arc(xPx,yAcc,5,0,Math.PI*2);
        c2.fillStyle='#4a9eff'; c2.fill();
        c2.fillStyle='#fbbf24'; c2.font='500 11px monospace'; c2.textAlign='left';
        c2.fillText('E*='+Math.round(estar*10)/10, xPx+8, yPx+4);
        c2.restore();
      }
    };

    const yMin = Math.min(-H-E*mv-1, -S-1);
    const yMax = Math.max(G+2, 3);

    if(chart){ chart.destroy(); chart=null; }
    const ctx = document.getElementById('sim-chart');
    if(!ctx) return;
    chart = new Chart(ctx.getContext('2d'), {
      type:'line', data:{datasets}, plugins:[annot],
      options:{
        responsive:true, maintainAspectRatio:false, animation:false, parsing:false,
        plugins:{ legend:{display:false}, tooltip:{
          backgroundColor:'#1f2937', titleColor:'#e5e7eb', bodyColor:'#9ca3af',
          borderColor:'rgba(255,255,255,0.1)', borderWidth:0.5, padding:9,
          callbacks:{
            title:items=>'c = '+items[0].parsed.x.toFixed(2),
            label:item=>item.dataset.label.split(' ').slice(0,2).join(' ')+': '+(item.parsed.y>=0?'+':'')+Math.round(item.parsed.y*10)/10
          }
        }},
        scales:{
          x:{type:'linear',min:0,max:1,title:{display:true,text:'credibility c',color:tc,font:{size:11}},grid:{color:gc},ticks:{color:tc,font:{size:10},stepSize:0.2,callback:v=>v%0.2===0?v.toFixed(1):''}},
          y:{min:yMin,max:yMax,title:{display:true,text:'payoff',color:tc,font:{size:11}},grid:{color:ctx2=>ctx2.tick?.value===0?zc:gc},ticks:{color:tc,font:{size:10},callback:v=>(v>=0?'+':'')+Math.round(v)}}
        }
      }
    });
  }

  ids.forEach(id => {
    const el = document.getElementById('sim-'+id);
    if(el) el.addEventListener('input', calc);
  });
  calc();
})();

// ── Nav burger ───────────────────────────────────────────────────────
document.getElementById('burger')?.addEventListener('click', function(){
  const links = document.querySelector('.nav-links');
  if(links){
    const isOpen = links.style.display === 'flex';
    links.style.display = isOpen ? '' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '56px';
    links.style.left = '0'; links.style.right = '0';
    links.style.background = '#0a1628';
    links.style.padding = '1rem 0';
    links.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
  }
});

// ── Smooth scroll nav highlight ───────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if(window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#'+current
      ? '#fff'
      : 'rgba(255,255,255,0.65)';
  });
}, {passive:true});
