// Hero canvas — payoff matrix cells pulsing
(function(){
  const canvas=document.getElementById('hero-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;init();}
  function init(){
    particles=[];
    for(let i=0;i<60;i++){
      particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:1+Math.random()*2,a:Math.random(),phase:Math.random()*Math.PI*2,col:Math.random()>.5?'239,68,68':'251,191,36'});
    }
  }
  function draw(t){
    ctx.clearRect(0,0,W,H);
    // Grid lines suggesting a matrix
    ctx.strokeStyle='rgba(239,68,68,0.06)';ctx.lineWidth=1;
    [W*.35,W*.65].forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();});
    [H*.4,H*.6].forEach(y=>{ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();});
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      const alpha=0.1+0.15*Math.sin(t*.002+p.phase);
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.col},${alpha})`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();

// Matrix display
(function(){
  const el=document.getElementById('matrix-display');
  if(!el)return;
  el.innerHTML=`
  <div style="overflow-x:auto">
  <table style="border-collapse:collapse;font-family:var(--mono);font-size:13px;width:100%;max-width:700px">
    <tr>
      <th style="padding:10px 16px;background:#f5f0e8;border:1px solid #d5cfc5;color:#888;font-weight:500;width:20%">Iran \\ U.S.</th>
      <th style="padding:10px 16px;background:#e8f0fb;border:1px solid #d5cfc5;color:#1a56db;font-weight:600;width:40%">Accommodate</th>
      <th style="padding:10px 16px;background:#fce8e8;border:1px solid #d5cfc5;color:#c0392b;font-weight:600;width:40%">Escalate</th>
    </tr>
    <tr>
      <td style="padding:12px 16px;background:#eaf3de;border:1px solid #d5cfc5;font-weight:700;color:#27500a">Yuan ¥ ★</td>
      <td style="padding:16px;background:#eaf3de;border:2px solid #639922;text-align:center">
        <div style="font-size:1.1rem;font-weight:700;color:#27500a">Iran: +G = +8</div>
        <div style="color:#c0392b;margin-top:4px">U.S.: −H = −7</div>
        <div style="margin-top:8px;background:#185fa5;color:#fff;font-size:9px;padding:2px 8px;border-radius:2px;display:inline-block">★ NE</div>
      </td>
      <td style="padding:16px;background:#fff8f0;border:1px solid #d5cfc5;text-align:center">
        <div style="font-size:1.1rem;font-weight:700;color:#27500a">Iran: G−E* = −6</div>
        <div style="color:#c0392b;margin-top:4px">U.S.: −H−E* = −21</div>
        <div style="margin-top:8px;background:#854f0b;color:#faeeda;font-size:9px;padding:2px 8px;border-radius:2px;display:inline-block">bad → worse</div>
      </td>
    </tr>
    <tr style="opacity:.45">
      <td style="padding:12px 16px;background:#f5f0e8;border:1px solid #d5cfc5;font-weight:500;color:#888;font-style:italic">Dollar $ ✗</td>
      <td style="padding:16px;background:#f5f0e8;border:1px solid #d5cfc5;text-align:center;color:#aaa;font-style:italic">
        <div>Iran: −S = −10</div><div>U.S.: +G = +8</div>
        <div style="margin-top:8px;font-size:9px;color:#bbb">Inaccessible — Iran never plays this</div>
      </td>
      <td style="padding:16px;background:#f5f0e8;border:1px solid #d5cfc5;text-align:center;color:#aaa;font-style:italic">
        <div>Iran: −S−E = −25</div><div>U.S.: G−E = −7</div>
        <div style="margin-top:8px;font-size:9px;color:#bbb">Inaccessible — Iran never plays this</div>
      </td>
    </tr>
  </table>
  </div>`;
})();

// Sensitivity table
(function(){
  const gVals=[2,4,6,8,10,12];
  const sVals=[4,6,8,10,12,14];
  const tbody=document.getElementById('sens-body');
  if(!tbody)return;
  gVals.forEach(g=>{
    const tr=document.createElement('tr');
    const lbl=document.createElement('td');
    lbl.textContent='G='+g;
    if(g===8)lbl.style.color='#fbbf24';
    tr.appendChild(lbl);
    sVals.forEach(s=>{
      const td=document.createElement('td');
      const val=g+s;
      const isCur=(g===8&&s===10);
      td.textContent=isCur?'★ '+val:val;
      if(isCur)td.className='cell-current';
      else if(val>=21)td.className='cell-max';
      else if(val>=15)td.className='cell-high';
      else if(val>=9)td.className='cell-mid';
      else td.className='cell-low';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
})();

// Examples
(function(){
  const examples=[
    {num:'01',title:'Maximum Pressure baseline (2018–2020)',params:'G=3, S=12, H=5, E=4',res:'Trap active: G+S=15',
     steps:[
      {label:'Dominance check',eq:'G+S = 3+12 = 15 > 0 → Yuan dominant',note:'Even with small G (limited yuan infrastructure), large S (peak sanctions) creates strong dominance.'},
      {label:'U.S. payoffs',eq:'Accommodate: −5  |  Escalate: −9  |  Gap: 4',note:'Smaller gap. U.S. faces a shallower trap — Iran\'s yuan infrastructure not yet operational at scale.'},
      {label:'Status',eq:'Trap active but shallow. No yuan payment rail yet.',note:'Pre-CIPS scale era. The dominance condition held but Iran lacked the financial infrastructure to fully exploit it.'},
    ]},
    {num:'02',title:'Abqaiq attack equilibrium (September 2019)',params:'G=4, S=11, H=6, E=8',res:'NE confirmed',
     steps:[
      {label:'Dominance margin',eq:'G+S = 4+11 = 15 > 0 → Yuan dominant',note:'Iran\'s shift to yuan still dominant even without full Hormuz closure.'},
      {label:'Trump chose Accommodate',eq:'a* = Accommodate: −6  vs  Escalate: −14',note:'Trump announced he would not strike Iran despite maximum political pressure. Consistent with minimax: Escalate payoff (−14) far worse than Accommodate (−6).'},
      {label:'NE verification',eq:'Iran: +4 (Yuan > Dollar ✓)  U.S.: −6 (Acc > Esc ✓)',note:'Both NE conditions satisfied simultaneously. Equilibrium (Yuan, Accommodate) confirmed by observed behaviour.'},
    ]},
    {num:'03',title:'JCPOA withdrawal (2018) — trap creation moment',params:'G=2, S=14, H=5, E=3',res:'Trap created',
     steps:[
      {label:'Before withdrawal: G+S marginal',eq:'G=1, S=8 → G+S = 9 (weak trap)',note:'Pre-2018, Iran had limited yuan access and JCPOA reduced S. Trap existed but Iran had less incentive to exploit it.'},
      {label:'Withdrawal raises S dramatically',eq:'S rises from 8 → 14: G+S = 2+14 = 16',note:'Maximum Pressure raised S by widening sanctions scope. This deepened the trap without any action by Iran.'},
      {label:'Key insight',eq:'Raising S strengthens Iran\'s dominant strategy — the opposite of intended effect',note:'By making dollar costs worse for Iran, Maximum Pressure made yuan more attractive. The policy that aimed to break Iran\'s strategy actually deepened it.'},
    ]},
    {num:'04',title:'Bessent waiver — Accommodate confirmed (19 March 2026)',params:'Sr=0.78 applied',res:'Trap unchanged',
     steps:[
      {label:'Sr effect on dominance',eq:'G+(S−Sr) = 8+(10−0.78) = 17.22 > 0',note:'Bessent\'s 140M barrel waiver ($14B) reduces S by 0.78 units. Dominance margin falls from 18 to 17.22 — a 4.3% reduction.'},
      {label:'U.S. Accommodate payoff unchanged',eq:'a* = Accommodate: −7  (Sr does not affect H)',note:'The waiver does not change H (hegemony loss). U.S. minimax payoff is still −7. The trap geometry is unchanged.'},
      {label:'Model prediction confirmed',eq:'Day 21: U.S. playing Accommodate spontaneously',note:'Unsanctioning Iranian oil without receiving Iranian concessions is the textbook Accommodate move. The dominant strategy trap predicted this on day one.'},
    ]},
    {num:'05',title:'Hypothetical: Naval escalation (counterfactual)',params:'G=8, S=10, H=7, E*=14',res:'Payoff: −21',
     steps:[
      {label:'U.S. chooses Escalate despite E*=14',eq:'U_A(Escalate) = −7−14 = −21',note:'Escalating against a credible Hormuz threat at c=0.9 costs −21 vs Accommodate at −7. A 14-unit penalty.'},
      {label:'Iran\'s response (Yuan strategy intact)',eq:'Iran still plays Yuan: payoff G−E*−Hs = 8−14−1 = −7',note:'Iran\'s own payoff falls to −7 if deterrence fails. This is why Iran wants deterrence to hold — it does not want to be in the Escalate column.'},
      {label:'Why escalation is not observed',eq:'−21 < −7: rational U.S. never chooses Escalate',note:'The trap prevents escalation not by making it impossible but by making it so costly that no rational actor in Washington can justify it. Germany, France, Australia\'s refusals confirm this across the alliance.'},
    ]},
  ];
  const list=document.getElementById('examples-list');
  if(!list)return;
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
    const G=gv('G'),S=gv('S'),H=gv('H'),E=gv('E'),Sr=gv('Sr');
    ['G','S','H','E','Sr'].forEach(k=>document.getElementById('sim-'+k+'v').textContent=gv(k));
    const dom=G+S-Sr,uAcc=-H,uEsc=-H-E,iranY=G,iranD=-S+Sr;
    const srcPct=Math.min(100,Math.round(Sr/(G+S)*100));
    document.getElementById('sim-eq').textContent=`Dominance: G+S−Sr = ${G}+${S}−${Sr} = ${dom} ${dom>0?'> 0 → Trap active':'≤ 0 → Dominance broken'}`;
    document.getElementById('sm-dom').textContent=(dom>=0?'+':'')+dom;
    document.getElementById('sm-dom').className='sm-val '+(dom>0?'accent':'green');
    document.getElementById('sm-acc').textContent=Math.round(uAcc);
    document.getElementById('sm-esc').textContent=Math.round(uEsc);
    document.getElementById('sm-gap').textContent=Math.round(E);
    document.getElementById('sm-iy').textContent='+'+G;
    document.getElementById('sm-src').textContent=srcPct+'%';
    const vEl=document.getElementById('sim-verdict');
    if(dom<=0){vEl.textContent=`Dominance broken! G+S−Sr=${dom} ≤ 0. Iran's Yuan strategy is no longer dominant. This requires Sr = ${G+S} — near-total sanctions removal.`;vEl.style.borderColor='#86efac';vEl.style.background='rgba(34,197,94,0.06)';}
    else{vEl.textContent=`Trap active. Dominance margin = ${dom}. U.S. minimax: Accommodate (${Math.round(uAcc)}) beats Escalate (${Math.round(uEsc)}) by ${Math.round(E)} units. Sr coverage: ${srcPct}% of ${G+S} required.`;vEl.style.borderColor='#f87171';vEl.style.background='rgba(231,76,60,0.06)';}
    updateChart(G,S,H,E,Sr);
  }
  function updateChart(G,S,H,E,Sr){
    const srVals=Array.from({length:51},(_,i)=>i/50*(G+S+4));
    const datasets=[
      {label:'U.S. Accommodate',data:srVals.map(sr=>({x:sr,y:-H})),borderColor:'#f87171',borderWidth:2.5,pointRadius:0,tension:0},
      {label:'U.S. Escalate',data:srVals.map(sr=>({x:sr,y:-H-E})),borderColor:'#fca5a5',borderWidth:1.8,borderDash:[6,3],pointRadius:0,tension:0},
      {label:'Iran Yuan',data:srVals.map(sr=>({x:sr,y:G})),borderColor:'#86efac',borderWidth:2.5,pointRadius:0,tension:0},
      {label:'Iran Dollar (after Sr)',data:srVals.map(sr=>({x:sr,y:-S+sr})),borderColor:'#fde68a',borderWidth:1.8,borderDash:[5,3],pointRadius:0,tension:0},
    ];
    const annot={id:'a',afterDatasetsDraw(ch){
      const {ctx,scales:{x,y}}=ch;
      const sr=gv('Sr');
      const xPx=x.getPixelForValue(sr);
      ctx.save();ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(xPx,y.getPixelForValue(y.max));ctx.lineTo(xPx,y.getPixelForValue(y.min));ctx.stroke();ctx.setLineDash([]);
      // threshold
      const thX=x.getPixelForValue(G+S);
      ctx.strokeStyle='rgba(248,113,113,.5)';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
      ctx.beginPath();ctx.moveTo(thX,y.getPixelForValue(y.max));ctx.lineTo(thX,y.getPixelForValue(y.min));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#f87171';ctx.font='500 10px monospace';ctx.textAlign='center';
      ctx.fillText('Sr*='+(G+S),thX,y.getPixelForValue(y.max)+12);
      ctx.restore();
    }};
    const isDark=true,tc='#9ca3af',gc='rgba(255,255,255,.06)',zc='rgba(255,255,255,.18)';
    if(chart){chart.destroy();chart=null;}
    chart=new Chart(document.getElementById('sim-chart').getContext('2d'),{type:'line',data:{datasets},plugins:[annot],options:{responsive:true,maintainAspectRatio:false,animation:false,parsing:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1f2937',titleColor:'#e5e7eb',bodyColor:'#9ca3af',borderColor:'rgba(255,255,255,.1)',borderWidth:.5,padding:9,callbacks:{title:i=>'Sr = '+i[0].parsed.x.toFixed(1),label:i=>i.dataset.label+': '+(i.parsed.y>=0?'+':'')+Math.round(i.parsed.y*10)/10}}},scales:{x:{type:'linear',min:0,max:G+S+4,title:{display:true,text:'sanctions relief Sr',color:tc,font:{size:11}},grid:{color:gc},ticks:{color:tc,font:{size:10},callback:v=>Math.round(v*10)/10}},y:{title:{display:true,text:'payoff',color:tc,font:{size:11}},grid:{color:c=>c.tick?.value===0?zc:gc},ticks:{color:tc,font:{size:10},callback:v=>(v>=0?'+':'')+Math.round(v)}}}}});
  }
  ['G','S','H','E','Sr'].forEach(id=>document.getElementById('sim-'+id).addEventListener('input',calc));
  calc();
})();

document.getElementById('burger')?.addEventListener('click',function(){const l=document.querySelector('.nav-links');if(l){const o=l.style.display==='flex';l.style.cssText=o?'':'display:flex;flex-direction:column;position:absolute;top:56px;left:0;right:0;background:#0a1628;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.1)';}});
