// Hero canvas — cascade wave animation
(function(){
  const canvas=document.getElementById('hero-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');let W,H,dots=[];
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;init();}
  function init(){dots=[];for(let i=0;i<5;i++){for(let j=0;j<8;j++){dots.push({col:i,row:j,phase:i*.7+j*.4,triggered:false});}}}
  function draw(t){
    ctx.clearRect(0,0,W,H);
    const colW=W/9,rowH=H/6;
    dots.forEach(d=>{
      const x=(d.col+1)*colW,y=(d.row+1)*rowH*0.85+rowH*.1;
      const wave=Math.sin(t*.001-d.col*.8);
      const triggered=wave>.3;
      const alpha=triggered?(0.4+0.3*wave):(0.05+0.05*Math.abs(wave));
      const col=triggered?'16,185,129':'100,150,100';
      const r=triggered?5:3;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${col},${alpha})`;ctx.fill();
      if(triggered&&d.col>0){
        const px=(d.col)*colW,py=y;
        ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);
        ctx.strokeStyle=`rgba(16,185,129,${alpha*.5})`;ctx.lineWidth=1;ctx.stroke();
      }
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();

// Producers table
(function(){
  const el=document.getElementById('producers-table');if(!el)return;
  const states=[
    {name:'Saudi Arabia',gs:'3',ps:'14',fd:'3',bypass:'Yes (Yanbu 7M bpd)',mbridge:'Yes',status:'Watching'},
    {name:'UAE',gs:'4',ps:'10',fd:'4',bypass:'Yes (Fujairah 1.8M bpd)',mbridge:'Yes — central bank participant',status:'Ambiguous'},
    {name:'Iraq',gs:'4',ps:'8',fd:'2',bypass:'No — 100% Hormuz',mbridge:'Partial',status:'Watching'},
    {name:'Kuwait',gs:'3',ps:'9',fd:'2',bypass:'No — 100% Hormuz',mbridge:'No',status:'Watching'},
    {name:'Qatar',gs:'5',ps:'8',fd:'3',bypass:'No — 100% Hormuz (LNG)',mbridge:'Partial',status:'Watching'},
  ];
  el.innerHTML=`<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:13px;width:100%">
    <thead><tr style="background:var(--navy);color:#fff">
      <th style="padding:10px 14px;text-align:left;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.06em">State</th>
      <th style="padding:10px 14px;text-align:center;font-family:var(--mono);font-size:11px">G_s</th>
      <th style="padding:10px 14px;text-align:center;font-family:var(--mono);font-size:11px">P_s(0)</th>
      <th style="padding:10px 14px;text-align:center;font-family:var(--mono);font-size:11px">F_d</th>
      <th style="padding:10px 14px;text-align:left;font-family:var(--mono);font-size:11px">Bypass</th>
      <th style="padding:10px 14px;text-align:left;font-family:var(--mono);font-size:11px">mBridge</th>
      <th style="padding:10px 14px;text-align:center;font-family:var(--mono);font-size:11px">Status</th>
    </tr></thead>
    <tbody>${states.map((s,i)=>`<tr style="background:${i%2===0?'#fff':'var(--warm)'}">
      <td style="padding:10px 14px;font-weight:700;font-family:var(--mono);font-size:12px">${s.name}</td>
      <td style="padding:10px 14px;text-align:center;font-family:var(--mono);color:#27500a;font-weight:600">${s.gs}</td>
      <td style="padding:10px 14px;text-align:center;font-family:var(--mono);color:#c0392b;font-weight:600">${s.ps}</td>
      <td style="padding:10px 14px;text-align:center;font-family:var(--mono);color:#854f0b;font-weight:600">${s.fd}</td>
      <td style="padding:10px 14px;font-size:12px;color:#555">${s.bypass}</td>
      <td style="padding:10px 14px;font-size:12px;color:#555">${s.mbridge}</td>
      <td style="padding:10px 14px;text-align:center"><span style="font-family:var(--mono);font-size:10px;font-weight:600;padding:3px 8px;border-radius:2px;background:#faeeda;color:#854f0b">${s.status}</span></td>
    </tr>`).join('')}</tbody>
  </table></div>
  <p style="font-size:12px;color:#888;margin-top:.75rem;font-family:var(--mono)">F_d = asset-freeze fear (Russia 2022 precedent). G_s + F_d vs P_s(0) is the knife-edge condition before k effects apply.</p>`;
})();

// Sensitivity table — k* values
(function(){
  const nuVals=[1,2,3,4,5];
  const dVals=[0.05,0.10,0.15,0.20,0.25];
  const Gs=4,Ps0=12;
  function findKstar(nu,delta){
    for(let k=0;k<=20;k++){if(Gs+k*nu>Ps0*Math.pow(1-delta,k))return k;}
    return '∞';
  }
  const tbody=document.getElementById('sens-body');if(!tbody)return;
  nuVals.forEach(nu=>{
    const tr=document.createElement('tr');
    const lbl=document.createElement('td');lbl.textContent='ν='+nu;
    if(nu===3)lbl.style.color='#34d399';
    tr.appendChild(lbl);
    dVals.forEach((d,di)=>{
      const td=document.createElement('td');
      const val=findKstar(nu,d);
      const isCur=(nu===3&&di===2);
      td.textContent=isCur?'★ '+(val==='∞'?'∞':val):val;
      if(isCur)td.className='cell-current';
      else if(val==='∞'||val>=10)td.className='cell-max';
      else if(val>=6)td.className='cell-high';
      else if(val>=3)td.className='cell-mid';
      else td.className='cell-low';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
})();

// Examples
(function(){
  const examples=[
    {num:'01',title:'Euro adoption cascade (1999–2002)',params:'Analogue: ν=currency liquidity, δ=trade cost',res:'Self-completing',
     steps:[
      {label:'Network externality',eq:'Each eurozone member raised liquidity for the next (ν > 0)',note:'Euro adoption shows the same supermodular structure: each member made the euro more useful for the next. No member found it rational to reverse once the cascade passed ~8 members.'},
      {label:'Guarantee erosion equivalent',eq:'Cost of staying outside = trade friction with zone (δ grows with k)',note:'UK staying outside EUR faced rising trade costs as eurozone expanded. The "guarantee" of pound stability became less valuable as eurozone market share grew.'},
      {label:'Lesson for yuan cascade',eq:'Yuan cascade has stronger ν (energy invoicing > general trade) and stronger δ (military guarantee erodes faster than trade friction)',note:'Energy invoicing is a more concentrated cascade than general trade currency adoption. The Hormuz context compresses the timeline.'},
    ]},
    {num:'02',title:'mBridge CBDC platform — k = 0.5 equivalent',params:'Saudi + UAE central bank participation',res:'Infrastructure built',
     steps:[
      {label:'What mBridge represents',eq:'$55B+ processed by early 2026. Saudi + UAE CBs both participate.',note:'mBridge is the payment infrastructure that makes the yuan option viable at scale. Its operational record reduces switching friction — effectively raising ν for any state that participates.'},
      {label:'Why this is a cascade pre-condition',eq:'mBridge participation ≠ yuan pricing, but it reduces switching cost S_switch → 0',note:'A state on mBridge can switch to yuan pricing with near-zero technical friction. Without mBridge, switching requires bilateral clearing arrangements that take months. mBridge pre-positions Gulf states at the starting line.'},
      {label:'Strategic implication',eq:'k(mBridge) ≈ 0.5 already — cascade started before the war',note:'The March 2026 crisis did not start the cascade — it accelerated it. Saudi and UAE mBridge participation pre-2026 means k was already above zero before Hormuz closed.'},
    ]},
    {num:'03',title:'Russia 2022 — the F_d asset-freeze fear event',params:'F_d generated by $300B sovereign asset freeze',res:'δ amplified globally',
     steps:[
      {label:'The signal',eq:'$300B Russian sovereign assets frozen February 2022',note:'This event changed Gulf states\' calculation of the dollar system\'s risk profile. Saudi SAMA holds ~$448B in net foreign assets. UAE ADIA manages >$1T. The Russia precedent demonstrated dollar assets are geopolitical instruments.'},
      {label:'Effect on cascade equation',eq:'F_d enters as: G_s + kν + F_d > P_s(0)(1−δ)^k',note:'F_d = asset-freeze fear bonus. For Saudi Arabia and UAE, F_d ≈ 2–4 units, reflecting the probability-weighted cost of a future Russian-style freeze. This permanently lowered the switch threshold.'},
      {label:'k* falls when F_d > 0',eq:'k*(F_d=3) < k*(F_d=0) for all ν and δ',note:'Adding F_d shifts the LHS up, crossing the RHS sooner. The Russia precedent made the cascade faster without any action by Iran, China, or the Gulf states themselves.'},
    ]},
    {num:'04',title:'India bilateral deal — k raises above 1 (March 2026)',params:'k: Iran(1) + India(partial) ≈ 1.3',res:'Cascade advancing',
     steps:[
      {label:'India\'s deal structure',eq:'3 Iranian tankers freed; 2 LPG carriers transited 15 March with yuan settlement',note:'India is the world\'s third-largest oil importer and a non-Gulf actor. Its bilateral deal is k=0.3 equivalent — a partial signal that the yuan option is viable even for large importers.'},
      {label:'Effect on Gulf states\' P_s(0)',eq:'P_s(k≈1.3) = P_s(0)×(1−0.15)^1.3 ≈ 0.82×P_s(0)',note:'With Iran switched (k=1) and India partially accommodated (k≈1.3), the U.S. guarantee is already eroded by ~18% for Gulf states watching the situation.'},
      {label:'Turkey as k+= 0.1',eq:'Turkey (NATO member) bilateral deal: further erosion of alliance commitment',note:'A NATO member bypassing the coalition to secure yuan-condition transit is a high-salience signal to Gulf states. If Turkey won\'t enforce the dollar-denominated transit requirement, why would Gulf states?'},
    ]},
    {num:'05',title:'Saudi Arabia tipping point — the decisive scenario',params:'k: if Saudi starts yuan tranche for China',res:'Cascade goes irreversible',
     steps:[
      {label:'Saudi China crude context',eq:'Saudi Arabia prices some crude in yuan for Chinese buyers (post-June 2024 petrodollar expiry)',note:'Saudi Arabia declined to renew the informal petrodollar arrangement in June 2024. Some Chinese crude is already priced in yuan. A formal public tranche would be k += 1 for the cascade.'},
      {label:'Effect on cascade equation',eq:'k goes from ≈1.3 to ≈2.3. P_s(2.3) ≈ 0.70×P_s(0).',note:'A 30% erosion of the U.S. guarantee for remaining states. At this point the cascade crosses the tipping threshold — remaining Gulf states face a yuan side above the guarantee side.'},
      {label:'Why this is near the tipping threshold',eq:'Current yuan Hormuz share ≈10–15%. Tipping threshold ≈25–30%. Saudi yuan tranche could add 5–10%.',note:'Saudi Arabia\'s Chinese crude sales alone could push the yuan share through the 25–30% tipping zone where CIPS liquidity becomes self-sustaining without further state coordination.'},
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
  function findKstar(Gs,nu,Ps,delta,Fd){
    for(let k=0;k<=12;k++){if(Gs+k*nu+Fd>Ps*Math.pow(1-delta,k))return k;}
    return null;
  }
  function calc(){
    const Gs=gv('Gs')/10,nu=gv('nu')/10,Ps=gv('Ps')/10,deltaRaw=gv('delta'),Fd=gv('Fd')/10;
    const delta=deltaRaw/100;
    document.getElementById('sim-Gsv').textContent=Gs.toFixed(1);
    document.getElementById('sim-nuv').textContent=nu.toFixed(1);
    document.getElementById('sim-Psv').textContent=Ps.toFixed(1);
    document.getElementById('sim-deltav').textContent=delta.toFixed(2);
    document.getElementById('sim-Fdv').textContent=Fd.toFixed(1);
    const kstar=findKstar(Gs,nu,Ps,delta,Fd);
    const y0=Gs+Fd,g0=Ps,gap0=g0-y0;
    document.getElementById('sm-kstar').textContent=kstar===null?'Never':kstar;
    document.getElementById('sm-y0').textContent='+'+y0;
    document.getElementById('sm-g0').textContent=g0.toFixed(1);
    document.getElementById('sm-gap0').textContent=(gap0>0?'+':'')+gap0.toFixed(1);
    if(kstar!==null){const yk=Gs+kstar*nu+Fd,gk=Ps*Math.pow(1-delta,kstar);document.getElementById('sm-gapk').textContent='+'+(yk-gk).toFixed(1);}
    else{document.getElementById('sm-gapk').textContent='—';}
    // Check for passive cascade at current k=1.3
    const curK=1.3;
    const yuanAtCurK=Gs+curK*nu+Fd;
    const guarAtCurK=Ps*Math.pow(1-delta,curK);
    const passiveCascade=(yuanAtCurK>guarAtCurK);
    
    document.getElementById('sim-eq').textContent=`State switches at k where G_s+kν+F_d > P_s·(1-δ)^k  →  k* = ${kstar===null?'never (guarantee too strong)':kstar}`;
    const vEl=document.getElementById('sim-verdict');
    
    // Priority 1: Passive cascade warning (most dangerous)
    if(passiveCascade){
      vEl.textContent=`⚠️ PASSIVE CASCADE TRIGGERED: At current k=${curK} (Iran+India), yuan side (${yuanAtCurK.toFixed(1)}) EXCEEDS guarantee side (${guarAtCurK.toFixed(1)}). The cascade tipping condition is met passively — without any Gulf state formally announcing a yuan switch. This is the most dangerous mechanism: passive cascade triggered by P_s erosion rather than k accumulation. P_s has dropped below the threshold where the existing k is sufficient to tip the cascade.`;
      vEl.style.borderColor='#ef4444';vEl.style.background='rgba(239,68,68,0.12)';vEl.style.fontWeight='600';
    }
    // Priority 2: Normal cascade logic
    else if(kstar===null){vEl.textContent=`Cascade stalls. The U.S. guarantee is strong enough that the yuan option never crosses it. This requires either raising ν, raising F_d (Russia-style event), or lowering P_s(0) through a major U.S. credibility failure.`;vEl.style.borderColor='#f87171';vEl.style.background='rgba(231,76,60,0.06)';vEl.style.fontWeight='400';}
    else if(kstar<=2){vEl.textContent=`Fast cascade. Tipping point at only k*=${kstar} switchers. With k≈1.3 (Iran+India), the cascade may be within 1–2 further bilateral deals of the threshold.`;vEl.style.borderColor='#34d399';vEl.style.background='rgba(16,185,129,0.08)';vEl.style.fontWeight='400';}
    else{vEl.textContent=`Moderate cascade. k*=${kstar} switchers needed. Current k≈1.3. ${kstar-1} more major bilateral deals or Swing state switches required to reach tipping point.`;vEl.style.borderColor='#34d399';vEl.style.background='rgba(16,185,129,0.06)';vEl.style.fontWeight='400';}
    updateChart(Gs,nu,Ps,delta,Fd,kstar,passiveCascade,yuanAtCurK,guarAtCurK);
  }
  function updateChart(Gs,nu,Ps,delta,Fd,kstar,passiveCascade,yuanAtCurK,guarAtCurK){
    const kVals=Array.from({length:11},(_,i)=>i);
    const yuanSide=kVals.map(k=>Gs+k*nu+Fd);
    const guarSide=kVals.map(k=>Ps*Math.pow(1-delta,k));
    const isDark=true,tc='#9ca3af',gc='rgba(255,255,255,.06)';
    const annot={id:'a',afterDatasetsDraw(ch){
      const{ctx,scales:{x,y}}=ch;
      if(kstar!==null&&kstar<=10){
        const xPx=x.getPixelForValue(kstar);
        ctx.save();ctx.strokeStyle='rgba(52,211,153,.5)';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
        ctx.beginPath();ctx.moveTo(xPx,y.getPixelForValue(y.max));ctx.lineTo(xPx,y.getPixelForValue(y.min));ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#34d399';ctx.font='500 10px monospace';ctx.textAlign='center';
        ctx.fillText('k*='+kstar,xPx,y.getPixelForValue(y.max)+12);ctx.restore();
      }
      // current k marker with passive cascade indicator
      const curK=1.3;
      if(curK<=10){
        const xPx=x.getPixelForValue(curK);
        const markerColor=passiveCascade?'rgba(239,68,68,.8)':'rgba(251,191,36,.5)';
        const textColor=passiveCascade?'#ef4444':'#fbbf24';
        ctx.save();ctx.strokeStyle=markerColor;ctx.lineWidth=passiveCascade?2:1;ctx.setLineDash([3,3]);
        ctx.beginPath();ctx.moveTo(xPx,y.getPixelForValue(y.max));ctx.lineTo(xPx,y.getPixelForValue(y.min));ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle=textColor;ctx.font=passiveCascade?'700 11px monospace':'500 10px monospace';ctx.textAlign='center';
        ctx.fillText(passiveCascade?'⚠ now':'now',xPx,y.getPixelForValue(y.max)+12);
        // If passive cascade, add crossover annotation
        if(passiveCascade){
          const yY=y.getPixelForValue(yuanAtCurK);
          const yG=y.getPixelForValue(guarAtCurK);
          ctx.beginPath();ctx.arc(xPx,yY,5,0,Math.PI*2);ctx.fillStyle='rgba(52,211,153,.8)';ctx.fill();
          ctx.beginPath();ctx.arc(xPx,yG,5,0,Math.PI*2);ctx.fillStyle='rgba(248,113,113,.8)';ctx.fill();
        }
        ctx.restore();
      }
    }};
    const datasets=[
      {label:'Yuan side G_s+kν+F_d',data:kVals.map((k,i)=>({x:k,y:yuanSide[i]})),borderColor:'#34d399',backgroundColor:'rgba(52,211,153,0.06)',fill:true,borderWidth:2.5,pointRadius:4,tension:.3},
      {label:'Guarantee P_s(0)(1-δ)^k',data:kVals.map((k,i)=>({x:k,y:guarSide[i]})),borderColor:'#f87171',backgroundColor:'rgba(248,113,113,0.06)',fill:true,borderDash:[6,3],borderWidth:2,pointRadius:4,tension:.3},
    ];
    if(chart){chart.destroy();chart=null;}
    chart=new Chart(document.getElementById('sim-chart').getContext('2d'),{type:'line',data:{datasets},plugins:[annot],options:{responsive:true,maintainAspectRatio:false,animation:false,parsing:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1f2937',titleColor:'#e5e7eb',bodyColor:'#9ca3af',borderColor:'rgba(255,255,255,.1)',borderWidth:.5,padding:9,callbacks:{title:i=>'k = '+i[0].parsed.x,label:i=>i.dataset.label.split(' ')[0]+': '+i.parsed.y.toFixed(2)}}},scales:{x:{type:'linear',min:0,max:10,title:{display:true,text:'number of prior switchers k',color:tc,font:{size:11}},grid:{color:gc},ticks:{color:tc,font:{size:10},stepSize:1,callback:v=>Number.isInteger(v)?v:''}},y:{title:{display:true,text:'payoff',color:tc,font:{size:11}},grid:{color:gc},ticks:{color:tc,font:{size:10},callback:v=>Math.round(v*10)/10}}}}});
  }
  ['Gs','nu','Ps','delta','Fd'].forEach(id=>document.getElementById('sim-'+id).addEventListener('input',calc));
  calc();
})();

document.getElementById('burger')?.addEventListener('click',function(){const l=document.querySelector('.nav-links');if(l){const o=l.style.display==='flex';l.style.cssText=o?'':'display:flex;flex-direction:column;position:absolute;top:56px;left:0;right:0;background:#0a1628;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.1)';}});
