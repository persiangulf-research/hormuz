// Hero canvas — decay curve animation
(function(){
  const canvas=document.getElementById('hero-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');let W,H;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  function draw(t){
    ctx.clearRect(0,0,W,H);
    const speed=t*.0003;
    // Hegemony decay curve
    ctx.beginPath();
    for(let i=0;i<=W;i++){
      const x=i,tNorm=i/W*30;
      const decay=Math.exp(-0.05*tNorm)*Math.cos(speed*.3)*.02;
      const h=Math.exp(-0.04*tNorm+decay);
      const y=H*.8-h*H*.6;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(14,165,233,0.2)';ctx.lineWidth=2;ctx.stroke();
    // Iran constant line
    ctx.beginPath();ctx.moveTo(0,H*.25);ctx.lineTo(W,H*.25);
    ctx.strokeStyle='rgba(52,211,153,0.15)';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);
    // Moving dot on decay curve
    const dotT=(speed*3)%30;
    const dotX=dotT/30*W;
    const dotH=Math.exp(-0.04*dotT);
    const dotY=H*.8-dotH*H*.6;
    ctx.beginPath();ctx.arc(dotX,dotY,4,0,Math.PI*2);
    ctx.fillStyle=`rgba(14,165,233,0.5)`;ctx.fill();
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();

// Locked changes cards
(function(){
  const el=document.getElementById('locked-changes');if(!el)return;
  const items=[
    {num:'01',title:'India\'s bilateral accommodation',body:'India freed 3 Iranian tankers and allowed 2 LPG carriers to transit under yuan settlement on 15 March. India\'s Foreign Minister described it as what "diplomacy can bring" — a template that will be applied in the next energy crisis. ρ effect: India represents ~8% of global oil demand. Its yuan settlement adds ρ_S ≈ 0.01–0.02 per round to the decay rate.',col:'#38bdf8'},
    {num:'02',title:'IEA 400-million-barrel reserve release',body:'The release empirically demonstrated that strategic reserves cannot substitute for uninterrupted Hormuz flows at scale. After 400M barrels are depleted, the deterrent value of reserves for future Hormuz crises is permanently downgraded. The "solve with reserves" option is now known to be insufficient — this knowledge is priced into all future crisis calculations.',col:'#38bdf8'},
    {num:'03',title:'mBridge stress-tested under war conditions',body:'The mBridge CBDC platform processed cross-border settlements during an active energy crisis with Saudi Arabia and UAE central bank participation. Every wartime transaction is proof-of-concept for non-dollar payment infrastructure at scale. The operational record persists post-crisis. Future ρ_S from mBridge participants is permanently higher.',col:'#38bdf8'},
    {num:'04',title:'G7 alliance fracture now on record',body:'Germany, France, Australia, Norway, and Japan have all explicitly refused the escort coalition. This refusal is a permanent data point in every Swing Producer\'s security guarantee calculation. P_s(0) for remaining Gulf states has been permanently reduced — not just during this crisis but for all future crises. The guarantee erosion is locked in regardless of how this war ends.',col:'#38bdf8'},
  ];
  el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">`+
  items.map(it=>`<div style="background:#fff;border:1px solid var(--border);padding:1.75rem;border-top:3px solid ${it.col}">
    <div style="font-family:var(--mono);font-size:11px;font-weight:700;color:${it.col};letter-spacing:.1em;text-transform:uppercase;margin-bottom:.75rem">${it.num}</div>
    <div style="font-family:var(--display);font-size:1.1rem;color:var(--ink);margin-bottom:.75rem">${it.title}</div>
    <div style="font-family:var(--serif);font-size:.875rem;color:#555;line-height:1.7">${it.body}</div>
  </div>`).join('')+`</div>`;
})();

// Sensitivity table
(function(){
  const tVals=[5,10,21,30,50,100];
  const rhoVals=[0.02,0.04,0.06,0.08,0.10,0.15];
  const tbody=document.getElementById('sens-body');if(!tbody)return;
  tVals.forEach(t=>{
    const tr=document.createElement('tr');
    const lbl=document.createElement('td');lbl.textContent='t='+t;
    if(t===21)lbl.style.color='#38bdf8';
    tr.appendChild(lbl);
    rhoVals.forEach((rho,ri)=>{
      const td=document.createElement('td');
      const val=Math.pow(1-rho,t);
      const pct=Math.round(val*100);
      const isCur=(t===21&&ri===2);
      td.textContent=isCur?'★ '+pct+'%':pct+'%';
      if(isCur)td.className='cell-current';
      else if(val>=0.80)td.className='cell-low';
      else if(val>=0.60)td.className='cell-mid';
      else if(val>=0.40)td.className='cell-high';
      else td.className='cell-max';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
})();

// Examples
(function(){
  const examples=[
    {num:'01',title:'Sterling hegemony decay 1918–1971',params:'ρ_S per major shift ≈ 0.04–0.06',res:'H → 0 over 53 years',
     steps:[
      {label:'The sterling-dollar transition',eq:'Sterling share of global reserves: ~60% (1918) → ~3% (1971). Duration: ~53 years.',note:'The sterling-dollar transition is the historical analogue for Equation 8. Each round of dollar-denominated trade reduced sterling\'s hegemony incrementally. The decay was not sudden — it was a product of many small compounding factors over decades.'},
      {label:'ρ calibration from history',eq:'(0.97)^53 ≈ 0.20 matches rough sterling reserve share decline',note:'At ρ ≈ 0.03/year, sterling hegemony halved every ~23 years. The actual transition was faster due to WWI/WWII shocks (n_t·ρ_S spikes) accelerating the compounding. Iran\'s war-context ρ_I is likely higher than the peacetime sterling rate.'},
      {label:'Key difference from 2026',eq:'Yuan has CIPS + mBridge + active sponsor (China). Dollar had no challenger in 1918.',note:'Sterling\'s decay was passive — a rising competitor (dollar) with superior infrastructure. The yuan challenge has active state support, purpose-built payment infrastructure, and a live geopolitical catalyst. The decay rate may be compressed to years rather than decades.'},
    ]},
    {num:'02',title:'IEA 400M barrel release — deterrent permanently downgraded',params:'ρ effect on H: permanent',res:'H reduced irreversibly',
     steps:[
      {label:'The deterrent',eq:'Pre-crisis: strategic reserves = credible backstop against Hormuz closure.',note:'Markets believed that a 90-day strategic reserve release could bridge any Hormuz closure. This belief kept ρ_I low — Iran\'s yuan trades had limited hegemony impact because the dollar system was seen as resilient.'},
      {label:'Post-400M barrel release',eq:'400M bbl ≈ 40 days at 10M bpd shortfall. Crisis is still ongoing.',note:'The release demonstrated the limits of strategic reserves as a Hormuz backstop. Markets now know reserves are insufficient for extended closures. The "resilience premium" in H has been permanently downgraded.'},
      {label:'ρ effect',eq:'ρ_I rises permanently: future yuan trades carry more H-erosion weight',note:'When reserves are seen as inadequate, each yuan-settled transit has greater H-erosion power — because there is less buffer to absorb the precedent. The IEA release accelerated the long-run decay trajectory.'},
    ]},
    {num:'03',title:'mBridge wartime stress test — ρ infrastructure effect',params:'Each transaction raises future ρ_S',res:'Permanent infrastructure effect',
     steps:[
      {label:'What mBridge represents in Equation 8',eq:'mBridge transactions → operational history → reduces switching friction → raises future ρ_S',note:'Equation 8\'s ρ_S depends partly on how frictionless yuan settlement is. mBridge war-time transactions reduce friction for all future users. Each successful settlement raises the marginal next state\'s ρ_S.'},
      {label:'The operational record',eq:'55B+ processed pre-war. War-time transactions add credibility at scale.',note:'A payment system that processes wartime transactions at scale has demonstrated something no peacetime test can: that it works under stress, that counterparties can rely on it during geopolitical turbulence. This is the highest-value credibility signal for future adopters.'},
      {label:'Post-crisis H implication',eq:'H cannot be restored by ending yuan trades if the infrastructure is already operational',note:'The mBridge infrastructure effect means H is lower after this crisis than before, regardless of outcome. Even if Iran resumes dollar pricing tomorrow, the CIPS/mBridge operational record exists and attracts future users.'},
    ]},
    {num:'04',title:'India bilateral deal — n_t starts accumulating',params:'n starts at 0, now n ≥ 1',res:'Decay rate accelerates',
     steps:[
      {label:'Before India deal: n=0',eq:'H(t) = H_0·(1−ρ_I)^t',note:'With only Iran switched (n=0, no Swing states), decay is driven solely by ρ_I ≈ 0.03/round. Manageable pace.'},
      {label:'India as n=0.3 equivalent',eq:'Partial: n ≈ 0.3. H(t) = H_0·(1−ρ_I−0.3·ρ_S)^t = H_0·(1−0.03−0.015)^t = (0.955)^t',note:'India is the world\'s third-largest oil importer. A partial switch equivalent to n=0.3 raises total decay rate from 3% to 4.5% per round.'},
      {label:'If Saudi switches: n=1.3',eq:'H(t) = H_0·(0.955−Saudi_rhoS)^t ≈ H_0·(0.94)^t',note:'Adding Saudi Arabia\'s yuan tranche (n=1.3) pushes total decay to approximately 6% per round. Half-life of hegemony falls from ~23 rounds to ~12 rounds.'},
    ]},
    {num:'05',title:'Bessent waiver — Sr reduces S, not ρ',params:'Equation 8 vs Equation 12 interaction',res:'No effect on decay rate',
     steps:[
      {label:'What Bessent\'s Sr does to Equation 8',eq:'Sr reduces S (dominance condition). Sr does NOT reduce ρ_I or ρ_S.',note:'The 140M barrel waiver changes Iran\'s sanctions cost S marginally. It does not change how much H is eroded per yuan-settled transit. ρ_I is a function of the payment infrastructure, not the sanctions regime.'},
      {label:'CIPS transactions during waiver period',eq:'140M barrels settled via CIPS = additional operational CIPS record',note:'The waiver actually increases the pace of decay — by allowing 140M barrels to clear via yuan-denominated payment, it adds to the CIPS operational record and deepens the yuan rail\'s credibility. Sr reduces dominance margin; the clearing mechanism increases ρ_I.'},
      {label:'Net Equation 8 effect of Bessent offer',eq:'ΔS = −0.78 (via Eq.12). Δρ_I = +small positive (via CIPS transactions).',note:'The waiver simultaneously makes Iran\'s dominant strategy marginally less dominant (good for U.S.) and accelerates hegemony decay (bad for U.S.). The net effect on the trap is ambiguous — the Equation 8 channel may offset the Equation 12 channel.'},
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
    const rhoI=gv('rhoI')/1000,rhoS=gv('rhoS')/1000,n=gv('n')/10,G=gv('G')/10,H0=gv('H0')/10;
    document.getElementById('sim-rhoIv').textContent=(rhoI).toFixed(3);
    document.getElementById('sim-rhoSv').textContent=(rhoS).toFixed(3);
    document.getElementById('sim-nv').textContent=(n).toFixed(1);
    document.getElementById('sim-Gv').textContent=(G).toFixed(1);
    document.getElementById('sim-H0v').textContent=(H0).toFixed(1);
    const rhoTotal=rhoI+n*rhoS;
    const h10=H0*Math.pow(1-rhoTotal,10),h20=H0*Math.pow(1-rhoTotal,20),h50=H0*Math.pow(1-rhoTotal,50);
    let halfLife=null;for(let t=1;t<=200;t++){if(H0*Math.pow(1-rhoTotal,t)<=H0/2){halfLife=t;break;}}
    document.getElementById('sim-eq').textContent=`H(t+1) = H(t)·(1−${rhoI.toFixed(3)}−${n.toFixed(1)}×${rhoS.toFixed(3)}) = H(t)·${(1-rhoTotal).toFixed(3)}`;
    document.getElementById('sm-rate').textContent=rhoTotal.toFixed(3);
    document.getElementById('sm-h10').textContent=h10.toFixed(2);
    document.getElementById('sm-h20').textContent=h20.toFixed(2);
    document.getElementById('sm-h50').textContent=h50.toFixed(2);
    document.getElementById('sm-iran').textContent='+'+G.toFixed(1);
    document.getElementById('sm-half').textContent=halfLife?halfLife:'100+';
    const vEl=document.getElementById('sim-verdict');
    vEl.textContent=`Decay rate ρ_total = ${rhoTotal.toFixed(3)}/round. Hegemony half-life: ${halfLife||'100+'} rounds. After 21 rounds: H = ${(H0*Math.pow(1-rhoTotal,21)).toFixed(2)} (${Math.round(Math.pow(1-rhoTotal,21)*100)}% of H_0). Iran collects +${G.toFixed(1)} every round regardless.`;
    updateChart(rhoI,rhoS,n,G,H0,rhoTotal);
  }
  function updateChart(rhoI,rhoS,n,G,H0,rhoTotal){
    const ROUNDS=50;
    const tVals=Array.from({length:ROUNDS+1},(_,i)=>i);
    const hVals=tVals.map(t=>H0*Math.pow(1-rhoTotal,t));
    const uAVals=tVals.map(t=>-H0*Math.pow(1-rhoTotal,t));
    const iranVals=tVals.map(()=>G);
    const isDark=true,tc='#9ca3af',gc='rgba(255,255,255,.06)',zc='rgba(255,255,255,.18)';
    const annot={id:'a',afterDatasetsDraw(ch){
      const{ctx,scales:{x,y}}=ch;
      const x21=x.getPixelForValue(21);
      ctx.save();ctx.strokeStyle='rgba(251,191,36,.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(x21,y.getPixelForValue(y.max));ctx.lineTo(x21,y.getPixelForValue(y.min));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#fbbf24';ctx.font='500 10px monospace';ctx.textAlign='center';ctx.fillText('day 21',x21,y.getPixelForValue(y.max)+12);ctx.restore();
    }};
    const datasets=[
      {label:'U.S. payoff −H(t)',data:tVals.map((t,i)=>({x:t,y:uAVals[i]})),borderColor:'#38bdf8',borderWidth:2.5,pointRadius:0,tension:.3},
      {label:'Iran payoff +G',data:tVals.map((t,i)=>({x:t,y:iranVals[i]})),borderColor:'#86efac',borderWidth:2,pointRadius:0,tension:0},
      {label:'Hegemony H(t)',data:tVals.map((t,i)=>({x:t,y:hVals[i]})),borderColor:'#fbbf24',borderDash:[4,2],borderWidth:1.5,pointRadius:0,tension:.3},
    ];
    if(chart){chart.destroy();chart=null;}
    chart=new Chart(document.getElementById('sim-chart').getContext('2d'),{type:'line',data:{datasets},plugins:[annot],options:{responsive:true,maintainAspectRatio:false,animation:false,parsing:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1f2937',titleColor:'#e5e7eb',bodyColor:'#9ca3af',borderColor:'rgba(255,255,255,.1)',borderWidth:.5,padding:9,callbacks:{title:i=>'Round t = '+i[0].parsed.x,label:i=>i.dataset.label.split(' ')[0]+': '+(i.parsed.y>=0?'+':'')+i.parsed.y.toFixed(2)}}},scales:{x:{type:'linear',min:0,max:ROUNDS,title:{display:true,text:'round t',color:tc,font:{size:11}},grid:{color:gc},ticks:{color:tc,font:{size:10},stepSize:10,callback:v=>v%10===0?v:''}},y:{title:{display:true,text:'payoff / hegemony',color:tc,font:{size:11}},grid:{color:c=>c.tick?.value===0?zc:gc},ticks:{color:tc,font:{size:10},callback:v=>(v>=0?'+':'')+Math.round(v*10)/10}}}}});
  }
  ['rhoI','rhoS','n','G','H0'].forEach(id=>document.getElementById('sim-'+id).addEventListener('input',calc));
  calc();
})();

document.getElementById('burger')?.addEventListener('click',function(){const l=document.querySelector('.nav-links');if(l){const o=l.style.display==='flex';l.style.cssText=o?'':'display:flex;flex-direction:column;position:absolute;top:56px;left:0;right:0;background:#0a1628;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.1)';}});
