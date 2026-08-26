import React, {useEffect, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, Search, Link2, MessageSquareText, Phone, QrCode, History, Settings, LockKeyhole, AlertTriangle, CheckCircle2, ArrowUpRight, Clock3, Trash2, Zap, Smartphone, ClipboardCheck } from 'lucide-react';
import { analyzeRisk } from './riskEngine';
import './styles.css';

const samples = [
  {label:'Fake delivery SMS', value:'Your package is waiting. Pay $2.99 customs fee now: https://delivery-confirm.example/pay'},
  {label:'Investment scam', value:'Congratulations! You were selected for a guaranteed 300% crypto return. Send $500 today to activate your account.'},
  {label:'OTP request', value:'Your bank security team needs your verification code immediately. Reply with your OTP to prevent account suspension.'},
  {label:'Normal website', value:'https://www.wikipedia.org'}
];
const STORAGE_KEY = 'fraud-shield-history-v3';

function App(){
 const [input,setInput]=useState('');
 const [result,setResult]=useState(null);
 const [checks,setChecks]=useState(()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return []}});
 const [active,setActive]=useState('Protect');
 const [connected,setConnected]=useState(false);
 useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(checks))},[checks]);
 const run=(value=input, source='manual')=>{if(!value.trim())return; const r=analyzeRisk(value); const item={text:value,...r,time:new Date().toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}),source}; setResult(r); setChecks(c=>[item,...c.filter(x=>x.text!==value)].slice(0,20));};
 const handlePaste=(e)=>{const text=e.clipboardData?.getData('text')||''; if(text.trim()){setInput(text); setTimeout(()=>run(text,'auto-paste'),0)}};
 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><div className="brandmark"><ShieldCheck size={20}/></div><div><strong>Fraud Shield</strong><span>Digital protection</span></div></div>
   <nav>{[['Protect',ShieldCheck],['History',History],['Settings',Settings]].map(([name,Icon])=><button key={name} className={active===name?'nav active':'nav'} onClick={()=>setActive(name)}><Icon size={18}/>{name}</button>)}</nav>
   <div className="sidebar-bottom"><div className="privacy"><LockKeyhole size={16}/><div><b>Privacy-first MVP</b><span>Current scans run locally on this device.</span></div></div><div className="version">Fraud Shield · MVP 0.4</div></div>
  </aside>
  <main>
   <header><div><div className="kicker"><Zap size={13}/> AUTOMATIC PROTECTION</div><h1>Know before you click.</h1><p>Fraud Shield checks suspicious content and explains the risk in plain language.</p></div><div className="status"><span className="dot"/>{connected?'Protection connected':'Protection ready'}</div></header>
   {active==='Protect' ? <>
   <section className="connect-card"><div className="connect-icon"><Smartphone size={20}/></div><div className="connect-copy"><b>Hybrid protection</b><span>Paste or share anything suspicious and it is checked automatically. Native mobile protection will later scan supported SMS, notifications and links in the background.</span></div><button className={connected?'connected':'connect'} onClick={()=>setConnected(true)}>{connected?'Connected':'Enable protection'}</button></section>
   <section className="workspace">
    <div className="input-panel">
      <div className="panel-head"><div><span className="eyebrow">AUTOMATIC SCAN</span><h2>Drop it here — we’ll check it</h2></div><div className="input-types"><Link2/><MessageSquareText/><Phone/><QrCode/></div></div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} onPaste={handlePaste} placeholder="Paste a URL, SMS, message, phone number or payment request…" />
      <div className="auto-hint"><ClipboardCheck size={14}/><span>Tip: paste from your SMS or messenger. The scan starts automatically.</span></div>
      <div className="input-footer"><span>{input.length} characters</span><button className="primary" onClick={()=>run()} disabled={!input.trim()}><Search size={17}/> Check now</button></div>
      <div className="samples"><span>Test it</span>{samples.map(s=><button key={s.label} onClick={()=>{setInput(s.value);run(s.value,'example')}}>{s.label}</button>)}</div>
    </div>
    <div className={'result-panel '+(result?result.level.toLowerCase():'empty')}>
      {result ? <>
        <div className="result-top"><span>SCAN RESULT · {result.engine}</span><Clock3 size={15}/></div>
        <div className="score-row"><div className="score"><div className="score-inner"><strong>{result.score}</strong><span>/100</span></div></div><div><div className="risk-label">{result.level}</div><p>{result.level==='Safe'?'No strong warning signals found.':result.level==='Suspicious'?'Pause and verify before taking action.':'Do not click, pay, reply, or share sensitive information.'}</p></div></div>
        <div className="result-meta"><span>Threat type</span><b>{result.attackType}</b><span>Confidence</span><b>{result.confidence}%</b></div>
        <div className="reasons"><h3>Why this matters</h3>{result.reasons.map((x,i)=><div className="reason" key={i}><AlertTriangle size={16}/><span>{x}</span></div>)}</div>
        <div className="recommend"><CheckCircle2 size={17}/><div><b>What should you do?</b><span>{result.level==='Safe'?'Continue normally, but verify unexpected requests.':result.level==='Suspicious'?'Do not act yet. Verify the sender using an official channel.':'Do not interact. Contact the organization using an official website or phone number.'}</span></div></div>
      </> : <div className="empty-state"><div className="big-shield"><ShieldCheck size={34}/></div><h2>We’ll watch the risk for you</h2><p>Paste or share suspicious content. Fraud Shield automatically analyzes it and turns technical signals into one clear decision.</p><div className="steps"><span><b>1</b>Paste/share</span><span><b>2</b>Auto-check</span><span><b>3</b>Know what to do</span></div></div>}
    </div>
   </section>
   <section className="lower"><div className="section-title"><div><h2>Recent checks</h2><p>Saved only on this device in the MVP.</p></div><button onClick={()=>setChecks([])} disabled={!checks.length}><Trash2 size={15}/> Clear</button></div>{checks.length===0?<div className="history-empty">Nothing checked yet.</div>:<div className="history-list">{checks.slice(0,8).map((c,i)=><div className="history-item" key={c.text+i} onClick={()=>{setInput(c.text);setResult(c)}}><div className={'mini-icon '+c.level.toLowerCase()}>{c.level==='Safe'?<CheckCircle2 size={17}/>:<AlertTriangle size={17}/>}</div><div className="history-text"><b>{c.text.slice(0,74)}{c.text.length>74?'…':''}</b><span>{c.time} · {c.source==='auto-paste'?'automatic':'checked'}</span></div><span className={'tag '+c.level.toLowerCase()}>{c.level} · {c.score}</span><ArrowUpRight size={16}/></div>)}</div>}</section>
   </> : active==='History' ? <div className="placeholder"><div className="big-shield"><History size={34}/></div><h2>Scan history</h2><p>{checks.length} saved local checks.</p></div> : <div className="placeholder"><div className="big-shield"><Settings size={34}/></div><h2>Settings</h2><p>Hybrid protection is designed to combine automatic device-level checks with AI cloud analysis when enabled.</p></div>}
   <footer>Fraud Shield is an early risk-screening tool, not a guarantee. Never share passwords, OTPs or private keys because an app tells you to.</footer>
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);