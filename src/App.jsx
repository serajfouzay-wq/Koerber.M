import React, { useState, useEffect, useRef } from "react";

// ─── SUPABASE (plug in later) ─────────────────────────────────────────────────
// To connect: replace the two placeholder strings below with your project URL and anon key
const SUPABASE_URL = "https://kolrfarsxnesdliazhnf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbHJmYXJzeG5lc2RsaWF6aG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjUwNDQsImV4cCI6MjA5NjIwMTA0NH0.JqwmhJRFMCRIeYCcOynCgBAQm0aTHovU047vpH2d-T0";
const WEB3FORMS_KEY = "62c6645f-14fc-4fe1-987e-3eac989b0526";

// Supabase — loaded via CDN script tag injected below
let supa = null;
const initSupa = () => {
  if (supa) return;
  if (window.supabase) {
    supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
};
const dbUpsert = async (table, row) => { initSupa(); try { if(supa) await supa.from(table).upsert(row,{onConflict:"id"}); } catch(e){console.warn("dbUpsert",e);} };
const dbDelete = async (table, id)  => { initSupa(); try { if(supa) await supa.from(table).delete().eq("id",id); } catch(e){console.warn("dbDelete",e);} };
const dbAll    = async (table)      => { initSupa(); try { if(supa){ const{data}=await supa.from(table).select("*"); return data||[]; } } catch(e){} return []; };

// ─── KÖRBER LOGO (real logo, transparent background) ─────────────────────────
const KOERBER_LOGO = "data:image/png;base64,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";

// ─── COLOURS ─────────────────────────────────────────────────────────────────
const C = {
  indigo:"#6366F1", indigoDark:"#4F46E5", indigoLight:"#EEF2FF",
  pink:"#EC4899",   pinkLight:"#FDF2F8",
  grad:"linear-gradient(135deg,#6366F1 0%,#EC4899 100%)",
  gradHover:"linear-gradient(135deg,#4F46E5 0%,#DB2777 100%)",
  bg:"#F0F4FF",     white:"#FFFFFF",
  text:"#1E1B4B",   textMid:"#64748B",  textLight:"#94A3B8",
  border:"#E0E7FF", borderMid:"#C7D2FE",
  green:"#10B981",  greenLight:"#D1FAE5",
  red:"#EF4444",    redLight:"#FEE2E2",
  yellow:"#F59E0B", yellowLight:"#FEF3C7",
};

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const INIT_GUESTS = [
  {id:"s1",name:"Ahmad Al-Rashid",  email:"ahmad@koerber.com",  pax:2,dietary:"Non-Veg",    regNo:"K001",attended:false,rsvpStatus:"confirmed"},
  {id:"s2",name:"Sarah Chen",       email:"sarah@koerber.com",  pax:1,dietary:"Vegetarian", regNo:"K002",attended:true, rsvpStatus:"confirmed",attendedAt:"09:12 AM"},
  {id:"s3",name:"James O Brien",    email:"james@koerber.com",  pax:2,dietary:"No Preference",regNo:"K003",attended:false,rsvpStatus:"confirmed"},
  {id:"s4",name:"Priya Nair",       email:"priya@koerber.com",  pax:1,dietary:"Vegan",      regNo:"K004",attended:true, rsvpStatus:"confirmed",attendedAt:"09:31 AM"},
  {id:"s5",name:"Michael Hoffmann", email:"michael@koerber.com",pax:3,dietary:"Non-Veg",    regNo:"K005",attended:false,rsvpStatus:"confirmed"},
];
const INIT_EVENT = {
  title:"Körber Innovation Summit",year:"2025",
  date:"Friday, 18 July 2025",time:"6:30 PM - 10:00 PM",
  venue:"Marina Bay Sands, Singapore",dresscode:"Business Casual",
  emailSubject:"Registration Confirmed — Körber Innovation Summit",
  emailBody:"Dear {{name}},\n\nYour registration for the {{title}} has been confirmed.\n\nDate: {{date}}\nTime: {{time}}\nVenue: {{venue}}\nDress Code: {{dresscode}}\nPax: {{pax}}\nDietary: {{dietary}}\n\nPlease present your QR code at the entrance.\n\nBest regards,\nKoerber Team",
};
const uid = () => "u" + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
const fillTemplate = (t, v) => t.replace(/\{\{(\w+)\}\}/g, (_,k) => v[k]||"");

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GS = `
  @keyframes fadeUp   {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
  @keyframes slideIn  {from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes popIn    {from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
  @keyframes pulse    {0%,100%{opacity:1}50%{opacity:0.5}}
  @keyframes spin     {to{transform:rotate(360deg)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes glow     {0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)}50%{box-shadow:0 0 40px rgba(236,72,153,0.4)}}
  .fade-up  {animation:fadeUp  0.45s ease both}
  .fade-in  {animation:fadeIn  0.35s ease both}
  .pop-in   {animation:popIn   0.4s  cubic-bezier(0.34,1.56,0.64,1) both}
  .slide-in {animation:slideIn 0.4s  ease both}
  .delay-1  {animation-delay:0.08s}
  .delay-2  {animation-delay:0.16s}
  .delay-3  {animation-delay:0.24s}
  .delay-4  {animation-delay:0.32s}
  .btn-grad {background:linear-gradient(135deg,#6366F1,#EC4899);background-size:200% 200%;animation:gradShift 5s ease infinite;}
  .btn-grad:hover{opacity:0.88;transform:translateY(-1px);transition:all 0.2s}
  .card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(99,102,241,0.15)!important;transition:all 0.25s}
  .input-field{width:100%;border:1.5px solid #C7D2FE;border-radius:8px;padding:11px 14px;font-size:14px;color:#1E1B4B;background:#FAFBFF;outline:none;transition:border 0.15s,box-shadow 0.15s;font-family:inherit;}
  .input-field:focus{border-color:#6366F1;box-shadow:0 0 0 3px rgba(99,102,241,0.1);}
  @media(max-width:600px){.nav-desktop{display:none!important}.nav-burger{display:block!important}}
  @media(min-width:601px){.nav-burger{display:none!important}}
`;

// ─── PARTICLES ────────────────────────────────────────────────────────────────
function Particles({ count=55, color="#6366F1" }) {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const hex=color.replace("#","");
    const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
    const particles = Array.from({length:count},()=>({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      radius:Math.random()*2.2+0.4, dx:(Math.random()-0.5)*0.35,
      dy:-Math.random()*0.45-0.15,  alpha:Math.random()*0.45+0.1,
      pink:Math.random()>0.55,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle = p.pink?`rgba(236,72,153,${p.alpha})`:`rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
        p.x+=p.dx; p.y+=p.dy;
        if(p.y<-5){p.y=canvas.height+5;p.x=Math.random()*canvas.width;}
        if(p.x<0||p.x>canvas.width)p.dx*=-1;
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[count,color]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

// ─── CONFETTI (for successful registration) ───────────────────────────────────
function Confetti({ active }) {
  const ref = useRef();
  useEffect(() => {
    if(!active||!ref.current) return;
    const canvas=ref.current;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight;
    const colors=["#6366F1","#EC4899","#10B981","#F59E0B","#A5B4FC","#F9A8D4"];
    const pieces=Array.from({length:80},()=>({
      x:Math.random()*canvas.width, y:-10,
      r:Math.random()*6+3, dx:(Math.random()-0.5)*3,
      dy:Math.random()*4+2, rot:Math.random()*360,
      drot:(Math.random()-0.5)*8, color:colors[Math.floor(Math.random()*colors.length)],
      alpha:1,
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      let alive=false;
      pieces.forEach(p=>{
        p.x+=p.dx; p.y+=p.dy; p.rot+=p.drot; p.alpha-=0.008;
        if(p.alpha>0){
          alive=true;
          ctx.save(); ctx.globalAlpha=p.alpha; ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
          ctx.fillStyle=p.color; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6); ctx.restore();
        }
      });
      if(alive) raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf);
  },[active]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:999}}/>;
}

// ─── QR CODE ─────────────────────────────────────────────────────────────────
function QRBox({ value, size=160 }) {
  const ref=useRef();
  useEffect(()=>{
    if(!ref.current||!value)return;
    ref.current.innerHTML="";
    const load=()=>new Promise((ok,no)=>{
      if(window.QRCode){ok();return;}
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      s.onload=ok; s.onerror=no; document.head.appendChild(s);
    });
    load().then(()=>{
      if(!ref.current)return;
      ref.current.innerHTML="";
      new window.QRCode(ref.current,{text:value,width:size,height:size,colorDark:"#1E1B4B",colorLight:"#ffffff",correctLevel:window.QRCode.CorrectLevel.M});
    }).catch(()=>{});
  },[value,size]);
  return <div ref={ref} style={{display:"inline-block"}}/>;
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo({ size=36, dark=false }) {
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:size*0.25}}>
      <img src={KOERBER_LOGO} alt="Körber"
        style={{height:size,width:"auto",objectFit:"contain",display:"block"}}/>
      {size>=28 && (
        <div style={{fontFamily:"'Helvetica Neue','Arial',sans-serif",fontWeight:700,fontSize:size*0.38,color:dark?"rgba(255,255,255,0.55)":C.textLight,letterSpacing:size*0.04,textTransform:"uppercase",lineHeight:1}}>
          Technology Group
        </div>
      )}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>10);
    window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h);
  },[]);
  const go=p=>{setPage(p);setOpen(false);window.scrollTo(0,0);};
  const links=[["home","Home"],["rsvp","RSVP"],["checkin","Check-In"],["admin","Admin"]];
  return(
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.92)",backdropFilter:"blur(16px)",borderBottom:"1px solid "+(scrolled?C.border:"transparent"),height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",transition:"all 0.3s"}}>
        <div onClick={()=>go("home")} style={{cursor:"pointer"}}><Logo size={28}/></div>
        <div className="nav-desktop" style={{display:"flex",gap:4}}>
          {links.map(([id,lbl])=>(
            <button key={id} onClick={()=>go(id)}
              style={{background:page===id?C.grad:"transparent",color:page===id?"#fff":C.textMid,border:"1px solid "+(page===id?"transparent":C.border),borderRadius:7,padding:"6px 14px",fontSize:13,fontWeight:page===id?700:500,cursor:"pointer",transition:"all 0.18s",fontFamily:"inherit"}}>
              {lbl}
            </button>
          ))}
        </div>
        <button className="nav-burger" onClick={()=>setOpen(v=>!v)}
          style={{display:"none",background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.text,fontFamily:"inherit"}}>
          {open?"✕":"☰"}
        </button>
      </nav>
      {open&&(
        <div style={{position:"fixed",top:58,left:0,right:0,zIndex:99,background:C.white,borderBottom:"1px solid "+C.border,boxShadow:"0 8px 32px rgba(99,102,241,0.1)"}}>
          {links.map(([id,lbl],i)=>(
            <button key={id} onClick={()=>go(id)}
              style={{display:"block",width:"100%",background:"none",border:"none",borderBottom:"1px solid "+C.border,color:page===id?C.indigo:C.text,padding:"14px 20px",fontSize:15,fontWeight:page===id?700:400,textAlign:"left",cursor:"pointer",fontFamily:"inherit",animation:`slideIn 0.25s ease ${i*0.05}s both`}}>
              {lbl}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ setPage, event, guests }) {
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px 40px",position:"relative",overflow:"hidden"}}>
      <Particles count={65} color={C.indigo}/>
      {/* Gradient blobs */}
      <div style={{position:"absolute",top:"8%",right:"-10%",width:"clamp(280px,45vw,500px)",height:"clamp(280px,45vw,500px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%)",pointerEvents:"none",animation:"pulse 6s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"5%",left:"-8%",width:"clamp(220px,38vw,420px)",height:"clamp(220px,38vw,420px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(236,72,153,0.08),transparent 70%)",pointerEvents:"none",animation:"pulse 8s ease-in-out infinite 1s"}}/>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"clamp(300px,50vw,600px)",height:"clamp(300px,50vw,600px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.04),transparent 70%)",pointerEvents:"none"}}/>

      <div style={{position:"relative",textAlign:"center",maxWidth:660}}>
        <div className="fade-up" style={{display:"flex",justifyContent:"center",marginBottom:28}}><Logo size={58}/></div>

        <div className="fade-up delay-1" style={{display:"inline-flex",alignItems:"center",gap:7,background:C.indigoLight,border:"1px solid "+C.borderMid,borderRadius:20,padding:"5px 16px",marginBottom:20}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 2s ease-in-out infinite"}}/>
          <span style={{fontSize:12,color:C.indigo,fontWeight:600,letterSpacing:0.5}}>Registration Now Open</span>
        </div>

        <h1 className="fade-up delay-2" style={{fontSize:"clamp(30px,7vw,58px)",fontWeight:900,color:C.text,lineHeight:1.05,margin:"0 0 14px",letterSpacing:-1}}>
          {event.title}
        </h1>
        <p className="fade-up delay-2" style={{fontSize:"clamp(14px,2.5vw,17px)",color:C.textMid,margin:"0 0 6px"}}>📅 {event.date}</p>
        <p className="fade-up delay-2" style={{fontSize:"clamp(13px,2vw,15px)",color:C.textMid,margin:"0 0 34px"}}>🕕 {event.time} &nbsp;·&nbsp; 📍 {event.venue}</p>

        <div className="fade-up delay-3" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
          <button onClick={()=>setPage("rsvp")} className="btn-grad"
            style={{color:"#fff",border:"none",borderRadius:9,padding:"14px clamp(22px,4vw,36px)",fontSize:"clamp(13px,2.5vw,15px)",fontWeight:800,cursor:"pointer",letterSpacing:0.3,boxShadow:"0 4px 20px rgba(99,102,241,0.4)"}}>
            Register Now →
          </button>
          <button onClick={()=>setPage("checkin")}
            style={{background:"transparent",color:C.indigo,border:"1.5px solid "+C.indigo,borderRadius:9,padding:"13px 24px",fontSize:"clamp(12px,2vw,14px)",fontWeight:700,cursor:"pointer",transition:"all 0.18s",fontFamily:"inherit"}}
            onMouseOver={e=>{e.currentTarget.style.background=C.indigoLight;}}
            onMouseOut={e=>{e.currentTarget.style.background="transparent";}}>
            📷 Staff Check-In
          </button>
        </div>

        {/* Stats card */}
        <div className="fade-up delay-4" style={{display:"flex",background:C.white,borderRadius:16,border:"1px solid "+C.border,overflow:"hidden",boxShadow:"0 4px 24px rgba(99,102,241,0.08)"}}>
          {[[guests.length,"Registered"],[guests.filter(g=>g.attended).length,"Checked In"],["200","Capacity"],["Free","Entry"]].map(([n,l],i)=>(
            <div key={l} style={{flex:1,padding:"clamp(12px,2vw,18px) 6px",textAlign:"center",borderRight:i<3?"1px solid "+C.border:"none"}}>
              <div style={{fontWeight:800,fontSize:"clamp(18px,3vw,24px)",background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
              <div style={{fontSize:"clamp(9px,1.5vw,10px)",color:C.textLight,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{position:"absolute",bottom:20,fontSize:11,color:C.textLight}}>
        <a href="https://www.koerber.com/en" target="_blank" rel="noreferrer" style={{color:C.textLight,textDecoration:"none",textTransform:"uppercase",letterSpacing:1}}>koerber.com</a>
      </div>
    </div>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
function RSVP({ guests, setGuests, event }) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pax,setPax]=useState(1);
  const [dietary,setDietary]=useState("No Preference");
  const [err,setErr]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [done,setDone]=useState(null);
  const [confetti,setConfetti]=useState(false);
  const [emailStatus,setEmailStatus]=useState(null);

  const sendEmail = async (guest) => {
    try {
      const vars = {name:guest.name,pax:String(guest.pax),dietary:guest.dietary,regNo:guest.regNo,date:event.date,time:event.time,venue:event.venue,dresscode:event.dresscode,title:event.title,year:event.year||""};
      const bodyText = fillTemplate(event.emailBody||"Dear {{name}},\n\nYour registration for {{title}} is confirmed.\n\nDate: {{date}}\nTime: {{time}}\nVenue: {{venue}}\nDress Code: {{dresscode}}\nPax: {{pax}}\nDietary: {{dietary}}\nReg No: {{regNo}}\n\nPlease show your QR code at the entrance.\n\nBest regards,\nKörber Team", vars);
      const subjectText = fillTemplate(event.emailSubject||"Registration Confirmed — {{title}}", vars);

      const r = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: guest.email,
          name: guest.name,
          subject: subjectText,
          text: bodyText,
          qrDataUrl: guest.qrDataUrl || "",
          regNo: guest.regNo,
          pax: guest.pax,
          dietary: guest.dietary,
          date: event.date,
          time: event.time,
          venue: event.venue,
          dresscode: event.dresscode,
          title: event.title,
        })
      });
      const text = await r.text();
      let d = {};
      try { d = JSON.parse(text); } catch(e) {}
      if (d.ok) return { ok: true };
      return { ok: false, error: d.error || "Email failed" };
    } catch(e) {
      return { ok: false, error: String(e) };
    }
  };

  const submit = async () => {
    setErr("");
    if(!name.trim()){setErr("Please enter your full name.");return;}
    if(!email.includes("@")){setErr("Please enter a valid email address.");return;}
    setSubmitting(true);
    await new Promise(r=>setTimeout(r,700));
    const regNo="K"+String(guests.length+1).padStart(3,"0");
    const guest={id:uid(),name:name.trim(),email:email.trim().toLowerCase(),pax,dietary,regNo,attended:false,rsvpStatus:"confirmed",createdAt:new Date().toISOString()};
    await dbUpsert("guests",guest);
    setGuests(prev=>[...prev,guest]);
    setConfetti(true);
    setTimeout(()=>setConfetti(false),3000);
    // Send email
    setDone(guest);
    setSubmitting(false);
    // Email sent via useEffect after QR renders
  };

  if(done){
    const qrVal="KOERBER|"+done.regNo+"|"+done.name+"|"+done.id;
    return(
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 20px 40px",position:"relative"}}>
        <Confetti active={confetti}/>
        <div className="pop-in" id="rsvp-card" style={{background:C.white,borderRadius:20,boxShadow:"0 8px 40px rgba(99,102,241,0.15)",border:"1px solid "+C.border,maxWidth:500,width:"100%",padding:"clamp(24px,5vw,44px)",textAlign:"center"}}>
          {/* Success badge */}
          <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,"+C.greenLight+",#A7F3D0)",border:"3px solid "+C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:28,animation:"glow 2s ease-in-out infinite"}}><span style={{fontSize:28}}>✅</span></div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2.5,color:C.indigo,textTransform:"uppercase",marginBottom:6}}>Registration Confirmed</div>
          <h2 style={{fontSize:"clamp(20px,4vw,26px)",fontWeight:800,color:C.text,margin:"0 0 4px"}}>{done.name}</h2>
          <p style={{fontSize:13,color:C.textMid,margin:"0 0 22px"}}>{event.title} &nbsp;·&nbsp; {event.date}</p>

          {/* QR Card */}
          <div style={{background:"linear-gradient(135deg,#1E1B4B 0%,#312E81 50%,#4C1D95 100%)",borderRadius:18,padding:"clamp(20px,4vw,32px)",marginBottom:20,position:"relative",overflow:"hidden"}}>
            {/* Decorative ring */}
            <div style={{position:"absolute",top:-40,right:-40,width:150,height:150,borderRadius:"50%",border:"1px solid rgba(165,180,252,0.2)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",bottom:-30,left:-30,width:100,height:100,borderRadius:"50%",border:"1px solid rgba(249,168,212,0.2)",pointerEvents:"none"}}/>
            <div style={{background:"#fff",borderRadius:14,padding:14,display:"inline-block",boxShadow:"0 0 0 5px rgba(236,72,153,0.35)",marginBottom:16,position:"relative"}}>
              <QRBox value={qrVal} size={164}/>
            </div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:9,letterSpacing:2.5,textTransform:"uppercase",marginBottom:4}}>Registration Number</div>
            <div style={{background:"linear-gradient(135deg,#A5B4FC,#F9A8D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Courier New',monospace",fontSize:30,fontWeight:900,letterSpacing:7,marginBottom:14}}>{done.regNo}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,textAlign:"left"}}>
              {[["Name",done.name],["Email",done.email],["Pax",done.pax],["Dietary",done.dietary]].map(([k,v])=>(
                <div key={k} style={{background:"rgba(255,255,255,0.07)",borderRadius:8,padding:"8px 10px"}}>
                  <div style={{color:"rgba(255,255,255,0.3)",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>{k}</div>
                  <div style={{color:"#E0E7FF",fontSize:12,fontWeight:600,wordBreak:"break-all"}}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Event details */}
          <div style={{background:C.indigoLight,borderRadius:12,padding:"14px 16px",marginBottom:14,textAlign:"left"}}>
            {[["📅",event.date],["🕕",event.time],["📍",event.venue],["👔",event.dresscode]].map(([i,v])=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:5,fontSize:13,alignItems:"flex-start"}}><span>{i}</span><span style={{color:C.text,fontWeight:500,lineHeight:1.4}}>{v}</span></div>
            ))}
          </div>

          {/* Email status */}
          {emailStatus&&(
            <div style={{background:emailStatus.ok?C.greenLight:C.yellowLight,border:"1px solid "+(emailStatus.ok?C.green:C.yellow),borderRadius:8,padding:"8px 14px",marginBottom:14,fontSize:12,color:emailStatus.ok?"#065F46":"#92400E"}}>
              {emailStatus.ok?"✅ Confirmation email sent to "+done.email:"📧 Email not configured yet — show this QR code at check-in"}
            </div>
          )}

          <p style={{fontSize:12,color:C.textLight,marginBottom:18}}>Screenshot or print this card and present it at the entrance.</p>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button className="btn-grad" style={{width:"100%",color:"#fff",border:"none",borderRadius:8,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer"}}
              onClick={async (e)=>{
                const btn=e.currentTarget;
                const origText=btn.textContent;
                btn.textContent="⏳ Generating PDF…"; btn.disabled=true;
                const card=document.getElementById("rsvp-card");
                if(!card){btn.textContent=origText;btn.disabled=false;return;}
                const loadScript=src=>new Promise((ok,no)=>{
                  if(document.querySelector('script[src="'+src+'"]')){ok();return;}
                  const s=document.createElement("script");s.src=src;
                  s.onload=ok;s.onerror=no;document.head.appendChild(s);
                });
                try{
                  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
                  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
                  const canvas=await window.html2canvas(card,{scale:2.5,useCORS:true,backgroundColor:"#F0F4FF",logging:false});
                  const {jsPDF}=window.jspdf;
                  const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a5"});
                  const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight(),m=8;
                  const ratio=Math.min((pw-m*2)/canvas.width,(ph-m*2)/canvas.height);
                  const dw=canvas.width*ratio,dh=canvas.height*ratio;
                  pdf.addImage(canvas.toDataURL("image/png"),"PNG",(pw-dw)/2,(ph-dh)/2,dw,dh);
                  pdf.save("Koerber_"+done.regNo+".pdf");
                }catch(err){alert("Could not generate PDF. Please screenshot the QR card.");}
                btn.textContent=origText;btn.disabled=false;
              }}>
              ⬇ Download QR Card (PDF)
            </button>
            <button onClick={()=>{setDone(null);setName("");setEmail("");setPax(1);setDietary("No Preference");setEmailStatus(null);}}
              style={{width:"100%",background:"transparent",color:C.indigo,border:"1.5px solid "+C.indigo,borderRadius:8,padding:"12px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 20px 40px"}}>
      <div style={{maxWidth:500,width:"100%"}}>
        <div className="fade-up" style={{textAlign:"center",marginBottom:28}}>
          <Logo size={42}/>
          <h2 style={{fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:C.text,margin:"18px 0 4px"}}>Event Registration</h2>
          <p style={{color:C.textMid,fontSize:13}}>{event.title} &nbsp;·&nbsp; {event.date}</p>
        </div>

        <div className="fade-up delay-1" style={{background:C.white,borderRadius:18,boxShadow:"0 4px 28px rgba(99,102,241,0.1)",border:"1px solid "+C.border,padding:"clamp(20px,5vw,36px)"}}>
          {err&&<div className="slide-in" style={{background:C.redLight,border:"1px solid "+C.red,borderRadius:8,padding:"10px 14px",marginBottom:14,color:C.red,fontSize:13}}>⚠️ {err}</div>}

          {[["Full Name",name,setName,"text","Your full name"],["Email Address",email,setEmail,"email","your@email.com"]].map(([lbl,val,set,type,ph],idx)=>(
            <div key={lbl} className={"slide-in delay-"+(idx+1)} style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{lbl}</label>
              <input className="input-field" type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph}/>
            </div>
          ))}

          {/* Pax */}
          <div className="slide-in delay-2" style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>Number of Guests</label>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setPax(Math.max(1,pax-1))} style={{width:42,height:42,borderRadius:9,border:"1.5px solid "+C.borderMid,background:C.white,color:C.indigo,fontSize:22,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",transition:"all 0.15s"}}
                onMouseOver={e=>e.currentTarget.style.background=C.indigoLight} onMouseOut={e=>e.currentTarget.style.background=C.white}>−</button>
              <div style={{flex:1,textAlign:"center",background:C.indigoLight,border:"1.5px solid "+C.borderMid,borderRadius:9,padding:"10px",fontWeight:800,fontSize:20,color:C.indigo}}>{pax}</div>
              <button onClick={()=>setPax(Math.min(10,pax+1))} style={{width:42,height:42,borderRadius:9,border:"1.5px solid "+C.borderMid,background:C.white,color:C.indigo,fontSize:22,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",transition:"all 0.15s"}}
                onMouseOver={e=>e.currentTarget.style.background=C.indigoLight} onMouseOut={e=>e.currentTarget.style.background=C.white}>+</button>
            </div>
          </div>

          {/* Dietary */}
          <div className="slide-in delay-3" style={{marginBottom:26}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>Dietary Preference</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8}}>
              {[["🍽","No Preference"],["🍖","Non-Veg"],["🥗","Vegetarian"],["🌱","Vegan"]].map(([icon,val])=>(
                <button key={val} onClick={()=>setDietary(val)}
                  style={{background:dietary===val?"linear-gradient(135deg,"+C.indigoLight+","+C.pinkLight+")":C.white,color:dietary===val?C.indigo:C.textMid,border:"1.5px solid "+(dietary===val?C.indigo:C.border),borderRadius:11,padding:"10px 6px",fontSize:11,fontWeight:600,textAlign:"center",cursor:"pointer",transition:"all 0.17s",fontFamily:"inherit",boxShadow:dietary===val?"0 2px 10px rgba(99,102,241,0.15)":"none"}}>
                  <div style={{fontSize:19,marginBottom:3}}>{icon}</div>{val}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-grad slide-in delay-4" onClick={submitting?undefined:submit} disabled={submitting}
            style={{width:"100%",color:"#fff",border:"none",borderRadius:9,padding:"14px",fontSize:15,fontWeight:800,cursor:submitting?"not-allowed":"pointer",letterSpacing:0.3,opacity:submitting?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {submitting&&<span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>}
            {submitting?"Registering...":"Confirm Registration →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHECK-IN ─────────────────────────────────────────────────────────────────
function CheckIn({ guests, setGuests }) {
  const [pinOk,setPinOk]=useState(false);
  const [pin,setPin]=useState("");
  const [pinErr,setPinErr]=useState("");
  const [manual,setManual]=useState("");
  const [result,setResult]=useState(null);
  const [log,setLog]=useState([]);
  const [scanning,setScanning]=useState(false);
  const [pinLoading,setPinLoading]=useState(false);
  const videoRef=useRef(),streamRef=useRef(),timerRef=useRef();
  const DEMO_PIN="1234";

  const checkPin = async () => {
    setPinLoading(true); setPinErr("");
    // When Supabase is connected, fetch from app_config
    let correctPin=DEMO_PIN;
    if(supa){try{const{data}=await supa.from("app_config").select("value").eq("key","staff_pin").single();if(data?.value)correctPin=data.value;}catch(e){}}
    await new Promise(r=>setTimeout(r,400));
    if(pin===correctPin){setPinOk(true);}else{setPinErr("Incorrect PIN. Try: 1234");}
    setPinLoading(false);
  };

  const processGuest=id=>{
    const g=guests.find(x=>x.regNo===id.trim().toUpperCase()||x.name.toLowerCase().includes(id.toLowerCase().trim())||x.id===id);
    if(!g){setResult({ok:false,msg:"Not found: \""+id+"\""});return;}
    if(g.attended){setResult({ok:"dup",msg:"Already checked in: "+g.name+" at "+g.attendedAt});return;}
    const up={...g,attended:true,attendedAt:new Date().toLocaleTimeString()};
    dbUpsert("guests",up);
    setGuests(prev=>prev.map(x=>x.id===g.id?up:x));
    setLog(prev=>[up,...prev].slice(0,20));
    setResult({ok:true,guest:up});
  };

  const startScan=()=>{
    navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(stream=>{
      streamRef.current=stream; videoRef.current.srcObject=stream; setScanning(true);
      const doScan=()=>{
        const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
        timerRef.current=setInterval(()=>{
          if(!videoRef.current?.videoWidth)return;
          canvas.width=videoRef.current.videoWidth; canvas.height=videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current,0,0);
          if(window.jsQR){
            const d=ctx.getImageData(0,0,canvas.width,canvas.height);
            const code=window.jsQR(d.data,d.width,d.height);
            if(code?.data){clearInterval(timerRef.current);stream.getTracks().forEach(t=>t.stop());setScanning(false);const parts=code.data.split("|");processGuest(parts[1]||parts[0]);}
          }
        },300);
      };
      if(window.jsQR){doScan();return;}
      const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js";s.onload=doScan;document.head.appendChild(s);
    }).catch(e=>setResult({ok:false,msg:"Camera: "+e.message}));
  };
  const stopScan=()=>{clearInterval(timerRef.current);streamRef.current?.getTracks().forEach(t=>t.stop());setScanning(false);};
  useEffect(()=>()=>stopScan(),[]);

  const confirmed=guests, checkedIn=guests.filter(g=>g.attended);

  if(!pinOk)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px"}}>
      <div className="pop-in" style={{background:C.white,borderRadius:20,boxShadow:"0 8px 40px rgba(99,102,241,0.12)",border:"1px solid "+C.border,width:"min(400px,100%)",padding:"clamp(24px,5vw,44px)"}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <Logo size={36}/>
          <h2 style={{fontSize:21,fontWeight:800,color:C.text,margin:"18px 0 4px"}}>Staff Check-In</h2>
          <div style={{background:C.indigoLight,borderRadius:7,padding:"5px 14px",display:"inline-block",marginTop:8,fontSize:11,color:C.indigo,fontWeight:600}}>Demo PIN: 1234</div>
        </div>
        {pinErr&&<div className="slide-in" style={{background:C.redLight,border:"1px solid "+C.red,borderRadius:8,padding:"8px 12px",color:C.red,fontSize:13,marginBottom:12}}>{pinErr}</div>}
        <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>Staff PIN</label>
        <input className="input-field" type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="••••••"
          onKeyDown={e=>e.key==="Enter"&&checkPin()} style={{marginBottom:12}}/>
        <button className="btn-grad" onClick={checkPin} disabled={pinLoading}
          style={{width:"100%",color:"#fff",border:"none",borderRadius:9,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {pinLoading&&<span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>}
          Continue →
        </button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,padding:"80px 20px 40px"}}>
      <div style={{maxWidth:620,margin:"0 auto"}}>
        <div className="fade-up">
          <h2 style={{fontSize:"clamp(20px,4vw,26px)",fontWeight:800,color:C.text,marginBottom:4}}>Check-In</h2>
          <p style={{color:C.textMid,fontSize:13,marginBottom:20}}>{checkedIn.length} of {confirmed.length} checked in</p>
        </div>

        {/* Stats */}
        <div className="fade-up delay-1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
          {[[confirmed.length,"Total",C.indigoLight,C.indigo],[checkedIn.length,"Checked In",C.greenLight,C.green],[confirmed.length-checkedIn.length,"Pending",C.yellowLight,C.yellow]].map(([n,l,bg,col])=>(
            <div key={l} className="card-hover" style={{background:bg,borderRadius:12,padding:"14px 10px",textAlign:"center",border:"1px solid "+col+"33",boxShadow:"0 2px 10px "+col+"11",cursor:"default",transition:"all 0.25s"}}>
              <div style={{fontSize:28,fontWeight:800,color:col}}>{n}</div>
              <div style={{fontSize:10,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Result */}
        {result&&(
          <div className="slide-in" style={{background:result.ok===true?C.greenLight:result.ok==="dup"?C.yellowLight:C.redLight,border:"1px solid "+(result.ok===true?C.green:result.ok==="dup"?C.yellow:C.red),borderRadius:12,padding:"14px 18px",marginBottom:14}}>
            {result.ok===true&&<><div style={{fontWeight:700,color:C.green,fontSize:15,marginBottom:2}}>✅ Checked In!</div><div style={{color:"#064E3B",fontSize:13}}>{result.guest.name} &nbsp;·&nbsp; #{result.guest.regNo} &nbsp;·&nbsp; {result.guest.attendedAt}</div></>}
            {result.ok==="dup"&&<div style={{color:"#92400E",fontSize:14,fontWeight:600}}>⚠️ {result.msg}</div>}
            {result.ok===false&&<div style={{color:C.red,fontSize:14}}>❌ {result.msg}</div>}
          </div>
        )}

        {/* Camera */}
        <div className="fade-up delay-1" style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,padding:18,marginBottom:12,boxShadow:"0 2px 12px rgba(99,102,241,0.06)"}}>
          <video ref={videoRef} autoPlay playsInline muted style={{width:"100%",borderRadius:10,display:scanning?"block":"none",border:"2px solid "+C.indigo,marginBottom:10}}/>
          {!scanning
            ?<button className="btn-grad" onClick={startScan} style={{width:"100%",color:"#fff",border:"none",borderRadius:9,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer"}}>📷 Scan QR Code</button>
            :<button onClick={stopScan} style={{width:"100%",background:C.redLight,color:C.red,border:"1px solid "+C.red,borderRadius:9,padding:"12px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>■ Stop Camera</button>
          }
        </div>

        {/* Manual */}
        <div className="fade-up delay-2" style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,padding:18,marginBottom:18,boxShadow:"0 2px 12px rgba(99,102,241,0.06)"}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>Manual Lookup</label>
          <div style={{display:"flex",gap:8}}>
            <input className="input-field" value={manual} onChange={e=>setManual(e.target.value)} placeholder="Name or Reg No e.g. K001"
              onKeyDown={e=>e.key==="Enter"&&(processGuest(manual),setManual(""))} style={{flex:1}}/>
            <button className="btn-grad" onClick={()=>{processGuest(manual);setManual("");}} style={{color:"#fff",border:"none",borderRadius:8,padding:"0 18px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Go</button>
          </div>
        </div>

        {/* Recent */}
        {log.length>0&&(
          <div className="fade-up delay-2" style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,overflow:"hidden",marginBottom:14,boxShadow:"0 2px 12px rgba(99,102,241,0.06)"}}>
            <div style={{padding:"12px 18px",borderBottom:"1px solid "+C.border,fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase"}}>Recent Check-Ins</div>
            {log.slice(0,5).map((g,i)=>(
              <div key={g.id} className="slide-in" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 18px",borderBottom:"1px solid "+C.border,animationDelay:(i*0.05)+"s"}}>
                <div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{g.name}</div><div style={{fontSize:11,color:C.textMid}}>Pax {g.pax} &nbsp;·&nbsp; {g.dietary}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:C.indigo}}>{g.regNo}</div><div style={{fontSize:10,color:C.textLight}}>{g.attendedAt}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* Full list */}
        <div className="fade-up delay-3" style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,overflow:"hidden",boxShadow:"0 2px 12px rgba(99,102,241,0.06)"}}>
          <div style={{padding:"12px 18px",borderBottom:"1px solid "+C.border,fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase"}}>All Registrations</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:C.bg}}>{["Name","Email","Pax","Reg#","Status"].map(h=><th key={h} style={{padding:"10px 14px",color:C.textMid,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>
                {guests.map(g=>(
                  <tr key={g.id} style={{borderTop:"1px solid "+C.border,transition:"background 0.15s"}} onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 14px",fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{g.name}</td>
                    <td style={{padding:"10px 14px",color:C.textMid,fontSize:12}}>{g.email}</td>
                    <td style={{padding:"10px 14px",color:C.textMid}}>{g.pax}</td>
                    <td style={{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:C.indigo}}>{g.regNo}</td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{background:g.attended?C.greenLight:C.indigoLight,color:g.attended?C.green:C.indigo,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
                        {g.attended?"✓ "+g.attendedAt:"Pending"}
                      </span>
                    </td>
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

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function Admin({ guests, setGuests, event, setEvent }) {
  const [authed,setAuthed]=useState(false);
  const [pass,setPass]=useState("");
  const [passErr,setPassErr]=useState("");
  const [passLoading,setPassLoading]=useState(false);
  const [tab,setTab]=useState("event");
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [newP,setNewP]=useState({name:"",email:"",pax:1,dietary:"No Preference"});
  const DEMO_PASS="admin123";

  const checkPass = async () => {
    setPassLoading(true); setPassErr("");
    let correct=DEMO_PASS;
    if(supa){try{const{data}=await supa.from("app_config").select("value").eq("key","admin_password").single();if(data?.value)correct=data.value;}catch(e){}}
    await new Promise(r=>setTimeout(r,400));
    if(pass===correct){setAuthed(true);}else{setPassErr("Incorrect password. Demo: admin123");}
    setPassLoading(false);
  };

  if(!authed)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px"}}>
      <div className="pop-in" style={{background:C.white,borderRadius:20,boxShadow:"0 8px 40px rgba(99,102,241,0.12)",border:"1px solid "+C.border,width:"min(440px,100%)",padding:"clamp(24px,5vw,48px)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Logo size={42}/>
          <h2 style={{fontSize:23,fontWeight:800,color:C.text,margin:"18px 0 4px"}}>Admin Portal</h2>
          <div style={{background:C.indigoLight,border:"1px solid "+C.borderMid,borderRadius:9,padding:"8px 16px",display:"inline-block",marginTop:10,fontSize:12,color:C.indigo,fontWeight:600}}>🔒 Demo password: admin123</div>
        </div>
        {passErr&&<div className="slide-in" style={{background:C.redLight,border:"1px solid "+C.red,borderRadius:8,padding:"8px 12px",color:C.red,fontSize:13,marginBottom:12}}>{passErr}</div>}
        <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>Password</label>
        <input className="input-field" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
          onKeyDown={e=>e.key==="Enter"&&checkPass()} style={{marginBottom:12}}/>
        <button className="btn-grad" onClick={checkPass} disabled={passLoading}
          style={{width:"100%",color:"#fff",border:"none",borderRadius:9,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {passLoading&&<span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>}
          Sign In →
        </button>
      </div>
    </div>
  );

  const confirmed=guests, checkedIn=guests.filter(g=>g.attended);
  const filtered=confirmed.filter(g=>!search||g.name.toLowerCase().includes(search.toLowerCase())||g.email.toLowerCase().includes(search.toLowerCase())||(g.regNo||"").includes(search.toUpperCase()));
  const dietaryCounts=["No Preference","Non-Veg","Vegetarian","Vegan"].map(d=>({label:d,count:confirmed.filter(g=>g.dietary===d).length,pax:confirmed.filter(g=>g.dietary===d).reduce((a,g)=>a+g.pax,0)}));
  const tabs=[{id:"event",label:"Event Info"},{id:"people",label:"People"},{id:"rsvp",label:"RSVP Status"},{id:"dietary",label:"Dietary"},{id:"downloads",label:"Downloads"}];
  const iStyle={width:"100%",border:"1.5px solid "+C.borderMid,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.text,background:"#FAFBFF",outline:"none",fontFamily:"inherit",transition:"border 0.15s"};

  const addPerson = async () => {
    if(!newP.name.trim())return;
    const regNo="K"+String(guests.length+1).padStart(3,"0");
    const g={id:uid(),name:newP.name.trim(),email:newP.email.trim(),pax:parseInt(newP.pax)||1,dietary:newP.dietary,regNo,attended:false,rsvpStatus:"confirmed",createdAt:new Date().toISOString()};
    await dbUpsert("guests",g);
    setGuests(prev=>[...prev,g]);
    setNewP({name:"",email:"",pax:1,dietary:"No Preference"});
    setShowAdd(false);
  };

  const removePerson = async (id, name) => {
    if(!window.confirm("Remove "+name+"?"))return;
    await dbDelete("guests",id);
    setGuests(prev=>prev.filter(x=>x.id!==id));
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{paddingTop:58}}>
        {/* Header */}
        <div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"16px clamp(12px,3vw,32px)"}}>
          <div style={{maxWidth:1040,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div>
              <h2 style={{fontSize:"clamp(18px,3vw,22px)",fontWeight:800,color:C.text,margin:"0 0 2px"}}>Admin Dashboard</h2>
              <p style={{fontSize:13,color:C.textMid,margin:0}}>{event.title}</p>
            </div>
            <button onClick={()=>setAuthed(false)} style={{background:"transparent",color:C.textMid,border:"1px solid "+C.border,borderRadius:7,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.indigo} onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{background:C.white,borderBottom:"1px solid "+C.border}}>
          <div style={{maxWidth:1040,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))"}}>
            {[[confirmed.length,"Registered",C.indigo],[checkedIn.length,"Checked In",C.green],[confirmed.length-checkedIn.length,"Pending",C.yellow],[confirmed.reduce((a,g)=>a+g.pax,0),"Total Pax",C.pink]].map(([n,l,col])=>(
              <div key={l} style={{padding:"16px clamp(8px,2vw,20px)",textAlign:"center",borderRight:"1px solid "+C.border}}>
                <div style={{fontSize:"clamp(20px,3vw,28px)",fontWeight:800,color:col}}>{n}</div>
                <div style={{fontSize:10,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{background:C.white,borderBottom:"1px solid "+C.border,overflowX:"auto"}}>
          <div style={{maxWidth:1040,margin:"0 auto",display:"flex",padding:"0 clamp(12px,3vw,24px)"}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{border:"none",background:"transparent",color:tab===t.id?C.indigo:C.textLight,padding:"13px 16px",fontSize:13,fontWeight:tab===t.id?700:500,borderBottom:tab===t.id?"2.5px solid "+C.indigo:"2.5px solid transparent",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.18s",fontFamily:"inherit"}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{maxWidth:1040,margin:"0 auto",padding:"24px clamp(12px,3vw,32px)"}}>

          {/* EVENT INFO */}
          {tab==="event"&&(
            <div className="fade-up">
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>Event Details</h3>
              <div style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,padding:24,marginBottom:16,boxShadow:"0 2px 12px rgba(99,102,241,0.05)"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(220px,100%),1fr))",gap:16}}>
                  {[["Title","title"],["Year","year"],["Date","date"],["Time","time"],["Venue","venue"],["Dress Code","dresscode"]].map(([lbl,key])=>(
                    <div key={key}>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{lbl}</label>
                      <input style={iStyle} value={event[key]||""} onChange={e=>setEvent(p=>({...p,[key]:e.target.value}))}
                        onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,padding:24,boxShadow:"0 2px 12px rgba(99,102,241,0.05)"}}>
                <h4 style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>📧 Email Template</h4>
                <p style={{fontSize:12,color:C.textMid,marginBottom:14}}>Ready — plug in Resend API key to activate sending.</p>
                <div style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>Subject Line</label>
                  <input style={iStyle} value={event.emailSubject||""} onChange={e=>setEvent(p=>({...p,emailSubject:e.target.value}))}
                    onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>Email Body</label>
                  <textarea style={{...iStyle,resize:"vertical",lineHeight:1.6}} rows={7} value={event.emailBody||""} onChange={e=>setEvent(p=>({...p,emailBody:e.target.value}))}
                    onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                </div>
                <div style={{marginTop:12,background:C.indigoLight,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.indigo}}>
                  💡 Variables: {`{{name}} {{pax}} {{dietary}} {{regNo}} {{date}} {{time}} {{venue}} {{dresscode}} {{title}}`}
                </div>
              </div>
            </div>
          )}

          {/* PEOPLE */}
          {tab==="people"&&(
            <div className="fade-up">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <h3 style={{fontSize:18,fontWeight:700,color:C.text}}>People ({confirmed.length})</h3>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <input className="input-field" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or email…" style={{width:"clamp(140px,25vw,240px)"}}/>
                  <button className="btn-grad" onClick={()=>setShowAdd(v=>!v)}
                    style={{color:"#fff",border:"none",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                    {showAdd?"✕ Cancel":"＋ Add Person"}
                  </button>
                </div>
              </div>

              {showAdd&&(
                <div className="slide-in" style={{background:C.white,borderRadius:14,border:"1.5px solid "+C.indigo,padding:22,marginBottom:16,boxShadow:"0 4px 20px rgba(99,102,241,0.12)"}}>
                  <h4 style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>Add New Person</h4>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(180px,100%),1fr))",gap:12,marginBottom:12}}>
                    {[["Full Name","name","text"],["Email","email","email"],["Pax","pax","number"]].map(([lbl,key,type])=>(
                      <div key={key}>
                        <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>{lbl}</label>
                        <input type={type} style={iStyle} value={newP[key]} onChange={e=>setNewP(p=>({...p,[key]:e.target.value}))} min={type==="number"?1:undefined}
                          onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}/>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:16}}>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>Dietary</label>
                    <select style={iStyle} value={newP.dietary} onChange={e=>setNewP(p=>({...p,dietary:e.target.value}))}
                      onFocus={e=>e.target.style.borderColor=C.indigo} onBlur={e=>e.target.style.borderColor=C.borderMid}>
                      {["No Preference","Non-Veg","Vegetarian","Vegan"].map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn-grad" onClick={addPerson} style={{color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Add Person</button>
                    <button onClick={()=>setShowAdd(false)} style={{background:"transparent",color:C.indigo,border:"1.5px solid "+C.indigo,borderRadius:8,padding:"10px 22px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,overflow:"hidden",boxShadow:"0 2px 12px rgba(99,102,241,0.05)"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead><tr style={{background:C.bg}}>{["Name","Email","Pax","Dietary","Reg#","Status",""].map(h=><th key={h} style={{padding:"10px 14px",color:C.textMid,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {filtered.map((g,i)=>(
                        <tr key={g.id} style={{borderTop:"1px solid "+C.border,animation:"fadeIn 0.3s ease "+(i*0.03)+"s both",transition:"background 0.15s"}}
                          onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{padding:"10px 14px",fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{g.name}</td>
                          <td style={{padding:"10px 14px",color:C.textMid,fontSize:12}}>{g.email}</td>
                          <td style={{padding:"10px 14px",color:C.textMid}}>{g.pax}</td>
                          <td style={{padding:"10px 14px",color:C.textMid,whiteSpace:"nowrap"}}>{g.dietary}</td>
                          <td style={{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:C.indigo}}>{g.regNo}</td>
                          <td style={{padding:"10px 14px"}}>
                            <span style={{background:g.attended?C.greenLight:C.indigoLight,color:g.attended?C.green:C.indigo,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
                              {g.attended?"✓ "+g.attendedAt:"Pending"}
                            </span>
                          </td>
                          <td style={{padding:"10px 14px"}}>
                            <button onClick={()=>removePerson(g.id,g.name)}
                              style={{background:C.redLight,color:C.red,border:"none",borderRadius:5,padding:"3px 9px",fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}
                              onMouseOver={e=>e.currentTarget.style.background="#FECACA"} onMouseOut={e=>e.currentTarget.style.background=C.redLight}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filtered.length===0&&<tr><td colSpan={7} style={{padding:"32px 14px",textAlign:"center",color:C.textLight,fontSize:13}}>No results found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RSVP STATUS */}
          {tab==="rsvp"&&(
            <div className="fade-up">
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>RSVP Status</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(180px,100%),1fr))",gap:14,marginBottom:20}}>
                {[[confirmed.length,"Confirmed","#DCFCE7",C.green],[checkedIn.length,"Checked In",C.greenLight,C.green],[confirmed.length-checkedIn.length,"Not Yet In",C.yellowLight,C.yellow],[confirmed.reduce((a,g)=>a+g.pax,0),"Total Pax",C.indigoLight,C.indigo]].map(([n,l,bg,col],i)=>(
                  <div key={l} className="pop-in" style={{background:bg,borderRadius:14,padding:"18px 20px",animationDelay:(i*0.06)+"s"}}>
                    <div style={{fontSize:11,color:col,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>{l}</div>
                    <div style={{fontSize:34,fontWeight:800,color:col}}>{n}</div>
                  </div>
                ))}
              </div>
              <div style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,padding:20,marginBottom:14,boxShadow:"0 2px 12px rgba(99,102,241,0.05)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.text}}>Check-In Progress</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.indigo}}>{confirmed.length>0?Math.round(checkedIn.length/confirmed.length*100):0}%</span>
                </div>
                <div style={{background:C.border,borderRadius:99,height:14,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:99,background:C.grad,width:(confirmed.length>0?checkedIn.length/confirmed.length*100:0)+"%",transition:"width 0.6s ease",boxShadow:"0 2px 8px rgba(99,102,241,0.4)"}}/>
                </div>
              </div>
              <div style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,overflow:"hidden",boxShadow:"0 2px 12px rgba(99,102,241,0.05)"}}>
                {confirmed.map(g=>(
                  <div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderBottom:"1px solid "+C.border,transition:"background 0.15s"}}
                    onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{g.name}</div><div style={{fontSize:11,color:C.textMid}}>Pax {g.pax} &nbsp;·&nbsp; {g.dietary}</div></div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:C.indigo}}>{g.regNo}</span>
                      <span style={{background:g.attended?C.greenLight:C.indigoLight,color:g.attended?C.green:C.indigo,borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700}}>{g.attended?"✓ "+g.attendedAt:"Pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIETARY */}
          {tab==="dietary"&&(
            <div className="fade-up">
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>Dietary Summary</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(180px,100%),1fr))",gap:14,marginBottom:20}}>
                {dietaryCounts.map(({label,count,pax},i)=>(
                  <div key={label} className="pop-in card-hover" style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,padding:"20px",textAlign:"center",boxShadow:"0 2px 12px rgba(99,102,241,0.05)",animationDelay:(i*0.06)+"s",transition:"all 0.25s",cursor:"default"}}>
                    <div style={{fontSize:30,marginBottom:8}}>{{"No Preference":"🍽","Non-Veg":"🍖","Vegetarian":"🥗","Vegan":"🌱"}[label]}</div>
                    <div style={{fontSize:26,fontWeight:800,color:C.indigo}}>{count}</div>
                    <div style={{fontSize:13,color:C.textMid,fontWeight:600,marginTop:2}}>{label}</div>
                    <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{pax} pax total</div>
                  </div>
                ))}
              </div>
              <div style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,overflow:"hidden",boxShadow:"0 2px 12px rgba(99,102,241,0.05)"}}>
                <div style={{padding:"12px 18px",borderBottom:"1px solid "+C.border,fontSize:11,fontWeight:700,color:C.textMid,letterSpacing:1.2,textTransform:"uppercase"}}>By Person</div>
                {confirmed.map(g=>(
                  <div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderBottom:"1px solid "+C.border,transition:"background 0.15s"}}
                    onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
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

          {/* DOWNLOADS */}
          {tab==="downloads"&&(
            <div className="fade-up">
              <h3 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>Downloads & Export</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:14}}>
                {[
                  ["📋 Guest List CSV","All registrations as spreadsheet",()=>{const rows=[["Reg#","Name","Email","Pax","Dietary","Status","Check-In Time"],...confirmed.map(g=>[g.regNo,g.name,g.email,g.pax,g.dietary,g.attended?"Checked In":"Pending",g.attendedAt||""])];const csv=rows.map(r=>r.map(v=>'"'+String(v)+'"').join(",")).join("\n");const a=document.createElement("a");a.href="data:text/csv,"+encodeURIComponent(csv);a.download="koerber_guests.csv";a.click();}],
                  ["📊 Check-In Report","Attendance summary CSV",()=>{const rows=[["Reg#","Name","Status","Time"],...confirmed.map(g=>[g.regNo,g.name,g.attended?"IN":"PENDING",g.attendedAt||""])];const csv=rows.map(r=>r.map(v=>'"'+String(v)+'"').join(",")).join("\n");const a=document.createElement("a");a.href="data:text/csv,"+encodeURIComponent(csv);a.download="koerber_checkin.csv";a.click();}],
                  ["🍽 Dietary Report","Food requirements CSV",()=>{const rows=[["Dietary","Count","Total Pax"],...dietaryCounts.map(d=>[d.label,d.count,d.pax])];const csv=rows.map(r=>r.map(v=>'"'+String(v)+'"').join(",")).join("\n");const a=document.createElement("a");a.href="data:text/csv,"+encodeURIComponent(csv);a.download="koerber_dietary.csv";a.click();}],
                  ["🖨 Print Guest List","Open print dialog",()=>window.print()],
                ].map(([title,desc,fn],i)=>(
                  <div key={title} className="card-hover pop-in" style={{background:C.white,borderRadius:14,border:"1px solid "+C.border,padding:22,boxShadow:"0 2px 12px rgba(99,102,241,0.05)",animationDelay:(i*0.07)+"s",transition:"all 0.25s"}}>
                    <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:6}}>{title}</div>
                    <div style={{fontSize:12,color:C.textMid,marginBottom:18,lineHeight:1.5}}>{desc}</div>
                    <button className="btn-grad" onClick={fn} style={{width:"100%",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Export</button>
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

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,  setPage]  = useState("home");
  const [guests,setGuests]= useState(INIT_GUESTS);
  const [event, setEvent] = useState(INIT_EVENT);
  const [appErr,setAppErr]= useState(null);

  if (appErr) return (
    <div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,padding:40,maxWidth:480,width:"100%",textAlign:"center",border:"1px solid #E0E7FF",boxShadow:"0 4px 24px rgba(99,102,241,0.1)"}}>
        <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
        <h2 style={{color:"#1E1B4B",fontFamily:"sans-serif",marginBottom:8}}>App Error</h2>
        <p style={{color:"#64748B",fontSize:13,marginBottom:20,fontFamily:"sans-serif"}}>{String(appErr)}</p>
        <button onClick={()=>window.location.reload()} style={{background:"linear-gradient(135deg,#6366F1,#EC4899)",color:"#fff",border:"none",borderRadius:8,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Reload
        </button>
      </div>
    </div>
  );

    // Load Supabase CDN then fetch data
  useEffect(()=>{
    const loadSupa = () => new Promise((ok, no) => {
      if (window.supabase) { ok(); return; }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
      s.onload = ok; s.onerror = no;
      document.head.appendChild(s);
    });
    loadSupa().then(async () => {
      initSupa();
      if (!supa) return;
      try {
        const [gs, cfg] = await Promise.all([dbAll("guests"), dbAll("app_config")]);
        if (gs.length) setGuests(gs);
        if (cfg.length) {
          const m = Object.fromEntries(cfg.map(r => [r.key, r.value]));
          setEvent(p => ({...p, ...m}));
        }
      } catch(e) { console.warn("Supabase load:", e); }
    }).catch(e => console.warn("Supabase CDN failed:", e));
  },[]);


  useEffect(()=>{ window.scrollTo(0,0); },[page]);

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <style>{GS}</style>
      <Nav page={page} setPage={setPage}/>
      {page==="home"    && <Home    setPage={setPage} event={event} guests={guests}/>}
      {page==="rsvp"    && <RSVP    guests={guests} setGuests={setGuests} event={event}/>}
      {page==="checkin" && <CheckIn guests={guests} setGuests={setGuests}/>}
      {page==="admin"   && <Admin   guests={guests} setGuests={setGuests} event={event} setEvent={setEvent}/>}
    </div>
  );
}