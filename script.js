let state = {pct:0,recovered:0,txCount:0,traceCount:0,caseId:'—',analyst:'—'}
  const fill=document.getElementById('fill'),pct=document.getElementById('pct'),
        rec=document.getElementById('recovered'),txCountEl=document.getElementById('txCount'),
        traceCountEl=document.getElementById('traceCount'),explorerLink=document.getElementById('explorerLink'),
        logEl=document.getElementById('log'),caseEl=document.getElementById('caseId'),
        analystEl=document.getElementById('analyst'),txList=document.getElementById('txList')

  function loadDashboard(e){
    e.preventDefault()
    state.caseId=document.getElementById('formCaseId').value
    state.analyst=document.getElementById('formAnalyst').value
    caseEl.textContent=state.caseId
    analystEl.textContent=state.analyst
    document.getElementById('entryForm').classList.add('hidden')
    document.getElementById('dashboard').classList.remove('hidden')
    updateUI()
    log('Case loaded: '+state.caseId+' | Analyst: '+state.analyst)
  }

  function log(msg){
    const ts=new Date().toISOString()
    logEl.innerHTML=`<div>[${ts}] ${msg}</div>`+logEl.innerHTML
  }

  function startDemo(){
    if(state.pct>0&&state.pct<100){ log('Already running');return }
    resetDemo(); log('Run started')
    const stages=[
      {dur:1200,addPct:10,action:'Tracing initial wallets'},
      {dur:1600,addPct:15,action:'Scanning transaction graph'},
      {dur:1800,addPct:25,action:'Verifying chain hops'},
      {dur:2000,addPct:20,action:'Notifying custodial partner'},
      {dur:1400,addPct:20,action:'Partial recovery executed'},
      {dur:800,addPct:10,action:'Finalizing report'}
    ]
    let i=0
    function nextStage(){
      if(i>=stages.length){state.pct=100;updateUI();log('Run completed');return}
      const s=stages[i++]; log(s.action)
      animateTo(state.pct+s.addPct,s.dur,()=>{
        if(s.action.includes('Partial recovery')){
          const recovered=Math.floor(600+Math.random()*850)
          state.recovered+=recovered
          log(`Partial recovery recorded: $${recovered}`)
          addDemoTx()
        }
        nextStage()
      })
    }
    nextStage()
  }

  function animateTo(target,ms,cb){
    const start=performance.now(),from=state.pct
    function step(now){
      const t=Math.min(1,(now-start)/ms)
      state.pct=Math.round(from+(target-from)*t)
      updateUI()
      if(t<1)requestAnimationFrame(step); else if(cb)cb()
    }
    requestAnimationFrame(step)
  }

  function updateUI(){
    fill.style.width=state.pct+'%'
    pct.textContent=state.pct+'%'
    rec.textContent='$'+state.recovered
    txCountEl.textContent=state.txCount
    traceCountEl.textContent=state.traceCount
    caseEl.textContent=state.caseId
    analystEl.textContent=state.analyst
    explorerLink.textContent=' Explorer link'
  }

  function resetDemo(){
    state.pct=0;state.recovered=0;state.txCount=0;state.traceCount=0
    txList.innerHTML='';logEl.innerHTML=''
    updateUI();log('Reset')
  }

  function addDemoTx(){
    const txid='0x'+Array.from({length:64}).map(()=>Math.floor(Math.random()*16).toString(16)).join('')
    const li=document.createElement('div')
    li.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap"><div><div class="tx">${txid}</div><div class="muted">Associated address: <span class="tx">CURRENT_ADDRESS</span></div></div><div><a target="_blank" href="#" class="muted">View</a></div></div>`
    txList.prepend(li)
    state.txCount++;state.traceCount=Math.max(1,state.traceCount)
    updateUI();log('Added TXID: '+txid)
  }