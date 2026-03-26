// Hero canvas — threshold approaching animation
(function(){
  const canvas=document.getElementById('hero-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');let W,H;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  function draw(t){
    ctx.clearRect(0,0,W,H);
    const sr=Math.abs(Math.sin(t*.0004))*18;
    const pct=sr/18;
    const barW=W*.7,barX=W*.15,barY=H*.5,barH=8;
    ctx.fillStyle='rgba(139,92,246,0.08)';ctx.fillRect(barX,barY-barH/2,barW,barH);
    ctx.fillStyle=`rgba(139,92,246,${0.2+pct*.3})`;ctx.fillRect(barX,barY-barH/2,barW*pct,barH);
    // threshold line
    ctx.strokeStyle='rgba(139,92,246,0.3)';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(barX+barW,barY-20);ctx.lineTo(barX+barW,barY+20);ctx.stroke();ctx.setLineDash([]);
    // Sr label
    ctx.fillStyle=`rgba(167,139,250,${0.3+pct*.4})`;ctx.font='500 12px monospace';ctx.textAlign='left';
    ctx.fillText('Sr = '+sr.toFixed(1),barX+barW*pct+6,barY+4);
    ctx.fillStyle='rgba(139,92,246,0.2)';ctx.font='10px monospace';ctx.textAlign='right';
    ctx.fillText('Threshold 18',barX+barW-4,barY-14);
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();

// Sr Ladder
(function(){
  const el=document.getElementById('sr-ladder');if(!el)return;
  const items=[
    {label:'Floating oil waiver (Bessent 19 Mar)',sr:0.78,structural:false,pct:4.3,col:'#f87171'},
    {label:'Russian oil waiver precedent (30-day)',sr:0.7,structural:false,pct:3.9,col:'#f87171'},
    {label:'OFAC removal — oil trading entities',sr:2.5,structural:true,pct:13.9,col:'#fbbf24'},
    {label:'Secondary sanctions waiver (yuan clearers)',sr:3.5,structural:true,pct:19.4,col:'#fbbf24'},
    {label:'Partial SWIFT restoration',sr:4.0,structural:true,pct:22.2,col:'#fbbf24'},
    {label:'Frozen assets return ($10B South Korea/Japan)',sr:4.0,structural:true,pct:22.2,col:'#fbbf24'},
    {label:'Permanent oil export sanctions lift',sr:8.0,structural:true,pct:44.4,col:'#60a5fa'},
    {label:'Full Sr(min) package — JCPOA 2.0 equivalent',sr:18,structural:true,pct:100,col:'#86efac'},
  ];
  el.innerHTML=`<div style="display:flex;flex-direction:column;gap:0;border:1px solid var(--border)">`+
  items.map((it,i)=>`
    <div style="display:grid;grid-template-columns:280px 1fr 80px 80px;gap:1rem;align-items:center;padding:.875rem 1.25rem;background:${i%2===0?'#fff':'var(--warm)'};border-bottom:1px solid var(--border);">
      <div style="font-size:12.5px;color:#333;font-family:var(--serif)">${it.label}${!it.structural?'<span style="font-size:10px;color:#888;margin-left:6px;font-family:var(--mono)">[temporary]</span>':''}</div>
      <div style="position:relative;height:6px;background:#eee;border-radius:3px;overflow:hidden"><div style="position:absolute;left:0;top:0;height:100%;width:${it.pct}%;background:${it.col};border-radius:3px;transition:width .4s"></div></div>
      <div style="font-family:var(--mono);font-size:12px;font-weight:700;color:${it.col};text-align:right">${it.sr}</div>
      <div style="font-family:var(--mono);font-size:11px;font-weight:600;color:${it.col};text-align:right">${it.pct}%</div>
    </div>
  `).join('')+`</div>
  <div style="display:flex;gap:1.5rem;margin-top:.75rem;font-size:11px;font-family:var(--mono);color:#888">
    <span>Sr value = payoff-scale units. Threshold = G+S = 18.</span>
    <span style="color:#f87171">■ temporary</span>
    <span style="color:#fbbf24">■ structural-partial</span>
    <span style="color:#60a5fa">■ structural-major</span>
    <span style="color:#86efac">■ full threshold</span>
  </div>`;
})();

// Examples
(function(){
  const examples=[
    {num:'01',title:'JCPOA 2015 — the last genuine Sr offer',params:'Sr ≈ 11–13, G lower (~3), S lower (~8)',res:'Partial trap break',
     steps:[
      {label:'JCPOA Sr components',eq:'SWIFT restored + $7B asset release + oil sanctions partial lift = Sr ≈ 11–13',note:'The 2015 JCPOA was the closest historical analogue to a genuine Sr. It delivered SWIFT access, partial sanctions removal, and asset releases. S fell from ~12 to ~4.'},
      {label:'Why it partially worked',eq:'G+(S−Sr) = 3+(4−11) ≈ −4 < 0 → dominance broken',note:'In 2015, G was much smaller (no CIPS, no mBridge, limited yuan infrastructure). A smaller Sr was sufficient because the yuan option was less attractive.'},
      {label:'Why it would not work today',eq:'2026 requires Sr = G+S = 8+10 = 18 vs 2015\'s Sr ≈ 11–13',note:'G has grown from ~3 to ~8 as yuan infrastructure matured. The same JCPOA deal would only achieve Sr=13, leaving a 5-unit gap. Iran\'s dominant strategy would remain active.'},
    ]},
    {num:'02',title:'Iranian asset freeze — S rises, Sr requirement grows',params:'U.S. raises S → threshold rises',res:'Trap deepens',
     steps:[
      {label:'Inverse relationship',eq:'As U.S. raises S, threshold Sr(min) = G+S rises',note:'Paradox: every additional sanction the U.S. imposes increases the Sr required to break the trap. Maximum Pressure raised S from ~8 to ~10, raising the threshold from 11 to 18.'},
      {label:'The 2022 Russia asset freeze adds F_d',eq:'F_d raises effective S permanently regardless of nominal Sr',note:'Russia\'s $300B freeze added a fear premium to Iran\'s calculation. Even if nominal S is reduced by Sr, F_d remains as a discount on dollar-system trust. The effective threshold is S + F_d, not just S.'},
      {label:'Implication for diplomacy',eq:'Genuine Sr must address F_d as well as S',note:'An Sr that removes sanctions but does not address the asset-freeze risk fails to fully break dominance. Iran would rationally discount any dollar-system offer that does not include credible safeguards against future asset seizures.'},
    ]},
    {num:'03',title:'JCPOA withdrawal (2018) — Sr goes negative',params:'Sr = −2 (S rises)',res:'Trap deepens sharply',
     steps:[
      {label:'Withdrawal effect',eq:'S rises from 4 → 14. Sr(min) rises from 7 → 22.',note:'The withdrawal did not reduce Iran\'s yuan gain G — it raised S dramatically. The trap deepened from a manageable 7 to a near-impossible 22.'},
      {label:'Strategic irony',eq:'Designed to weaken Iran\'s position, Maximum Pressure made it stronger',note:'By raising S, withdrawal made yuan pricing more attractive to Iran, deepening the dominant strategy trap. The policy that aimed to break Iran\'s leverage accidentally strengthened it.'},
      {label:'Current threshold context',eq:'JCPOA-era threshold: ~7. Post-withdrawal threshold: 18. Bessent offer: 0.78.',note:'The 11-unit increase in the threshold since 2018 is entirely attributable to the JCPOA withdrawal and Maximum Pressure escalation. The U.S. is now facing a trap of its own making.'},
    ]},
    {num:'04',title:'Bessent waiver — 4.3% of threshold (live test)',params:'Sr = 0.78, threshold = 18',res:'Trap unchanged',
     steps:[
      {label:'Sr calculation',eq:'$14B ÷ $18B/yr ≈ 0.78 units of Sr',note:'140M barrels at $100/barrel = $14B one-time. Iran\'s annual yuan trade gain G ≈ $18B/year = 8 units. Ratio = 0.78/8 = 9.75% of G. Coverage of threshold: 0.78/18 = 4.3%.'},
      {label:'Structural vs transient',eq:'Sr(structural) = 0. Sr(transient, 14-day) = 0.78.',note:'The waiver is a market management tool, not a diplomatic concession. It does not reduce S (OFAC designations intact, SWIFT exclusion intact, secondary sanctions intact). Permanent Sr impact = 0.'},
      {label:'Paradox: using Iranian barrels against Iran',eq:'Iran receives ~$100/bbl vs ~$80–85/bbl sanctioned. Windfall, not penalty.',note:'Bessent\'s framing — "using Iranian barrels against Iran" — inverts the economic reality. Unsanctioning allows Iran to realise spot price. Iran collects the difference. The "weapon" is a subsidy.'},
    ]},
    {num:'05',title:'Hypothetical: genuine Sr = 18 package',params:'OFAC + SWIFT + assets + yuan formalisation',res:'Trap breaks',
     steps:[
      {label:'Required instruments',eq:'OFAC removal (~2.5) + SWIFT (~4) + assets ($10B = ~4) + yuan waiver (~3.5) + secondary sanctions (~4) = 18',note:'The instruments required sum to approximately 18 units when stacked. Each is individually insufficient. Only the full package breaks the trap.'},
      {label:'Effect on c (credibility)',eq:'Iran\'s dominant strategy breaks → maintaining closure at c=0.9 irrational → c decays toward 0.1',note:'Once dominance breaks, Iran has no strategic incentive to maintain a costly Hormuz closure. c naturally falls, reducing E* from 14 to approximately 6. Brent falls ~$30–35/barrel.'},
      {label:'Diplomatic cost',eq:'Sr=18 ≡ ending Maximum Pressure + JCPOA 2.0 + yuan trade recognition',note:'This package is diplomatically equivalent to Iran\'s stated conditions for resolving the nuclear file. It requires concessions the U.S. has not offered in 8 years of negotiations. The equation makes explicit what the diplomatic cost of breaking the trap actually is.'},
    ]},
  ];
  const list=document.getElementById('examples-list');if(!list)return;
  examples.forEach((ex,i)=>{
    const item=document.createElement('div');item.className='example-item';
    item.innerHTML=`<div class="example-header"><span class="ex-num">${ex.num}</span><span class="ex-title">${ex.title}</span><span class="ex-params">${ex.params}</span><span class="ex-estar">${ex.res}</span><span class="ex-chevron">▶</span></div><div class="example-body"><div class="ex-steps">${ex.steps.map(s=>`<div class="ex-step"><div class="ex-step-label">${s.label}</div><div class="ex-step-content"><div class="ex-step-eq">${s.eq}</div><div class="ex-step-note">${s.note}</div></div></div>`).join('')}</div></div>`;
    item.querySelector('.example-header').addEventListener('click',()=>item.classList.toggle('open'));
    list.appendChild(item);
    if(i===3)item.classList.add('open');
  });
})();

// Simulator
(function(){
  let chart=null;
  function gv(id){return+document.getElementById('sim-'+id).value;}
  function calc(){
    const G=gv('G'),S=gv('S'),Sr=gv('Sr'),H=gv('H');
    ['G','S','Sr','H'].forEach(k=>document.getElementById('sim-'+k+'v').textContent=gv(k));
    const dom=G+S-Sr,threshold=G+S,cov=Math.min(100,Math.round(Sr/threshold*100)),gap=Math.max(0,threshold-Sr);
    document.getElementById('sim-eq').textContent=`G+(S−Sr) = ${G}+(${S}−${Sr}) = ${dom} ${dom>0?'> 0 → Yuan dominant':'≤ 0 → Dominance broken!'}`;
    document.getElementById('sm-dom').textContent=(dom>=0?'+':'')+dom;
    document.getElementById('sm-dom').className='sm-val '+(dom>0?'accent':'green');
    document.getElementById('sm-req').textContent=threshold;
    document.getElementById('sm-cov').textContent=cov+'%';
    document.getElementById('sm-gap').textContent=gap;
    document.getElementById('sm-iy').textContent='+'+G;
    document.getElementById('sm-id').textContent=((-S+Sr)>=0?'+':'')+((-S+Sr));
    const vEl=document.getElementById('sim-verdict');
    if(dom<=0){vEl.textContent=`Dominance broken! Sr=${Sr} ≥ threshold=${threshold}. Iran's Yuan strategy is no longer dominant. Dollar pricing is now at least as attractive as yuan. E* will decay as Iran loses incentive to maintain closure.`;vEl.style.borderColor='#86efac';vEl.style.background='rgba(139,92,246,0.08)';}
    else{vEl.textContent=`Trap active. Dominance margin = ${dom}. Sr coverage: ${cov}% (${Sr} of ${threshold} required). Remaining gap: ${gap} units ≈ $${(gap*2.25).toFixed(0)}B/year equivalent in sanctions cost reduction.`;vEl.style.borderColor='#a78bfa';vEl.style.background='rgba(139,92,246,0.06)';}
    updateChart(G,S,Sr);
  }
  function updateChart(G,S,Sr){
    const srVals=Array.from({length:51},(_,i)=>i/50*(G+S+4));
    const datasets=[
      {label:'Iran Yuan +G',data:srVals.map(sr=>({x:sr,y:G})),borderColor:'#86efac',borderWidth:2.5,pointRadius:0,tension:0},
      {label:'Iran Dollar −S+Sr',data:srVals.map(sr=>({x:sr,y:-S+sr})),borderColor:'#f87171',borderDash:[6,3],borderWidth:2,pointRadius:0,tension:0},
      {label:'Dominance margin',data:srVals.map(sr=>({x:sr,y:G+S-sr})),borderColor:'#a78bfa',borderDash:[4,2],borderWidth:1.5,pointRadius:0,tension:0},
    ];
    const annot={id:'a',afterDatasetsDraw(ch){
      const{ctx,scales:{x,y}}=ch;
      const thresh=G+S;
      const xT=x.getPixelForValue(thresh);
      ctx.save();ctx.strokeStyle='rgba(167,139,250,.5)';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
      ctx.beginPath();ctx.moveTo(xT,y.getPixelForValue(y.max));ctx.lineTo(xT,y.getPixelForValue(y.min));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#a78bfa';ctx.font='500 10px monospace';ctx.textAlign='center';
      ctx.fillText('Sr*='+thresh,xT,y.getPixelForValue(y.max)+12);
      const curX=x.getPixelForValue(Sr);
      ctx.strokeStyle='rgba(251,191,36,.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(curX,y.getPixelForValue(y.max));ctx.lineTo(curX,y.getPixelForValue(y.min));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#fbbf24';ctx.font='500 10px monospace';ctx.textAlign='center';
      ctx.fillText('now Sr='+Sr,curX,y.getPixelForValue(y.max)+12);
      ctx.restore();
    }};
    const isDark=true,tc='#9ca3af',gc='rgba(255,255,255,.06)',zc='rgba(255,255,255,.18)';
    if(chart){chart.destroy();chart=null;}
    chart=new Chart(document.getElementById('sim-chart').getContext('2d'),{type:'line',data:{datasets},plugins:[annot],options:{responsive:true,maintainAspectRatio:false,animation:false,parsing:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1f2937',titleColor:'#e5e7eb',bodyColor:'#9ca3af',borderColor:'rgba(255,255,255,.1)',borderWidth:.5,padding:9,callbacks:{title:i=>'Sr = '+Math.round(i[0].parsed.x*10)/10,label:i=>i.dataset.label.split(' ').slice(0,2).join(' ')+': '+(i.parsed.y>=0?'+':'')+Math.round(i.parsed.y*10)/10}}},scales:{x:{type:'linear',min:0,max:G+S+4,title:{display:true,text:'sanctions relief Sr',color:tc,font:{size:11}},grid:{color:gc},ticks:{color:tc,font:{size:10},stepSize:3,callback:v=>Math.round(v)}},y:{title:{display:true,text:'payoff',color:tc,font:{size:11}},grid:{color:c=>c.tick?.value===0?zc:gc},ticks:{color:tc,font:{size:10},callback:v=>(v>=0?'+':'')+Math.round(v)}}}}}); 
  }
  ['G','S','Sr','H'].forEach(id=>document.getElementById('sim-'+id).addEventListener('input',calc));
  calc();
})();

document.getElementById('burger')?.addEventListener('click',function(){const l=document.querySelector('.nav-links');if(l){const o=l.style.display==='flex';l.style.cssText=o?'':'display:flex;flex-direction:column;position:absolute;top:56px;left:0;right:0;background:#0a1628;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.1)';}});
