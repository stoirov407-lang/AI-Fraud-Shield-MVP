import React, {useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, Search, Link2, MessageSquareText, Phone, QrCode, History, Settings, LockKeyhole, AlertTriangle, CheckCircle2, ArrowUpRight, Clock3 } from 'lucide-react';
import './styles.css';

const samples = [
  {label:'Fake delivery SMS', value:'Your package is waiting. Pay $2.99 customs fee now: https://delivery-confirm.example/pay', score:91, level:'Dangerous'},
  {label:'Suspicious investment', value:'Congratulations! You were selected for a guaranteed 300% crypto return. Send $500 today to activate your account.', score:84, level:'Dangerous'},
  {label:'Normal website', value:'https://www.wikipedia.org', score:4, level:'Safe'}
];

function analyze(input){
  const text=input.toLowerCase();
  let score=8, reasons=[];
  if(text.includes('http://')){score+=22; reasons.push('The link does not use encrypted HTTPS.');}
  if(text.includes('example')){score+=30; reasons.push('The domain looks like a placeholder or untrusted destination.');}
  if(/urgent|immediately|now|today|act fast/.test(text)){score+=18; reasons.push('Urgency language is commonly used in social-engineering attacks.');}
  if(/pay|payment|fee|send \$|transfer/.test(text)){score+=16; reasons.push('The message asks for money or payment details.');}
  if(/guaranteed|300%|profit|crypto return/.test(text)){score+=25; reasons.push('Guaranteed high returns are a major fraud warning sign.');}
  if(/password|otp|code|verification/.test(text)){score+=18; reasons.push('It requests sensitive authentication information.');}
  score=Math.min(99,score);
  const level=score>=70?'Dangerous':score>=35?'Suspicious':'Safe';
  if(!reasons.length) reasons=['No obvious fraud indicators were detected in this quick scan.'];
  return {score,level,reasons};
}

function App(){
 const [input,setInput]=useState('');
 const [result,setResult]=useState(null);
 const [checks,setChecks]=useState([]);
 const [active,setActive]=useState('Protect');
 const run=(value=input)=>{if(!value.trim())return; const r=analyze(value); setResult(r); setChecks(c=>[{text:value, ...r, time:'Just now'},...c].slice(0,4));};
 const status=useMemo(()=>result?.level||'Ready', [result]);
 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><div className="brandmark"><ShieldCheck size={20}/></div><div><strong>Fraud Shield</strong><span>Digital protection</span></div></div>
   <nav>{[['Protect',ShieldCheck],['History',History],['Settings',Settings]].map(([name,Icon])=><button key={name} className={active===name?'nav active':'nav'} onClick={()=>setActive(name)}><Icon size={18}/>{name}</button>)}</nav>
   <div className="sidebar-bottom"><div className="privacy"><LockKeyhole size={16}/><div><b>Your data stays yours</b><span>Scans are private in this MVP.</span></div></div><div className="version">Fraud Shield · MVP 0.1</div></div>
  </aside>
  <main>
   <header><div><h1>Protect before you trust.</h1><p>Analyze a link, message, phone number or payment request for fraud signals.</p></div><div className="status"><span className="dot"/>Protection active</div></header>
   {active==='Protect' ? <>
   <section className="workspace">
    <div className="input-panel">
      <div className="panel-head"><div><span className="eyebrow">QUICK SCAN</span><h2>What looks suspicious?</h2></div><div className="input-types"><Link2/><MessageSquareText/><Phone/><QrCode/></div></div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste a URL, message, phone number, payment request or anything you want to check…" />
      <div className="input-footer"><span>{input.length} characters</span><button className="primary" onClick={()=>run()}><Search size={17}/> Analyze now</button></div>
      <div className="samples"><span>Try an example</span>{samples.map(s=><button key={s.label} onClick={()=>{setInput(s.value);run(s.value)}}>{s.label}</button>)}</div>
    </div>
    <div className={'result-panel '+(result?result.level.toLowerCase():'empty')}>
      {result ? <>
        <div className="result-top"><span>SCAN RESULT</span><Clock3 size={15}/></div>
        <div className="score-row"><div className="score"><div className="score-inner"><strong>{result.score}</strong><span>/100</span></div></div><div><div className="risk-label">{result.level}</div><p>{result.level==='Safe'?'No strong warning signals found.':result.level==='Suspicious'?'Several signals deserve your attention.':'Do not click, pay, or share sensitive information.'}</p></div></div>
        <div className="reasons"><h3>Why we flagged it</h3>{result.reasons.map((x,i)=><div className="reason" key={i}><AlertTriangle size={16}/><span>{x}</span></div>)}</div>
        <div className="recommend"><CheckCircle2 size={17}/><div><b>Recommended action</b><span>{result.level==='Safe'?'You can continue, but always verify unexpected requests.':result.level==='Suspicious'?'Verify the sender independently before taking any action.':'Do not interact with it. Contact the organization using an official channel.'}</span></div></div>
      </> : <div className="empty-state"><div className="big-shield"><ShieldCheck size={34}/></div><h2>Your safety check starts here</h2><p>Paste anything suspicious on the left. We’ll turn complex signals into a simple risk decision.</p></div>}
    </div>
   </section>
   <section className="lower"><div className="section-title"><div><h2>Recent checks</h2><p>Your latest scans appear here.</p></div><button onClick={()=>setChecks([])}>Clear history</button></div>{checks.length===0?<div className="history-empty">No scans yet. Your results will appear here.</div>:<div className="history-list">{checks.map((c,i)=><div className="history-item" key={i}><div className={'mini-icon '+c.level.toLowerCase()}>{c.level==='Safe'?<CheckCircle2 size={17}/>:<AlertTriangle size={17}/>}</div><div className="history-text"><b>{c.text.slice(0,74)}{c.text.length>74?'…':''}</b><span>{c.time}</span></div><span className={'tag '+c.level.toLowerCase()}>{c.level} · {c.score}</span><ArrowUpRight size={16}/></div>)}</div>}</section>
   </> : <div className="placeholder"><div className="big-shield"><ShieldCheck size={34}/></div><h2>{active}</h2><p>This section is prepared for the next MVP step.</p></div>}
   <footer>Fraud Shield is an early risk-screening tool, not a guarantee. Always verify important requests through trusted channels.</footer>
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);