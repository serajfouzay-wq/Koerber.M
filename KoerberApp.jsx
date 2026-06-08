import React, { useState, useEffect, useRef } from "react";

const C = {
  indigo:"#6366F1", indigoDark:"#4F46E5", indigoLight:"#EEF2FF",
  pink:"#EC4899", pinkLight:"#FDF2F8",
  grad:"linear-gradient(135deg,#6366F1 0%,#EC4899 100%)",
  bg:"#F0F4FF", white:"#FFFFFF",
  text:"#1E1B4B", textMid:"#64748B", textLight:"#94A3B8",
  border:"#E0E7FF", borderMid:"#C7D2FE",
  green:"#10B981", greenLight:"#D1FAE5",
  red:"#EF4444", redLight:"#FEE2E2",
  yellow:"#F59E0B", yellowLight:"#FEF3C7",
};

const INIT_GUESTS = [
  {id:"s1",name:"Ahmad Al-Rashid",  email:"ahmad@koerber.com",  pax:2,dietary:"Non-Veg",    regNo:"K001",attended:false,rsvpStatus:"confirmed"},
  {id:"s2",name:"Sarah Chen",       email:"sarah@koerber.com",  pax:1,dietary:"Vegetarian", regNo:"K002",attended:true, rsvpStatus:"confirmed",attendedAt:"09:12 AM"},
  {id:"s3",name:"James O Brien",    email:"james@koerber.com",  pax:2,dietary:"No Preference",regNo:"K003",attended:false,rsvpStatus:"confirmed"},
  {id:"s4",name:"Priya Nair",       email:"priya@koerber.com",  pax:1,dietary:"Vegan",      regNo:"K004",attended:true, rsvpStatus:"confirmed",attendedAt:"09:31 AM"},
  {id:"s5",name:"Michael Hoffmann", email:"michael@koerber.com",pax:3,dietary:"Non-Veg",    regNo:"K005",attended:false,rsvpStatus:"confirmed"},
];

const INIT_EVENT = {
  title:"Koerber Innovation Summit",
  year:"2025",
  date:"Friday, 18 July 2025",
  time:"6:30 PM - 10:00 PM",
  venue:"Marina Bay Sands, Singapore",
  dresscode:"Business Casual",
  emailSubject:"Registration Confirmed - Koerber Innovation Summit",
  emailBody:"Dear name,\n\nYour registration has been confirmed.\n\nDate: date\nTime: time\nVenue: venue\nDress Code: dresscode\n\nPlease present your QR code at the entrance.\n\nBest regards,\nKoerber Team",
};

const uid = () => "u" + Date.now().toString(36);

