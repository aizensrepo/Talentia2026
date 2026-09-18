import Reveal from "../components/Reveal.jsx";
import GiantWord from "../components/GiantWord.jsx";
import { TALENTIA_CONFIG, waLink, isPlaceholder } from "../data/config.js";

function ContactCard({ title, name, role, phone, whatsapp, email }) {
  return (
    <div className="glass rounded-3xl p-6">
      <p className="font-mono2 text-[10px] tracking-[0.25em] text-cyan-300">{title.toUpperCase()}</p>
      <h3 className="font-display mt-2 text-lg font-bold">{name}</h3>
      <p className="text-sm text-white/55">{role}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {phone && !isPlaceholder(phone) && (
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn-magnetic rounded-xl bg-white px-4 py-2 text-xs font-bold text-black">☎ CALL</a>
        )}
        {phone && isPlaceholder(phone) && (
          <span className="rounded-xl border border-white/10 px-4 py-2 font-mono2 text-xs text-white/35">CALL: {phone}</span>
        )}
        {whatsapp && !isPlaceholder(whatsapp) && (
          <a href={waLink(whatsapp, "Hi, I have a question about TALENTIA ’26.")} target="_blank" rel="noreferrer" className="btn-magnetic rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-black">WHATSAPP</a>
        )}
        {email && !isPlaceholder(email) && (
          <a href={`mailto:${email}`} className="btn-magnetic rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold">✉ EMAIL</a>
        )}
        {email && isPlaceholder(email) && (
          <span className="rounded-xl border border-white/10 px-4 py-2 font-mono2 text-xs text-white/35">EMAIL: {email}</span>
        )}
      </div>
      {(isPlaceholder(name) || isPlaceholder(role)) && (
        <p className="mt-3 font-mono2 text-[10px] text-white/30">Editable via TALENTIA_CONFIG in src/data/config.js</p>
      )}
    </div>
  );
}

export default function Contact() {
  const cfg = TALENTIA_CONFIG;
  return (
    <section id="contact" className="relative overflow-hidden py-20">
      <GiantWord word="TALK" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="font-mono2 text-[11px] tracking-[0.3em] text-cyan-300">05 — CONTACT</p>
          <h2 className="font-display mt-3 text-3xl font-black sm:text-5xl">CONTACT US</h2>
          <p className="mt-3 text-white/60">EVENT COORDINATORS — reach out for registration help, team queries or event details.</p>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cfg.coordinators.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <ContactCard title={c.label} name={c.name} role={c.role} phone={c.phone} whatsapp={c.whatsapp} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <div className="mt-5">
            <ContactCard title={cfg.faculty.label} name={cfg.faculty.name} role={cfg.faculty.role} email={cfg.faculty.email} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
