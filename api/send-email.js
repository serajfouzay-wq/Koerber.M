const RESEND_KEY = process.env.RESEND_KEY || "re_BSoKVwo2_6BCKwGdedSw52rx4ZgUmGso4";
const FROM = "Koerber Events <onboarding@resend.dev>";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { to, name, subject, text, qrDataUrl, regNo, pax, dietary, date, time, venue, dresscode, title } = req.body || {};
  if (!to || !name) return res.status(400).json({ ok: false, error: "Missing to or name" });

  const qrImg = qrDataUrl ? `<div style="text-align:center;margin:16px 0"><img src="${qrDataUrl}" width="180" height="180" style="border-radius:10px;border:4px solid rgba(236,72,153,0.5)"/></div>` : "";

  const html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><div style="background:linear-gradient(135deg,#6366F1,#EC4899);padding:28px;text-align:center"><h1 style="color:#fff;margin:0;letter-spacing:3px">KOERBER</h1><p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:11px">Technology Group</p></div><div style="padding:28px;background:#F8F9FF"><p style="font-size:16px;color:#1E1B4B">Dear <strong>${name}</strong>,</p><p style="color:#64748B;margin:0 0 20px">Your registration for <strong>${title||"the event"}</strong> is confirmed.</p><div style="background:#1E1B4B;border-radius:12px;padding:24px;text-align:center;margin-bottom:20px">${qrImg}<div style="color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:2px;margin-bottom:6px">REGISTRATION NUMBER</div><div style="font-family:monospace;font-size:26px;font-weight:900;color:#A5B4FC;letter-spacing:6px">${regNo||""}</div></div><table style="width:100%;background:#EEF2FF;border-radius:8px;border-collapse:collapse"><tr><td style="padding:7px 14px;color:#6366F1;font-weight:700;font-size:13px">Date</td><td style="padding:7px 14px;color:#1E1B4B;font-size:13px">${date||""}</td></tr><tr><td style="padding:7px 14px;color:#6366F1;font-weight:700;font-size:13px">Time</td><td style="padding:7px 14px;color:#1E1B4B;font-size:13px">${time||""}</td></tr><tr><td style="padding:7px 14px;color:#6366F1;font-weight:700;font-size:13px">Venue</td><td style="padding:7px 14px;color:#1E1B4B;font-size:13px">${venue||""}</td></tr><tr><td style="padding:7px 14px;color:#6366F1;font-weight:700;font-size:13px">Pax</td><td style="padding:7px 14px;color:#1E1B4B;font-size:13px">${pax||1}</td></tr><tr><td style="padding:7px 14px;color:#6366F1;font-weight:700;font-size:13px">Dietary</td><td style="padding:7px 14px;color:#1E1B4B;font-size:13px">${dietary||""}</td></tr></table><p style="font-size:12px;color:#94A3B8;text-align:center;margin-top:20px">Show your QR code at the entrance for check-in.</p></div><div style="background:#1E1B4B;padding:14px;text-align:center"><p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0">KOERBER TECHNOLOGY GROUP</p></div></div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject: subject || `Registration Confirmed — ${title||"Koerber Event"}`, html, text: text || `Dear ${name}, registration confirmed. Reg: ${regNo}` }),
    });
    const txt = await r.text();
    let d = {}; try { d = JSON.parse(txt); } catch(e) {}
    if (r.ok && d.id) return res.status(200).json({ ok: true, id: d.id });
    console.error("Resend error:", r.status, txt);
    return res.status(200).json({ ok: false, error: d.message || txt.slice(0,100) });
  } catch(e) {
    console.error("Handler error:", e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