function Particles({ count = 50, color = "#6366F1" }) {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const hex = color.replace("#","");
    const r=parseInt(hex.slice(0,2),16), g=parseInt(hex.slice(2,4),16), b=parseInt(hex.slice(4,6),16);
    const particles = Array.from({length:count}, () => ({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      radius:Math.random()*2.5+0.5, dx:(Math.random()-0.5)*0.4,
      dy:-Math.random()*0.5-0.2, alpha:Math.random()*0.5+0.15,
      pink: Math.random()>0.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle = p.pink ? `rgba(236,72,153,${p.alpha})` : `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -5) { p.y = canvas.height+5; p.x = Math.random()*canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [count, color]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

function QRBox({ value, size=160 }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current || !value) return;
    ref.current.innerHTML = "";
    const loadQR = () => new Promise((ok, no) => {
      if (window.QRCode) { ok(); return; }
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      s.onload = ok; s.onerror = no;
      document.head.appendChild(s);
    });
    loadQR().then(() => {
      if (!ref.current) return;
      ref.current.innerHTML = "";
      new window.QRCode(ref.current, {
        text: value, width: size, height: size,
        colorDark:"#1E1B4B", colorLight:"#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    }).catch(() => {});
  }, [value, size]);
  return <div ref={ref} style={{display:"inline-block"}}/>;
}

function Logo({ size=36 }) {
  const r=size*0.28, cx1=size*0.32, cx2=size*0.68, cy=size*0.3;
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:size*0.22}}>
      <svg width={size} height={size*0.62} viewBox={"0 0 "+size+" "+(size*0.62)} fill="none">
        <defs>
          <linearGradient id="kg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.indigo}/>
            <stop offset="100%" stopColor={C.pink}/>
          </linearGradient>
        </defs>
        <circle cx={cx1} cy={cy} r={r} stroke="url(#kg)" strokeWidth={size*0.06} fill="none"/>
        <circle cx={cx2} cy={cy} r={r} stroke="url(#kg)" strokeWidth={size*0.06} fill="none" opacity="0.7"/>
      </svg>
      <div>
        <div style={{fontWeight:800,fontSize:size*0.42,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:size*0.05,lineHeight:1}}>KOERBER</div>
        {size>=30 && <div style={{fontSize:size*0.2,color:C.textLight,letterSpacing:size*0.04,fontWeight:500,textTransform:"uppercase",lineHeight:1,marginTop:1}}>Technology Group</div>}
      </div>
    </div>
  );
}

function Nav({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const go = p => { setPage(p); setOpen(false); };
  const links = [["home","Home"],["rsvp","RSVP"],["checkin","Check-In"],["admin","Admin"]];
  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid "+C.border,height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px"}}>
        <div onClick={()=>go("home")} style={{cursor:"pointer"}}><Logo size={30}/></div>
        <div style={{display:"flex",gap:5}} className="nav-d">
          {links.map(([id,lbl])=>(
            <button key={id} onClick={()=>go(id)} style={{background:page===id?C.grad:"transparent",color:page===id?"#fff":C.textMid,border:"1px solid "+(page===id?"transparent":C.border),borderRadius:6,padding:"6px 14px",fontSize:13,fontWeight:page===id?700:500,cursor:"pointer",transition:"all 0.15s"}}>
              {lbl}
            </button>
          ))}
        </div>
        <button onClick={()=>setOpen(v=>!v)} className="nav-b" style={{display:"none",background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.text}}>
          {open?"X":"="}
        </button>
      </nav>
      {open && (
        <div style={{position:"fixed",top:58,left:0,right:0,zIndex:99,background:C.white,borderBottom:"1px solid "+C.border}}>
          {links.map(([id,lbl])=>(
            <button key={id} onClick={()=>go(id)} style={{display:"block",width:"100%",background:"none",border:"none",borderBottom:"1px solid "+C.border,color:page===id?C.indigo:C.text,padding:"14px 20px",fontSize:15,fontWeight:page===id?700:400,textAlign:"left",cursor:"pointer"}}>{lbl}</button>
          ))}
        </div>
      )}
      <style>{"@media(max-width:600px){.nav-d{display:none!important}.nav-b{display:block!important}}@media(min-width:601px){.nav-b{display:none!important}}"}</style>
    </>
  );
}

function Home({ setPage, event, guests }) {
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px 40px",position:"relative",overflow:"hidden"}}>
      <Particles count={60} color={C.indigo}/>
      <div style={{position:"absolute",top:"10%",right:"-8%",width:"clamp(250px,40vw,450px)",height:"clamp(250px,40vw,450px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"5%",left:"-8%",width:"clamp(200px,35vw,380px)",height:"clamp(200px,35vw,380px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(236,72,153,0.08),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",textAlign:"center",maxWidth:640,animation:"fadeIn 0.5s ease both"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:28}}><Logo size={56}/></div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:C.indigoLight,border:"1px solid "+C.borderMid,borderRadius:20,padding:"5px 16px",marginBottom:18}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:C.green,display:"inline-block"}}/>
          <span style={{fontSize:12,color:C.indigo,fontWeight:600,letterSpacing:0.5}}>Registration Now Open</span>
        </div>
        <h1 style={{fontSize:"clamp(32px,7vw,60px)",fontWeight:900,color:C.text,lineHeight:1.05,margin:"0 0 14px",letterSpacing:-1}}>{event.title}</h1>
        <p style={{fontSize:"clamp(14px,2.5vw,17px)",color:C.textMid,margin:"0 0 8px"}}>Date: {event.date}</p>
        <p style={{fontSize:"clamp(13px,2vw,15px)",color:C.textMid,margin:"0 0 36px"}}>{event.time} - {event.venue}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
          <button onClick={()=>setPage("rsvp")} style={{background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"14px clamp(22px,4vw,36px)",fontSize:"clamp(13px,2.5vw,15px)",fontWeight:800,cursor:"pointer",letterSpacing:0.3}}>
            Register Now
          </button>
          <button onClick={()=>setPage("checkin")} style={{background:"transparent",color:C.indigo,border:"1.5px solid "+C.indigo,borderRadius:8,padding:"13px 24px",fontSize:"clamp(12px,2vw,14px)",fontWeight:700,cursor:"pointer"}}>
            Staff Check-In
          </button>
        </div>
        <div style={{display:"flex",background:C.white,borderRadius:14,border:"1px solid "+C.border,overflow:"hidden",boxShadow:"0 4px 20px rgba(99,102,241,0.08)"}}>
          {[[guests.length,"Registered"],[guests.filter(g=>g.attended).length,"Checked In"],["200","Capacity"],["Free","Entry"]].map(([n,l],i)=>(
            <div key={l} style={{flex:1,padding:"clamp(12px,2vw,18px) 8px",textAlign:"center",borderRight:i<3?"1px solid "+C.border:"none"}}>
              <div style={{fontWeight:800,fontSize:"clamp(18px,3vw,24px)",background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
              <div style={{fontSize:"clamp(9px,1.5vw,11px)",color:C.textLight,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:"absolute",bottom:20,fontSize:11,color:C.textLight}}>
        <a href="https://www.koerber.com/en" target="_blank" rel="noreferrer" style={{color:C.textLight,textDecoration:"none",textTransform:"uppercase",letterSpacing:1}}>koerber.com</a>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}"}</style>
    </div>
  );
}

function RSVP({ guests, setGuests, event }) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pax,setPax]=useState(1);
  const [dietary,setDietary]=useState("No Preference");
  const [err,setErr]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [done,setDone]=useState(null);
  const iStyle={width:"100%",border:"1.5px solid "+C.borderMid,borderRadius:8,padding:"11px 14px",fontSize:14,color:C.text,background:"#FAFBFF",outline:"none"};

  const submit = async () => {
    setErr("");
    if (!name.trim()){setErr("Please enter your full name.");return;}
    if (!email.includes("@")){setErr("Please enter a valid email address.");return;}
    setSubmitting(true);
    await new Promise(r=>setTimeout(r,600));
    const regNo="K"+String(guests.length+1).padStart(3,"0");
    const guest={id:uid(),name:name.trim(),email:email.trim().toLowerCase(),pax,dietary,regNo,attended:false,rsvpStatus:"confirmed",createdAt:new Date().toISOString()};
    setGuests(prev=>[...prev,guest]);
    setDone(guest);
    setSubmitting(false);
  };

  if (done) {
    const qrVal="KOERBER|"+done.regNo+"|"+done.name+"|"+done.id;
    return (
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 20px 40px"}}>
        <div id="rsvp-card" style={{background:C.white,borderRadius:16,boxShadow:"0 4px 24px rgba(99,102,241,0.1)",border:"1px solid "+C.border,maxWidth:480,width:"100%",padding:"clamp(24px,5vw,44px)",textAlign:"center"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.greenLight,border:"2px solid "+C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:26,color:C.green}}>checkmark</div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:C.indigo,textTransform:"uppercase",marginBottom:6}}>Registration Confirmed</div>
          <h2 style={{fontSize:"clamp(20px,4vw,26px)",fontWeight:800,color:C.text,margin:"0 0 4px"}}>{done.name}</h2>
          <p style={{fontSize:13,color:C.textMid,margin:"0 0 24px"}}>{event.title} - {event.date}</p>
          <div style={{background:"linear-gradient(135deg,#1E1B4B,#312E81,#4C1D95)",borderRadius:16,padding:"clamp(20px,4vw,32px)",marginBottom:20,width:"100%"}}>
            <div style={{background:"#fff",borderRadius:12,padding:12,display:"inline-block",boxShadow:"0 0 0 4px rgba(236,72,153,0.4)",marginBottom:14}}>
              <QRBox value={qrVal} size={160}/>
            </div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Registration Number</div>
            <div style={{background:"linear-gradient(135deg,#A5B4FC,#F9A8D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"monospace",fontSize:28,fontWeight:900,letterSpacing:6}}>{done.regNo}</div>
            <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,textAlign:"left"}}>
              {[["Name",done.name],["Email",done.email],["Pax",done.pax],["Dietary",done.dietary]].map(([k,v])=>(
                <div key={k} style={{background:"rgba(255,255,255,0.07)",borderRadius:6,padding:"8px 10px"}}>
                  <div style={{color:"rgba(255,255,255,0.35)",fontSize:9,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{k}</div>
                  <div style={{color:"#E0E7FF",fontSize:12,fontWeight:600,wordBreak:"break-all"}}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:C.indigoLight,borderRadius:10,padding:"14px 16px",marginBottom:16,textAlign:"left"}}>
            {[["Date:",event.date],["Time:",event.time],["Venue:",event.venue],["Dress:",event.dresscode]].map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:8,marginBottom:5,fontSize:13}}><span style={{fontWeight:600,color:C.indigo,minWidth:48}}>{k}</span><span style={{color:C.text}}>{v}</span></div>
            ))}
          </div>
          <p style={{fontSize:12,color:C.textLight,marginBottom:20}}>Screenshot or print your QR code to present at check-in.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={()=>{const card=document.getElementById("rsvp-card");const w=window.open("","_blank");w.document.write("<!DOCTYPE html><html><head><title>QR</title><style>body{margin:0;background:#F0F4FF;display:flex;justify-content:center;padding:40px;font-family:sans-serif;}</style></head><body>"+card.outerHTML+"</body></html>");w.document.close();setTimeout(()=>w.print(),500);}}
              style={{width:"100%",background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
              Save / Print QR Card
            </button>
            <button onClick={()=>{setDone(null);setName("");setEmail("");setPax(1);setDietary("No Preference");}}
              style={{width:"100%",background:"transparent",color:C.indigo,border:"1.5px solid "+C.indigo,borderRadius:8,padding:"12px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 20px 40px"}}>
      <div style={{maxWidth:500,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Logo size={40}/>
          <h2 style={{fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:C.text,margin:"18px 0 4px"}}>Event Registration</h2>
          <p style={{color:C.textMid,fontSize:13}}>{event.title} - {event.date}</p>
        </div>
        <div style={{background:C.white,borderRadius:16,boxShadow:"0 4px 24px rgba(99,102,241,0.1)",border:"1px solid "+C.border,padding:"clamp(20px,5vw,36px)"}}>
          {err&&<div style={{background:C.redLight,border:"1px solid "+C.red,borderRadius:8,padding:"10px 14px",marginBottom:14,color:C.red,fontSize:13}}>Warning: {err}</div>}
          {[["Full Name",name,setName,"text","Your full name"],["Email Address",email,setEmail,"email","your@email.com"]].map(([lbl,val,set,type,ph])=>(
            <div key={lbl} style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{lbl}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={iStyle}
                onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
            </div>
          ))}
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>Number of Guests</label>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setPax(Math.max(1,pax-1))} style={{width:40,height:40,borderRadius:8,border:"1.5px solid "+C.borderMid,background:C.white,color:C.indigo,fontSize:22,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
              <div style={{flex:1,textAlign:"center",background:C.indigoLight,border:"1.5px solid "+C.borderMid,borderRadius:8,padding:"10px",fontWeight:800,fontSize:18,color:C.indigo}}>{pax}</div>
              <button onClick={()=>setPax(Math.min(10,pax+1))} style={{width:40,height:40,borderRadius:8,border:"1.5px solid "+C.borderMid,background:C.white,color:C.indigo,fontSize:22,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Dietary Preference</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8}}>
              {[["No Preference"],["Non-Veg"],["Vegetarian"],["Vegan"]].map(([val])=>(
                <button key={val} onClick={()=>setDietary(val)}
                  style={{background:dietary===val?"linear-gradient(135deg,#EEF2FF,#FDF2F8)":C.white,color:dietary===val?C.indigo:C.textMid,border:"1.5px solid "+(dietary===val?C.indigo:C.border),borderRadius:10,padding:"10px 6px",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.15s"}}>
                  {val}
                </button>
              ))}
            </div>
          </div>
          <button onClick={submitting?undefined:submit} disabled={submitting}
            style={{width:"100%",background:submitting?"#E0E7FF":C.grad,color:submitting?C.textMid:"#fff",border:"none",borderRadius:8,padding:"14px",fontSize:15,fontWeight:800,cursor:submitting?"not-allowed":"pointer",letterSpacing:0.3}}>
            {submitting?"Registering...":"Confirm Registration"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckIn({ guests, setGuests }) {
  const [pinOk,setPinOk]=useState(false);
  const [pin,setPin]=useState("");
  const [pinErr,setPinErr]=useState("");
  const [manual,setManual]=useState("");
  const [result,setResult]=useState(null);
  const [log,setLog]=useState([]);
  const [scanning,setScanning]=useState(false);
  const videoRef=useRef(),streamRef=useRef(),timerRef=useRef();
  const DEMO_PIN="1234";

  const processGuest=id=>{
    const g=guests.find(x=>x.regNo===id.trim().toUpperCase()||x.name.toLowerCase().includes(id.toLowerCase().trim())||x.id===id);
    if(!g){setResult({ok:false,msg:"Not found: "+id});return;}
    if(g.attended){setResult({ok:"dup",msg:"Already checked in: "+g.name+" at "+g.attendedAt});return;}
    const up={...g,attended:true,attendedAt:new Date().toLocaleTimeString()};
    setGuests(prev=>prev.map(x=>x.id===g.id?up:x));
    setLog(prev=>[up,...prev].slice(0,20));
    setResult({ok:true,guest:up});
  };

  const startScan=()=>{
    navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(stream=>{
      streamRef.current=stream;videoRef.current.srcObject=stream;setScanning(true);
      const doScan=()=>{
        const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
        timerRef.current=setInterval(()=>{
          if(!videoRef.current||!videoRef.current.videoWidth)return;
          canvas.width=videoRef.current.videoWidth;canvas.height=videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current,0,0);
          if(window.jsQR){
            const d=ctx.getImageData(0,0,canvas.width,canvas.height);
            const code=window.jsQR(d.data,d.width,d.height);
            if(code&&code.data){clearInterval(timerRef.current);stream.getTracks().forEach(t=>t.stop());setScanning(false);const parts=code.data.split("|");processGuest(parts[1]||parts[0]);}
          }
        },300);
      };
      if(window.jsQR){doScan();return;}
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js";
      s.onload=doScan;document.head.appendChild(s);
    }).catch(e=>setResult({ok:false,msg:"Camera: "+e.message}));
  };
  const stopScan=()=>{clearInterval(timerRef.current);if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());setScanning(false);};
  useEffect(()=>()=>stopScan(),[]);

  const confirmed=guests,checkedIn=guests.filter(g=>g.attended);
  const iStyle={width:"100%",border:"1.5px solid "+C.borderMid,borderRadius:8,padding:"11px 14px",fontSize:14,color:C.text,background:"#FAFBFF",outline:"none"};

  if(!pinOk)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px"}}>
      <div style={{background:C.white,borderRadius:16,boxShadow:"0 4px 24px rgba(99,102,241,0.1)",border:"1px solid "+C.border,width:"min(400px,100%)",padding:"clamp(24px,5vw,40px)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Logo size={36}/>
          <h2 style={{fontSize:20,fontWeight:800,color:C.text,margin:"18px 0 4px"}}>Staff Check-In</h2>
          <div style={{background:C.indigoLight,borderRadius:6,padding:"5px 14px",display:"inline-block",marginTop:8,fontSize:11,color:C.indigo,fontWeight:600}}>Demo PIN: 1234</div>
        </div>
        {pinErr&&<div style={{background:C.redLight,border:"1px solid "+C.red,borderRadius:8,padding:"8px 12px",color:C.red,fontSize:13,marginBottom:12}}>{pinErr}</div>}
        <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="Staff PIN"
          onKeyDown={e=>e.key==="Enter"&&(pin===DEMO_PIN?setPinOk(true):setPinErr("Incorrect PIN."))}
          style={{...iStyle,marginBottom:12}} onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
        <button onClick={()=>pin===DEMO_PIN?setPinOk(true):setPinErr("Incorrect PIN.")}
          style={{width:"100%",background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Continue
        </button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,padding:"80px 20px 40px"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,26px)",fontWeight:800,color:C.text,marginBottom:4}}>Check-In</h2>
        <p style={{color:C.textMid,fontSize:13,marginBottom:20}}>{checkedIn.length} of {confirmed.length} checked in</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
          {[[confirmed.length,"Total",C.indigoLight,C.indigo],[checkedIn.length,"In",C.greenLight,C.green],[confirmed.length-checkedIn.length,"Pending",C.yellowLight,C.yellow]].map(([n,l,bg,col])=>(
            <div key={l} style={{background:bg,borderRadius:10,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:26,fontWeight:800,color:col}}>{n}</div>
              <div style={{fontSize:10,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
            </div>
          ))}
        </div>
        {result&&(
          <div style={{background:result.ok===true?C.greenLight:result.ok==="dup"?C.yellowLight:C.redLight,border:"1px solid "+(result.ok===true?C.green:result.ok==="dup"?C.yellow:C.red),borderRadius:10,padding:"14px 18px",marginBottom:14}}>
            {result.ok===true&&<div><div style={{fontWeight:700,color:C.green,fontSize:15,marginBottom:2}}>Checked In!</div><div style={{color:"#064E3B",fontSize:13}}>{result.guest.name} - #{result.guest.regNo} - {result.guest.attendedAt}</div></div>}
            {result.ok==="dup"&&<div style={{color:"#92400E",fontSize:14}}>Already checked in: {result.msg}</div>}
            {result.ok===false&&<div style={{color:C.red,fontSize:14}}>Not found: {result.msg}</div>}
          </div>
        )}
        <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,padding:18,marginBottom:12}}>
          <video ref={videoRef} autoPlay playsInline muted style={{width:"100%",borderRadius:8,display:scanning?"block":"none",border:"2px solid "+C.indigo,marginBottom:10}}/>
          {!scanning
            ?<button onClick={startScan} style={{width:"100%",background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Scan QR Code</button>
            :<button onClick={stopScan} style={{width:"100%",background:C.redLight,color:C.red,border:"1px solid "+C.red,borderRadius:8,padding:"12px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Stop Camera</button>
          }
        </div>
        <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,padding:18,marginBottom:18}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Manual Lookup</label>
          <div style={{display:"flex",gap:8}}>
            <input value={manual} onChange={e=>setManual(e.target.value)} placeholder="Name or Reg No (K001)"
              onKeyDown={e=>e.key==="Enter"&&(processGuest(manual),setManual(""))}
              style={{flex:1,border:"1.5px solid "+C.borderMid,borderRadius:8,padding:"11px 14px",fontSize:14,color:C.text,background:"#FAFBFF",outline:"none"}}
              onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
            <button onClick={()=>{processGuest(manual);setManual("");}} style={{background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"0 18px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Go</button>
          </div>
        </div>
        {log.length>0&&(
          <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:"12px 18px",borderBottom:"1px solid "+C.border,fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase"}}>Recent</div>
            {log.slice(0,5).map(g=>(
              <div key={g.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 18px",borderBottom:"1px solid "+C.border}}>
                <div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{g.name}</div><div style={{fontSize:11,color:C.textMid}}>Pax {g.pax}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:C.indigo}}>{g.regNo}</div><div style={{fontSize:10,color:C.textLight}}>{g.attendedAt}</div></div>
              </div>
            ))}
          </div>
        )}
        <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:"1px solid "+C.border,fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase"}}>All Registrations</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:C.bg}}>{["Name","Email","Pax","Reg#","Status"].map(h=><th key={h} style={{padding:"10px 14px",color:C.textMid,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>
                {guests.map(g=>(
                  <tr key={g.id} style={{borderTop:"1px solid "+C.border}}>
                    <td style={{padding:"10px 14px",fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{g.name}</td>
                    <td style={{padding:"10px 14px",color:C.textMid,fontSize:12}}>{g.email}</td>
                    <td style={{padding:"10px 14px",color:C.textMid}}>{g.pax}</td>
                    <td style={{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:C.indigo}}>{g.regNo}</td>
                    <td style={{padding:"10px 14px"}}><span style={{background:g.attended?C.greenLight:C.indigoLight,color:g.attended?C.green:C.indigo,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{g.attended?"In":"Pending"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Admin({ guests, setGuests, event, setEvent }) {
  const [authed,setAuthed]=useState(false);
  const [pass,setPass]=useState("");
  const [passErr,setPassErr]=useState("");
  const [tab,setTab]=useState("event");
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [newP,setNewP]=useState({name:"",email:"",pax:1,dietary:"No Preference"});
  const DEMO_PASS="admin123";
  const iStyle={width:"100%",border:"1.5px solid "+C.borderMid,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.text,background:"#FAFBFF",outline:"none"};

  if(!authed)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px"}}>
      <div style={{background:C.white,borderRadius:16,boxShadow:"0 4px 24px rgba(99,102,241,0.1)",border:"1px solid "+C.border,width:"min(420px,100%)",padding:"clamp(24px,5vw,44px)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Logo size={40}/>
          <h2 style={{fontSize:22,fontWeight:800,color:C.text,margin:"18px 0 4px"}}>Admin Portal</h2>
          <div style={{background:C.indigoLight,border:"1px solid "+C.borderMid,borderRadius:8,padding:"8px 14px",display:"inline-block",marginTop:10,fontSize:12,color:C.indigo,fontWeight:600}}>Demo: admin123</div>
        </div>
        {passErr&&<div style={{background:C.redLight,border:"1px solid "+C.red,borderRadius:8,padding:"8px 12px",color:C.red,fontSize:13,marginBottom:12}}>{passErr}</div>}
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password"
          onKeyDown={e=>e.key==="Enter"&&(pass===DEMO_PASS?setAuthed(true):setPassErr("Incorrect."))}
          style={{...iStyle,padding:"12px 14px",fontSize:14,marginBottom:12}} onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
        <button onClick={()=>pass===DEMO_PASS?setAuthed(true):setPassErr("Incorrect password.")}
          style={{width:"100%",background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Sign In</button>
      </div>
    </div>
  );

  const confirmed=guests,checkedIn=guests.filter(g=>g.attended);
  const filtered=confirmed.filter(g=>!search||g.name.toLowerCase().includes(search.toLowerCase())||g.email.toLowerCase().includes(search.toLowerCase())||(g.regNo||"").includes(search.toUpperCase()));
  const dietaryCounts=["No Preference","Non-Veg","Vegetarian","Vegan"].map(d=>({label:d,count:confirmed.filter(g=>g.dietary===d).length,pax:confirmed.filter(g=>g.dietary===d).reduce((a,g)=>a+g.pax,0)}));
  const tabs=[{id:"event",label:"Event Info"},{id:"people",label:"People"},{id:"rsvp",label:"RSVP Status"},{id:"dietary",label:"Dietary"},{id:"downloads",label:"Downloads"}];
  const addPerson=()=>{if(!newP.name.trim())return;const regNo="K"+String(guests.length+1).padStart(3,"0");const g={id:uid(),name:newP.name.trim(),email:newP.email.trim(),pax:parseInt(newP.pax)||1,dietary:newP.dietary,regNo,attended:false,rsvpStatus:"confirmed",createdAt:new Date().toISOString()};setGuests(prev=>[...prev,g]);setNewP({name:"",email:"",pax:1,dietary:"No Preference"});setShowAdd(false);};

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{paddingTop:58}}>
        <div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"16px clamp(12px,3vw,32px)"}}>
          <div style={{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div><h2 style={{fontSize:"clamp(18px,3vw,22px)",fontWeight:800,color:C.text,margin:"0 0 2px"}}>Admin Dashboard</h2><p style={{fontSize:13,color:C.textMid,margin:0}}>{event.title}</p></div>
            <button onClick={()=>setAuthed(false)} style={{background:"transparent",color:C.textMid,border:"1px solid "+C.border,borderRadius:6,padding:"6px 14px",fontSize:12,cursor:"pointer"}}>Sign Out</button>
          </div>
        </div>
        <div style={{background:C.white,borderBottom:"1px solid "+C.border}}>
          <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))"}}>
            {[[confirmed.length,"Registered",C.indigo],[checkedIn.length,"Checked In",C.green],[confirmed.length-checkedIn.length,"Pending",C.yellow],[confirmed.reduce((a,g)=>a+g.pax,0),"Total Pax",C.pink]].map(([n,l,col])=>(
              <div key={l} style={{padding:"16px clamp(10px,2vw,20px)",textAlign:"center",borderRight:"1px solid "+C.border}}>
                <div style={{fontSize:"clamp(22px,3vw,28px)",fontWeight:800,color:col}}>{n}</div>
                <div style={{fontSize:10,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:C.white,borderBottom:"1px solid "+C.border,overflowX:"auto"}}>
          <div style={{maxWidth:1000,margin:"0 auto",display:"flex",padding:"0 clamp(12px,3vw,24px)"}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{border:"none",background:"transparent",color:tab===t.id?C.indigo:C.textLight,padding:"13px 16px",fontSize:13,fontWeight:tab===t.id?700:500,borderBottom:tab===t.id?"2px solid "+C.indigo:"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap"}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"24px clamp(12px,3vw,32px)"}}>

          {tab==="event"&&(
            <div>
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>Event Details</h3>
              <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,padding:24}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(220px,100%),1fr))",gap:16}}>
                  {[["Title","title"],["Year","year"],["Date","date"],["Time","time"],["Venue","venue"],["Dress Code","dresscode"]].map(([lbl,key])=>(
                    <div key={key}>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{lbl}</label>
                      <input style={iStyle} value={event[key]||""} onChange={e=>setEvent(p=>({...p,[key]:e.target.value}))} onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:16}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>Email Body</label>
                  <textarea style={{...iStyle,resize:"vertical"}} rows={5} value={event.emailBody||""} onChange={e=>setEvent(p=>({...p,emailBody:e.target.value}))} onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                </div>
              </div>
            </div>
          )}

          {tab==="people"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <h3 style={{fontSize:18,fontWeight:700,color:C.text}}>People ({confirmed.length})</h3>
                <div style={{display:"flex",gap:8}}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...iStyle,width:"clamp(140px,25vw,240px)"}} onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                  <button onClick={()=>setShowAdd(v=>!v)} style={{background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add</button>
                </div>
              </div>
              {showAdd&&(
                <div style={{background:C.white,borderRadius:12,border:"1.5px solid "+C.indigo,padding:20,marginBottom:16}}>
                  <h4 style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>Add New Person</h4>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(180px,100%),1fr))",gap:12,marginBottom:12}}>
                    {[["Name","name","text"],["Email","email","email"],["Pax","pax","number"]].map(([lbl,key,type])=>(
                      <div key={key}>
                        <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{lbl}</label>
                        <input type={type} style={iStyle} value={newP[key]} onChange={e=>setNewP(p=>({...p,[key]:e.target.value}))} onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:14}}>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Dietary</label>
                    <select style={iStyle} value={newP.dietary} onChange={e=>setNewP(p=>({...p,dietary:e.target.value}))} onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}>
                      {["No Preference","Non-Veg","Vegetarian","Vegan"].map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={addPerson} style={{background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Add</button>
                    <button onClick={()=>setShowAdd(false)} style={{background:"transparent",color:C.indigo,border:"1.5px solid "+C.indigo,borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                  </div>
                </div>
              )}
              <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,overflow:"hidden"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead><tr style={{background:C.bg}}>{["Name","Email","Pax","Dietary","Reg#","Status",""].map(h=><th key={h} style={{padding:"10px 14px",color:C.textMid,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {filtered.map(g=>(
                        <tr key={g.id} style={{borderTop:"1px solid "+C.border}}>
                          <td style={{padding:"10px 14px",fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{g.name}</td>
                          <td style={{padding:"10px 14px",color:C.textMid,fontSize:12}}>{g.email}</td>
                          <td style={{padding:"10px 14px",color:C.textMid}}>{g.pax}</td>
                          <td style={{padding:"10px 14px",color:C.textMid,whiteSpace:"nowrap"}}>{g.dietary}</td>
                          <td style={{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:C.indigo}}>{g.regNo}</td>
                          <td style={{padding:"10px 14px"}}><span style={{background:g.attended?C.greenLight:C.indigoLight,color:g.attended?C.green:C.indigo,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{g.attended?"In":"Pending"}</span></td>
                          <td style={{padding:"10px 14px"}}><button onClick={()=>{if(window.confirm("Remove "+g.name+"?"))setGuests(prev=>prev.filter(x=>x.id!==g.id));}} style={{background:C.redLight,color:C.red,border:"none",borderRadius:4,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>Remove</button></td>
                        </tr>
                      ))}
                      {filtered.length===0&&<tr><td colSpan={7} style={{padding:"32px 14px",textAlign:"center",color:C.textLight,fontSize:13}}>No results</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab==="rsvp"&&(
            <div>
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>RSVP Status</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))",gap:14,marginBottom:20}}>
                {[[confirmed.length,"Confirmed","#DCFCE7",C.green],[checkedIn.length,"Checked In",C.greenLight,C.green],[confirmed.length-checkedIn.length,"Not Yet In",C.yellowLight,C.yellow],[confirmed.reduce((a,g)=>a+g.pax,0),"Total Pax",C.indigoLight,C.indigo]].map(([n,l,bg,col])=>(
                  <div key={l} style={{background:bg,borderRadius:12,padding:"18px 20px"}}><div style={{fontSize:11,color:col,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{l}</div><div style={{fontSize:32,fontWeight:800,color:col}}>{n}</div></div>
                ))}
              </div>
              <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,padding:20,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>Check-In Progress</span>
                  <span style={{fontSize:13,color:C.textMid}}>{confirmed.length>0?Math.round(checkedIn.length/confirmed.length*100):0}%</span>
                </div>
                <div style={{background:C.border,borderRadius:99,height:12,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:99,background:C.grad,width:(confirmed.length>0?checkedIn.length/confirmed.length*100:0)+"%",transition:"width 0.5s"}}/>
                </div>
              </div>
              <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,overflow:"hidden"}}>
                {confirmed.map(g=>(
                  <div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderBottom:"1px solid "+C.border}}>
                    <div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{g.name}</div><div style={{fontSize:11,color:C.textMid}}>Pax {g.pax} - {g.dietary}</div></div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:C.indigo}}>{g.regNo}</span>
                      <span style={{background:g.attended?C.greenLight:C.indigoLight,color:g.attended?C.green:C.indigo,borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700}}>{g.attended?"In":"Pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="dietary"&&(
            <div>
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>Dietary Summary</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(180px,100%),1fr))",gap:14,marginBottom:20}}>
                {dietaryCounts.map(({label,count,pax})=>(
                  <div key={label} style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,padding:"18px 20px",textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:800,color:C.indigo}}>{count}</div>
                    <div style={{fontSize:13,color:C.textMid,fontWeight:600,marginTop:2}}>{label}</div>
                    <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{pax} pax</div>
                  </div>
                ))}
              </div>
              <div style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,overflow:"hidden"}}>
                {confirmed.map(g=>(
                  <div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderBottom:"1px solid "+C.border}}>
                    <div style={{fontWeight:600,fontSize:13,color:C.text}}>{g.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:12,color:C.textMid}}>Pax {g.pax}</span>
                      <span style={{background:C.indigoLight,color:C.indigo,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>{g.dietary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="downloads"&&(
            <div>
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>Downloads</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:14}}>
                {[
                  ["Guest List CSV","All registrations as spreadsheet",()=>{const rows=[["Reg#","Name","Email","Pax","Dietary","Status","Check-In Time"],...confirmed.map(g=>[g.regNo,g.name,g.email,g.pax,g.dietary,g.attended?"Checked In":"Pending",g.attendedAt||""])];const csv=rows.map(r=>r.map(v=>'"'+v+'"').join(",")).join("\n");const a=document.createElement("a");a.href="data:text/csv,"+encodeURIComponent(csv);a.download="koerber_guests.csv";a.click();}],
                  ["Check-In Report","Attendance summary",()=>{const rows=[["Reg#","Name","Status","Time"],...confirmed.map(g=>[g.regNo,g.name,g.attended?"IN":"PENDING",g.attendedAt||""])];const csv=rows.map(r=>r.map(v=>'"'+v+'"').join(",")).join("\n");const a=document.createElement("a");a.href="data:text/csv,"+encodeURIComponent(csv);a.download="koerber_checkin.csv";a.click();}],
                  ["Dietary Report","Dietary requirements",()=>{const rows=[["Dietary","Count","Pax"],...dietaryCounts.map(d=>[d.label,d.count,d.pax])];const csv=rows.map(r=>r.map(v=>'"'+v+'"').join(",")).join("\n");const a=document.createElement("a");a.href="data:text/csv,"+encodeURIComponent(csv);a.download="koerber_dietary.csv";a.click();}],
                  ["Print Guest List","Print formatted list",()=>window.print()],
                ].map(([title,desc,fn])=>(
                  <div key={title} style={{background:C.white,borderRadius:12,border:"1px solid "+C.border,padding:20}}>
                    <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:6}}>{title}</div>
                    <div style={{fontSize:12,color:C.textMid,marginBottom:16}}>{desc}</div>
                    <button onClick={fn} style={{width:"100%",background:C.grad,color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Export</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page,setPage]=useState("home");
  const [guests,setGuests]=useState(INIT_GUESTS);
  const [event,setEvent]=useState(INIT_EVENT);
  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <Nav page={page} setPage={setPage}/>
      {page==="home"    && <Home    setPage={setPage} event={event} guests={guests}/>}
      {page==="rsvp"    && <RSVP    guests={guests} setGuests={setGuests} event={event}/>}
      {page==="checkin" && <CheckIn guests={guests} setGuests={setGuests}/>}
      {page==="admin"   && <Admin   guests={guests} setGuests={setGuests} event={event} setEvent={setEvent}/>}
    </div>
  );
}
