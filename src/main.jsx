import React, {useEffect, useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, Search, Link2, MessageSquareText, Phone, QrCode, History, Settings, LockKeyhole, AlertTriangle, CheckCircle2, ArrowUpRight, Clock3, Trash2 } from 'lucide-react';
import { analyzeRisk } from './riskEngine';
import './styles.css';

const samples = [
  {label:'Fake delivery SMS', value:'Your package is waiting. Pay $2.99 customs fee now: https://delivery-confirm.example/pay'},
  {label:'Suspicious investment', value:'Congratulations! You were selected for a guaranteed 300% crypto return. Send $500 today to activate your account.'},
  {label:'OTP request', value:'Your bank security team needs your verification code immediately. Reply with your OTP to prevent account suspension.'},
  {label:'Normal website', value:'https://www.wikipedia.org'}
];

const STORAGE_KEY = 'fraud-shield-history-v2';

function App(){
 const [input,setInput]=useState('');
 const [result,setResult]=useState(null);
 const [checks,setChecks]=useState(()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return []}});
 const [active,setActive]=useState('Protect');
 useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(checks))},[checks]);
 const run=(value=input)=>{if(!value.trim())return; const r=analyzeRisk(value); const item={text:value,...r,time:new Date().toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}; setResult(r); setChecks(c=>[item,...c.filter(x=>x.text!==value)].slice(0,20));};
 const status=useMemo(()=>result?.level||'Ready',[result]);
 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><div className="brandmark"><ShieldCheck size={20}/></div><div><strong>Fraud Shield</strong><span>Digital protection</span></div></div>
   <nav>{[['Protect',ShieldCheck],['History',History],['Settings',Settings]].map(([name,Icon])=><button key={name} className={active===name?'nav active':'nav'} onClick={()=>setActive(name)}><Icon size={18}/>{name}</button>)}</nav>
   <div className="sidebar-bottom"><div className="privacy"><LockKeyhole size={16}/><div><b>Your data stays yours</b><span>Scans are processed locally in this MVP.</span></div></div><div className="version">Fraud Shield · MVP 0.2</div></div>
  </aside>
  <main>
   <header><div><h1>Protect before you trust.</h1><p>Analyze a link, message, phone number or payment request for fraud signals.</p></div><div className="status"><span className="dot"/>Protection active</div></header>
   {active==='Protect' ? <>
   <section className="workspace">
    <div className="input-panel">
      <div className="panel-head"><div><span className="eyebrow">QUICK SCAN</span><h2>What looks suspicious?</h2></div><div className="input-types"><Link2/><MessageSquareText/><Phone/><QrCode/></div></div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste a URL, message, phone number, payment request or anything you want to check…" />
      <div className="input-footer"><span>{input.length} characters</span><button className="primary" onClick={()=>run()} disabled={!input.trim()}><Search size={17}/> Analyze now</button></div>
      <div className="samples"><span>Try an example</span>{samples.map(s=><button key={s.label} onClick={()=>{setInput(s.value);run(s.value)}}>{s.label}</button>)}</div>
    </div>
    <div className={'result-panel '+(result?result.level.toLowerCase():'empty')}>
      {result ? <>
        <div className="result-top"><span>SCAN RESULT</span><Clock3 size={15}/></div>
        <div className="score-row"><div className="score"><div className="score-inner"><strong>{result.score}</strong><span>/100</span></div></div><div><div className="risk-label">{result.level}</div><p>{result.level==='Safe'?'No strong warning signals found.':result.level==='Suspicious'?'Several signals deserve your attention.':'Do not click, pay, or share sensitive information.'}</p></div></div>
        <div className="result-meta"><span>Threat type</span><b>{result.attackType}</b><span>Confidence</span><b>{result.confidence}%</b></div>
        <div className="reasons"><h3>Why we flagged it</h3>{result.reasons.map((x,i)=><div className="reason" key={i}><AlertTriangle size={16}/><span>{x}</span></div>)}</div>
        <div className="recommend"><CheckCircle2 size={17}/><div><b>Recommended action</b><span>{result.level==='Safe'?'You can continue, but always verify unexpected requests.':result.level==='Suspicious'?'Verify the sender independently before taking any action.':'Do not interact with it. Contact the organization using an official channel.'}</span></div></div>
      </> : <div className="empty-state"><div className="big-shield"><ShieldCheck size={34}/></div><h2>Your safety check starts here</h2><p>Paste anything suspicious on the left. We’ll turn complex signals into a simple risk decision.</p></div>}
    </div>
   </section>
   <section className="lower"><div className="section-title"><div><h2>Recent checks</h2><p>Your latest scans appear here.</p></div><button onClick={()=>setChecks([])} disabled={!checks.length}><Trash2 size={15}/> Clear history</button></div>{checks.length===0?<div className="history-empty">No scans yet. Your results will appear here.</div>:<div className="history-list">{checks.slice(0,8).map((c,i)=><div className="history-item" key={c.text+i} onClick={()=>{setInput(c.text);setResult(c)}}><div className={'mini-icon '+c.level.toLowerCase()}>{c.level==='Safe'?<CheckCircle2 size={17}/>:<AlertTriangle size={17}/>}</div><div className="history-text"><b>{c.text.slice(0,74)}{c.text.length>74?'…':''}</b><span>{c.time}</span></div><span className={'tag '+c.level.toLowerCase()}>{c.level} · {c.score}</span><ArrowUpRight size={16}/></div>)}</div>}</section>
   </> : active==='History' ? <div className="placeholder"><div className="big-shield"><History size={34}/></div><h2>Scan history</h2><p>{checks.length} saved local checks. Return to Protect to run a new scan.</p></div> : <div className="placeholder"><div className="big-shield"><Settings size={34}/></div><h2>Settings</h2><p>Privacy-first local scanning is enabled. Cloud AI and reputation APIs will be added later.</p></div>}
   <footer>Fraud Shield is an early risk-screening tool, not a guarantee. Always verify important requests through trusted channels.</footer>
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);