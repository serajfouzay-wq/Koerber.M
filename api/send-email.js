const RESEND_KEY = process.env.RESEND_KEY;
const FROM_EMAIL = "Körber Events <onboarding@resend.dev>";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!RESEND_KEY) return res.status(200).json({ ok: false, error: "RESEND_KEY not set" });
  const { to, name, subject, html, text, qrDataUrl, regNo, pax, dietary, date, time, venue, dresscode, title } = req.body || {};
  if (!to) return res.status(400).json({ ok: false, error: "Missing to" });
  const emailHtml = html || `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><div style="background:linear-gradient(135deg,#6366F1,#EC4899);padding:28px;text-align:center"><h1 style="color:#fff;margin:0;letter-spacing:2px">KÖRBER</h1></div><div style="padding:28px;background:#F8F9FF"><p style="font-size:16px;color:#1E1B4B">Dear <strong>${name}</strong>,</p><p style="color:#64748B">Your registration is confirmed.</p><div style="background:#1E1B4B;border-radius:12px;padding:24px;text-align:center;margin:20px 0">${qrDataUrl?`<img src="${qrDataUrl}" width="180" height="180" style="border-radius:8px;border:4px solid rgba(236,72,153,0.5);display:block;margin:0 auto 12px"/>`:""}  <div style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;margin-bottom:4px">REGISTRATION NUMBER</div><div style="font-family:monospace;font-size:26px;font-weight:900;letter-spacing:6px;color:#A5B4FC">${regNo||""}</div></div><table style="width:100%;font-size:13px;border-collapse:collapse;background:#EEF2FF;border-radius:8px;padding:16px"><tr><td style="padding:5px 12px;color:#6366F1;font-weight:600">📅 Date</td><td style="padding:5px 12px;color:#1E1B4B">${date||""}</td></tr><tr><td style="padding:5px 12px;color:#6366F1;font-weight:600">🕕 Time</td><td style="padding:5px 12px;color:#1E1B4B">${time||""}</td></tr><tr><td style="padding:5px 12px;color:#6366F1;font-weight:600">📍 Venue</td><td style="padding:5px 12px;color:#1E1B4B">${venue||""}</td></tr><tr><td style="padding:5px 12px;color:#6366F1;font-weight:600">👔 Dress</td><td style="padding:5px 12px;color:#1E1B4B">${dresscode||""}</td></tr><tr><td style="padding:5px 12px;color:#6366F1;font-weight:600">👥 Pax</td><td style="padding:5px 12px;color:#1E1B4B">${pax||1}</td></tr><tr><td style="padding:5px 12px;color:#6366F1;font-weight:600">🍽 Dietary</td><td style="padding:5px 12px;color:#1E1B4B">${dietary||""}</td></tr></table></div><div style="background:#1E1B4B;padding:14px;text-align:center"><p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;letter-spacing:1px">KÖRBER TECHNOLOGY GROUP · koerber.com</p></div></div>`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject: subject || `Registration Confirmed — ${title||"Körber Event"}`, html: emailHtml, text: text || `Dear ${name}, your registration is confirmed. Reg: ${regNo}` }),
    });
    const txt = await r.text();
    let d = {}; try { d = JSON.parse(txt); } catch(e) {}
    if (r.ok && d.id) return res.status(200).json({ ok: true });
    return res.status(200).json({ ok: false, error: d.message || `Error ${r.status}` });
  } catch(e) { return res.status(500).json({ ok: false, error: String(e) }); }
}
