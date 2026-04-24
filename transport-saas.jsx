import { useState, useEffect } from "react";

const COLORS = {
  orange: "#F97316",
  orangeLight: "#FFF7ED",
  orangeMid: "#FB923C",
  navy: "#1E293B",
  navyLight: "#334155",
  slate: "#64748B",
  slateLight: "#F8FAFC",
  green: "#16A34A",
  greenLight: "#F0FDF4",
  red: "#DC2626",
  redLight: "#FEF2F2",
  yellow: "#EAB308",
  yellowLight: "#FEFCE8",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  white: "#FFFFFF",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  bg: "#F8FAFC",
};

const MOCK_PASSENGERS = [
  { id: 1, name: "Konan Ama", seat: "A1", status: "present", plan: "mensuel", avatar: "KA", route: "Cocody → Plateau" },
  { id: 2, name: "Diallo Mamadou", seat: "A2", status: "absent", plan: "hebdomadaire", avatar: "DM", route: "Cocody → Plateau" },
  { id: 3, name: "Touré Fatou", seat: "A3", status: "present", plan: "mensuel", avatar: "TF", route: "Cocody → Plateau" },
  { id: 4, name: "Bamba Seydou", seat: "B1", status: "present", plan: "mensuel", avatar: "BS", route: "Cocody → Plateau" },
  { id: 5, name: "Coulibaly Aïcha", seat: "B2", status: "non renseigné", plan: "hebdomadaire", avatar: "CA", route: "Cocody → Plateau" },
  { id: 6, name: "Konaté Ibrahim", seat: "B3", status: "present", plan: "mensuel", avatar: "KI", route: "Cocody → Plateau" },
  { id: 7, name: "Ouattara Mariam", seat: "C1", status: "absent", plan: "mensuel", avatar: "OM", route: "Cocody → Plateau" },
  { id: 8, name: "Traoré Yves", seat: "C2", status: "present", plan: "hebdomadaire", avatar: "TY", route: "Cocody → Plateau" },
  { id: 9, name: "Zoro Rosine", seat: "C3", status: "non renseigné", plan: "mensuel", avatar: "ZR", route: "Cocody → Plateau" },
  { id: 10, name: "N'Guessan Paul", seat: "D1", status: "present", plan: "mensuel", avatar: "NP", route: "Cocody → Plateau" },
  { id: 11, name: "Kouassi Léa", seat: "D2", status: "present", plan: "hebdomadaire", avatar: "KL", route: "Cocody → Plateau" },
  { id: 12, name: "Camara Adja", seat: "D3", status: "absent", plan: "mensuel", avatar: "CA", route: "Cocody → Plateau" },
];

const ROUTES = [
  { id: 1, name: "Cocody → Plateau", vehicle: "Toyota HiAce – AB 1234 CI", seats: 14, booked: 12, depart: "06:30", retour: "18:00", operator: "Koné Transport" },
  { id: 2, name: "Yopougon → Treichville", vehicle: "Mercedes Sprinter – XY 5678 CI", seats: 18, booked: 16, depart: "07:00", retour: "18:30", operator: "Sanogo Express" },
  { id: 3, name: "Abobo → Zone 4", vehicle: "Nissan Urvan – CD 9012 CI", seats: 12, booked: 8, depart: "06:45", retour: "18:15", operator: "Diallo Navette" },
];

const PAYMENT_METHODS = [
  { id: "orange", name: "Orange Money", color: "#FF7900", icon: "◉", prefix: "+225 07" },
  { id: "mtn", name: "MTN Mobile Money", color: "#FFCB00", icon: "◈", prefix: "+225 05" },
  { id: "moov", name: "Moov Money", color: "#005BAA", icon: "◆", prefix: "+225 01" },
  { id: "wave", name: "Wave", color: "#1DC8EE", icon: "◇", prefix: "+225 00" },
];

const ADMIN_STATS = {
  totalRevenue: 4_875_000,
  commissions: 487_500,
  activeSubscriptions: 247,
  activeRoutes: 12,
  monthlyGrowth: 18,
  pendingPayouts: 3,
};

const SUBSCRIPTIONS_HISTORY = [
  { id: "SUB-001", client: "Konan Ama", route: "Cocody → Plateau", plan: "Mensuel", amount: 25000, commission: 2500, status: "actif", date: "01/04/2026", method: "Orange Money" },
  { id: "SUB-002", client: "Diallo Mamadou", route: "Yopougon → Treichville", plan: "Hebdomadaire", amount: 7500, commission: 750, status: "actif", date: "20/04/2026", method: "Wave" },
  { id: "SUB-003", client: "Touré Fatou", route: "Cocody → Plateau", plan: "Mensuel", amount: 25000, commission: 2500, status: "actif", date: "01/04/2026", method: "MTN MoMo" },
  { id: "SUB-004", client: "Bamba Seydou", route: "Abobo → Zone 4", plan: "Mensuel", amount: 22000, commission: 2200, status: "expiré", date: "01/03/2026", method: "Moov Money" },
  { id: "SUB-005", client: "Ouattara Mariam", route: "Cocody → Plateau", plan: "Hebdomadaire", amount: 7500, commission: 750, status: "actif", date: "21/04/2026", method: "Orange Money" },
];

const fmtCFA = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

function Avatar({ initials, color = COLORS.orange, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Badge({ label, type = "default" }) {
  const styles = {
    default: { bg: COLORS.border, color: COLORS.slate },
    success: { bg: COLORS.greenLight, color: COLORS.green },
    danger: { bg: COLORS.redLight, color: COLORS.red },
    warning: { bg: COLORS.yellowLight, color: "#854F0B" },
    info: { bg: COLORS.blueLight, color: COLORS.blue },
    orange: { bg: COLORS.orangeLight, color: "#C2410C" },
  };
  const s = styles[type] || styles.default;
  return <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>{label}</span>;
}

function Card({ children, style = {} }) {
  return <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "20px 22px", ...style }}>{children}</div>;
}

function StatCard({ label, value, icon, accent = COLORS.orange }) {
  return (
    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{label}</span>
        <span style={{ fontSize: 18, color: accent }}>{icon}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.textPrimary }}>{value}</div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false }) {
  const base = { border: "none", cursor: disabled ? "not-allowed" : "pointer", borderRadius: 10, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s", opacity: disabled ? 0.5 : 1 };
  const sizes = { sm: { padding: "7px 14px", fontSize: 13 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "13px 28px", fontSize: 15 } };
  const variants = { primary: { background: COLORS.orange, color: COLORS.white }, secondary: { background: COLORS.bg, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` }, danger: { background: COLORS.red, color: COLORS.white }, success: { background: COLORS.green, color: COLORS.white }, ghost: { background: "transparent", color: COLORS.orange, border: `1px solid ${COLORS.orange}` }, };
  return <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>;
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: COLORS.white, borderRadius: 18, width: "100%", maxWidth: 460, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.textPrimary }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.slate, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function Landing({ onLogin }) {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, #0F2942 100%)`, color: COLORS.white, padding: "60px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: COLORS.orange + "22", border: `1px solid ${COLORS.orange}44`, borderRadius: 30, padding: "6px 16px", marginBottom: 28, color: COLORS.orangeMid, fontSize: 13, fontWeight: 600 }}> 🚐 La mobilité urbaine réinventée en Côte d'Ivoire </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, margin: "0 0 18px", lineHeight: 1.2 }}> Navette Pro — <span style={{ color: COLORS.orange }}>Transport partagé</span> en abonnement </h1>
          <p style={{ fontSize: 17, color: "#94A3B8", margin: "0 0 36px", lineHeight: 1.7 }}> Réservez votre place dans une navette dédiée, payez via mobile money, et voyagez sereinement chaque jour. </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" onClick={() => onLogin("client")} style={{ fontSize: 15 }}> 🙋 Je suis passager </Btn>
            <Btn size="lg" variant="ghost" onClick={() => onLogin("operator")} style={{ color: COLORS.white, borderColor: "#FFFFFF44" }}> 🚐 Je suis exploitant </Btn>
            <Btn size="lg" variant="ghost" onClick={() => onLogin("admin")} style={{ color: COLORS.orangeMid, borderColor: COLORS.orange + "66" }}> 👑 Espace propriétaire </Btn>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "50px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 32 }}>Tout ce dont vous avez besoin</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { icon: "💳", title: "Paiement mobile", desc: "Orange Money, MTN MoMo, Moov Money, Wave" },
            { icon: "📍", title: "Suivi de présence", desc: "Signalez votre disponibilité en un clic" },
            { icon: "🗓️", title: "Abonnement flexible", desc: "Formules hebdomadaires ou mensuelles" },
            { icon: "📊", title: "Tableau de bord", desc: "Visibilité totale pour les exploitants" },
          ].map((f) => (
            <Card key={f.title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: COLORS.textPrimary, margin: "48px 0 28px" }}>Tarifs transparents</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <Card style={{ border: `2px solid ${COLORS.orange}`, position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: 20, background: COLORS.orange, color: COLORS.white, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>POPULAIRE</div>
            <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 }}>Abonnement mensuel</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.textPrimary }}>22 000 <span style={{ fontSize: 14, fontWeight: 500 }}>FCFA</span></div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 16 }}>/mois · par trajet</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 2 }}>✓ Accès illimité · 30 jours<br />✓ Aller + Retour<br />✓ Annulation gratuite</div>
          </Card>
          <Card>
            <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 }}>Abonnement hebdo.</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.textPrimary }}>6 500 <span style={{ fontSize: 14, fontWeight: 500 }}>FCFA</span></div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 16 }}>/semaine · par trajet</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 2 }}>✓ Accès 7 jours<br />✓ Aller + Retour<br />✓ Renouvellement auto</div>
          </Card>
        </div>
        <div style={{ textAlign: "center", marginTop: 40, padding: "28px", background: COLORS.orangeLight, borderRadius: 16, border: `1px solid ${COLORS.orange}33` }}>
          <div style={{ fontSize: 14, color: "#C2410C", fontWeight: 600, marginBottom: 6 }}>💡 Pour les exploitants</div>
          <div style={{ fontSize: 13, color: "#9A3412", lineHeight: 1.7 }}> Inscrivez votre véhicule et gérez vos passagers facilement. Navette Pro prélève <strong>10% de commission</strong> sur chaque abonnement souscrit via la plateforme. </div>
        </div>
      </div>
    </div>
  );
}

function ClientDashboard({ onLogout }) {
  const [availability, setAvailability] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payStep, setPayStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);
  const [activeRoute] = useState(ROUTES[0]);
  const mySubscription = { plan: "Mensuel", seat: "A3", expiry: "30/04/2026", status: "actif", paid: 25000 };

  const handlePay = () => {
    setTimeout(() => {
      setPayStep(3);
      setPaySuccess(true);
    }, 1500);
  };

  const closePay = () => {
    setShowPayModal(false);
    setPayStep(1);
    setSelectedMethod(null);
    setPhone("");
    setPin("");
    setPaySuccess(false);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🚐</span>
            <span style={{ fontWeight: 800, color: COLORS.orange, fontSize: 17 }}>Navette Pro</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar initials="TF" color={COLORS.orange} size={34} />
            <span style={{ fontSize: 14, color: COLORS.textSecondary }}>Touré Fatou</span>
            <Btn size="sm" variant="secondary" onClick={onLogout}>Déconnexion</Btn>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
        <Card style={{ marginBottom: 20, background: availability ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${availability ? "#BBF7D0" : "#FECACA"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.textPrimary, marginBottom: 2 }}> Ma disponibilité aujourd'hui </div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary }}> Vendredi 24 avril 2026 · Départ 06h30 </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, marginBottom: 8, color: availability ? COLORS.green : COLORS.red, fontWeight: 600 }}> {availability ? "✓ Je serai présent(e)" : "✗ Je serai absent(e)" } </div>
              <div onClick={() => setAvailability(!availability)} style={{ width: 56, height: 28, borderRadius: 14, background: availability ? COLORS.green : "#CBD5E1", cursor: "pointer", position: "relative", transition: "all 0.3s", display: "inline-flex", alignItems: "center", padding: "0 3px", }} >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS.white, transform: availability ? "translateX(28px)" : "translateX(0px)", transition: "all 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", }} />
              </div>
            </div>
          </div>
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mon abonnement actif</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.textPrimary, marginBottom: 4 }}>{activeRoute.name}</div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 }}>Place <strong style={{ color: COLORS.orange }}>n°{mySubscription.seat}</strong> · {mySubscription.plan}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge label={`✓ ${mySubscription.status}`} type="success" />
                <Badge label={`Expire le ${mySubscription.expiry}`} type="info" />
                <Badge label={`${activeRoute.vehicle}`} type="default" />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary }}>{fmtCFA(mySubscription.paid)}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary }}>ce mois</div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 16, paddingTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120, background: COLORS.bg, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Départ matin</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>{activeRoute.depart}</div>
            </div>
            <div style={{ flex: 1, minWidth: 120, background: COLORS.bg, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Retour soir</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>{activeRoute.retour}</div>
            </div>
            <div style={{ flex: 1, minWidth: 120, background: COLORS.bg, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Exploitant</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{activeRoute.operator}</div>
            </div>
          </div>
        </Card>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: COLORS.textPrimary, margin: "0 0 14px" }}>Souscrire / Renouveler un abonnement</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { plan: "Mensuel", price: 25000, duration: "30 jours", icon: "📅", routes: ROUTES },
            { plan: "Hebdomadaire", price: 7500, duration: "7 jours", icon: "🗓️", routes: ROUTES },
          ].map((p) => (
            <Card key={p.plan} style={{ border: selectedPlan === p.plan ? `2px solid ${COLORS.orange}` : `1px solid ${COLORS.border}`, cursor: "pointer" }} >
              <div onClick={() => setSelectedPlan(p.plan)} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{p.icon} {p.plan}</span>
                  {selectedPlan === p.plan && <span style={{ color: COLORS.orange, fontSize: 18 }}>✓</span>}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary }}>{fmtCFA(p.price)}</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary }}>par trajet · {p.duration}</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 8, fontWeight: 600 }}>Choisir une ligne :</div>
                <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textPrimary, background: COLORS.white }} onClick={(e) => e.stopPropagation()> {
                {p.routes.map(r => <option key={r.id}>{r.name} — {r.depart}</option>)}
              </select>
            </Card>))}
        </div>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Historique des paiements</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[ { date: "01/04/2026", desc: "Abonnement Mensuel – Cocody → Plateau", amount: 25000, method: "Orange Money" }, { date: "01/03/2026", desc: "Abonnement Mensuel – Cocody → Plateau", amount: 25000, method: "Wave" }, { date: "01/02/2026", desc: "Abonnement Mensuel – Cocody → Plateau", amount: 25000, method: "Orange Money" }, ].map((h, i) => ( <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${COLORS.border}` : "none", gap: 10, flexWrap: "wrap" }}> <div> <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{h.desc}</div> <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{h.date} · {h.method}</div> </div> <Badge label={`-${fmtCFA(h.amount)}`} type="success" /> </div> ))}
          </div>
        </Card>
      </div>
      {showPayModal && (
        <Modal title="Paiement de l'abonnement" onClose={closePay}>
          {payStep === 1 && (
            <>
              <div style={{ background: COLORS.orangeLight, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#9A3412", fontWeight: 600 }}> Abonnement {selectedPlan || "Mensuel"} — {fmtCFA(selectedPlan === "Hebdomadaire" ? 7500 : 25000)} </div>
                <div style={{ fontSize: 12, color: "#C2410C" }}>Cocody → Plateau · Place assignée à la validation</div>
              </div>
              <div style={{ marginBottom: 6, fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>Choisir le mode de paiement</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {PAYMENT_METHODS.map(m => (
                <div key={m.id} onClick={() => setSelectedMethod(m)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, border: `2px solid ${selectedMethod?.id === m.id ? m.color : COLORS.border}`, cursor: "pointer", background: selectedMethod?.id === m.id ? m.color + "11" : COLORS.white, transition: "all 0.15s" }}>
                  <span style={{ fontSize: 22, color: m.color }}>{m.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>{m.name}</span>
                  {selectedMethod?.id === m.id && <span style={{ marginLeft: "auto", color: m.color, fontWeight: 700 }}>✓</span>}
                </div>
              ))}
              </div>
              <Btn style={{ width: "100%", justifyContent: "center" }} disabled={!selectedMethod} onClick={() => setPayStep(2)}> Continuer → </Btn>
            </>
          )}
          {payStep === 2 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: selectedMethod.color + "18", borderRadius: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 24, color: selectedMethod.color }}>{selectedMethod.icon}</span>
                <span style={{ fontWeight: 700, color: COLORS.textPrimary }}>{selectedMethod.name}</span>
              </div>
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, display: "block", marginBottom: 6 }}>Numéro {selectedMethod.name}</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={selectedMethod.prefix + " XX XX XX XX"} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14, marginBottom: 16, boxSizing: "border-box", color: COLORS.textPrimary }} />
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, display: "block", marginBottom: 6 }}>Code PIN</label>
              <input value={pin} onChange={e => setPin(e.target.value)} type="password" maxLength={4} placeholder="• • • •" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 18, marginBottom: 20, letterSpacing: 8, boxSizing: "border-box", color: COLORS.textPrimary }} />
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: COLORS.textSecondary }}> Montant à débiter : <strong style={{ color: COLORS.textPrimary }}>{fmtCFA(selectedPlan === "Hebdomadaire" ? 7500 : 25000)}</strong> </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="secondary" onClick={() => setPayStep(1)} style={{ flex: 1, justifyContent: "center" }}>← Retour</Btn>
                <Btn style={{ flex: 2, justifyContent: "center" }} disabled={!phone || !pin} onClick={handlePay}>Confirmer le paiement</Btn>
              </div>
            </>
          )}
          {payStep === 3 && paySuccess && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.green, marginBottom: 8 }}>Paiement réussi !</div>
              <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 }}>Votre abonnement <strong>{selectedPlan}</strong> est activé.</div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 24 }}>Un SMS de confirmation a été envoyé sur votre numéro {selectedMethod?.name}.</div>
              <Badge label={fmtCFA(selectedPlan === "Hebdomadaire" ? 7500 : 25000)} type="success" />
              <div style={{ marginTop: 24 }}>
                <Btn onClick={closePay} style={{ width: "100%", justifyContent: "center" }}>Fermer</Btn>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function OperatorDashboard({ onLogout }) {
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0]);
  const [passengers, setPassengers] = useState(MOCK_PASSENGERS);
  const [viewMode, setViewMode] = useState("list");
  const present = passengers.filter(p => p.status === "present").length;
  const absent = passengers.filter(p => p.status === "absent").length;
  const unknown = passengers.filter(p => p.status === "non renseigné").length;
  const statusColor = (s) => s === "present" ? COLORS.green : s === "absent" ? COLORS.red : COLORS.yellow;
  const statusIcon = (s) => s === "present" ? "✓" : s === "absent" ? "✗" : "?";
  const statusBadge = (s) => s === "present" ? "success" : s === "absent" ? "danger" : "warning";
  const SEAT_ROWS = [
    ["A1", "A2", "A3"],
    ["B1", "B2", "B3"],
    ["C1", "C2", "C3"],
    ["D1", "D2", "D3"],
    ["E1", "E2"],
  ];
  const getSeatPassenger = (seat) => passengers.find(p => p.seat === seat);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ background: COLORS.navy, color: COLORS.white, padding: "0 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🚐</span>
            <span style={{ fontWeight: 800, fontSize: 17 }}>Navette Pro</span>
            <span style={{ background: "#FFFFFF22", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>EXPLOITANT</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="KT" color={COLORS.orangeMid} size={32} />
            <span style={{ fontSize: 13, color: "#CBD5E1" }}>Koné Transport</span>
            <Btn size="sm" variant="secondary" onClick={onLogout} style={{ background: "#FFFFFF22", color: COLORS.white, border: "none" }}>✕</Btn>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {ROUTES.map(r => (
            <div key={r.id} onClick={() => setSelectedRoute(r)} style={{ padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s", background: selectedRoute.id === r.id ? COLORS.navy : COLORS.white, color: selectedRoute.id === r.id ? COLORS.white : COLORS.textPrimary, border: `1px solid ${selectedRoute.id === r.id ? COLORS.navy : COLORS.border}`, }} >
              {r.name}
            </div>
          ))}
        </div>
        <Card style={{ marginBottom: 20, background: COLORS.navy, border: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.white, marginBottom: 4 }}>{selectedRoute.name}</div>
              <div style={{ fontSize: 13, color: "#94A3B8" }}>{selectedRoute.vehicle}</div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.orange }}>{selectedRoute.booked}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Places occupées</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#94A3B8" }}>{selectedRoute.seats - selectedRoute.booked}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Libres</div>
              </div>
            </div>
          </div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard label="Présents" value={present} icon="✓" accent={COLORS.green} />
          <StatCard label="Absents" value={absent} icon="✗" accent={COLORS.red} />
          <StatCard label="Non renseignés" value={unknown} icon="?" accent={COLORS.yellow} />
          <StatCard label="Taux de présence" value={`${Math.round((present / (present + absent)) * 100)}%`} icon="📊" accent={COLORS.blue} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Btn size="sm" variant={viewMode === "list" ? "primary" : "secondary"} onClick={() => setViewMode("list")}>📋 Liste</Btn>
          <Btn size="sm" variant={viewMode === "seat" ? "primary" : "secondary"} onClick={() => setViewMode("seat")}>🪑 Plan de sièges</Btn>
        </div>
        {viewMode === "list" && (
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 60px 80px 100px", gap: 12, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <div></div><div>Passager</div><div>Siège</div><div>Forfait</div><div style={{ textAlign: "right" }}>Statut</div>
              </div>
              {passengers.map((p) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "36px 1fr 60px 80px 100px", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center" }}>
                  <Avatar initials={p.avatar} color={statusColor(p.status)} size={32} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{p.name}</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.orange, fontSize: 14 }}>{p.seat}</div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{p.plan}</div>
                  <div style={{ textAlign: "right" }}><Badge label={`${statusIcon(p.status)} ${p.status}`} type={statusBadge(p.status)} /></div>
                </div>
              ))}
            </div>
          </Card>
        )}
        {viewMode === "seat" && (
          <Card>
            <div style={{ marginBottom: 16, display: "flex", gap: 16, fontSize: 12, color: COLORS.textSecondary, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.green, display: "inline-block" }}></span> Présent</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.red, display: "inline-block" }}></span> Absent</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.yellow, display: "inline-block" }}></span> Non renseigné</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.bg, border: `1px solid ${COLORS.border}`, display: "inline-block" }}></span> Libre</span>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 12, padding: 20, textAlign: "center" }}>
              <div style={{ background: COLORS.navyLight, color: COLORS.white, borderRadius: 8, padding: "8px 20px", display: "inline-block", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>🚘 Conducteur</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
                {SEAT_ROWS.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    {row.map(seat => {
                      const p = getSeatPassenger(seat);
                      const color = p ? statusColor(p.status) : COLORS.bg;
                      const textColor = p ? COLORS.white : COLORS.slate;
                      return (
                        <div key={seat} title={p ? `${p.name} — ${p.status}` : "Libre"} style={{ width: 72, height: 72, borderRadius: 10, background: p ? color : COLORS.white, border: `2px solid ${p ? color : COLORS.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", position: "relative", }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: p ? COLORS.white : COLORS.slate }}>{p ? statusIcon(p.status) : "○"}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: p ? "#ffffff99" : COLORS.slate }}>{seat}</div>
                          {p && <div style={{ fontSize: 9, color: "#ffffff99", position: "absolute", bottom: 4, textAlign: "center", padding: "0 4px", lineHeight: 1.2 }}>{p.name.split(" ")[0]}</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "subscriptions", label: "Abonnements" },
    { id: "routes", label: "Lignes & véhicules" },
    { id: "commissions", label: "Mes commissions" },
  ];
  const monthlyData = [
    { month: "Janv", subs: 180, rev: 3200000 },
    { month: "Févr", subs: 197, rev: 3580000 },
    { month: "Mars", subs: 215, rev: 3900000 },
    { month: "Avr", subs: 247, rev: 4875000 },
  ];
  const maxRev = Math.max(...monthlyData.map(d => d.rev));

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ background: `linear-gradient(90deg, ${COLORS.navy} 0%, #1E3A5F 100%)`, padding: "0 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🚐</span>
            <span style={{ fontWeight: 800, color: COLORS.white, fontSize: 17 }}>Navette Pro</span>
            <span style={{ background: COLORS.orange, borderRadius: 6, padding: "2px 8px", fontSize: 11, color: COLORS.white, fontWeight: 700 }}>PROPRIÉTAIRE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="AD" color={COLORS.orange} size={32} />
            <span style={{ fontSize: 13, color: "#CBD5E1" }}>Admin · Abidjan</span>
            <Btn size="sm" variant="secondary" onClick={onLogout} style={{ background: "#FFFFFF22", color: COLORS.white, border: "none" }}>✕</Btn>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 2, paddingBottom: 0, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", color: activeTab === t.id ? COLORS.orange : "#94A3B8", borderBottom: activeTab === t.id ? `3px solid ${COLORS.orange}` : "3px solid transparent", transition: "all 0.15s", }} >{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {activeTab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: 24 }}>
              <StatCard label="Revenus totaux (avril)" value={fmtCFA(ADMIN_STATS.totalRevenue).replace(" FCFA", "")} icon="💰" accent={COLORS.green} />
              <StatCard label="Mes commissions" value={fmtCFA(ADMIN_STATS.commissions).replace(" FCFA", "")} icon="💎" accent={COLORS.orange} />
              <StatCard label="Abonnements actifs" value={ADMIN_STATS.activeSubscriptions} icon="👥" accent={COLORS.blue} />
              <StatCard label="Lignes actives" value={ADMIN_STATS.activeRoutes} icon="🗺️" accent={COLORS.purple} />
              <StatCard label="Croissance mensuelle" value={`+${ADMIN_STATS.monthlyGrowth}%`} icon="📈" accent={COLORS.green} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              <Card>
                <div style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: 16, fontSize: 15 }}>Revenus mensuels</div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 140 }}>
                  {monthlyData.map(d => (
                    <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 10, color: COLORS.textSecondary, fontWeight: 600 }}>{(d.rev / 1000).toFixed(0)}k</div>
                      <div style={{ width: "100%", background: d.month === "Avr" ? COLORS.orange : COLORS.orangeLight, borderRadius: "6px 6px 0 0", height: `${(d.rev / maxRev) * 100}px`, transition: "all 0.3s" }} />
                      <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{d.month}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <div style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: 16, fontSize: 15 }}>Répartition des abonnements</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[ { label: "Mensuels", count: 183, pct: 74, color: COLORS.orange }, { label: "Hebdomadaires", count: 64, pct: 26, color: COLORS.blue }, ].map(item => (
                    <div key={item.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{item.count} · {item.pct}%</span>
                      </div>
                      <div style={{ height: 8, background: COLORS.bg, borderRadius: 4 }}>
                        <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 }}>Modes de paiement populaires</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge label="Orange Money 45%" type="orange" />
                    <Badge label="Wave 28%" type="info" />
                    <Badge label="MTN MoMo 18%" type="warning" />
                    <Badge label="Moov 9%" type="default" />
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
        {activeTab === "subscriptions" && (
          <Card>
            <div style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: 16, fontSize: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}> Tous les abonnements <Badge label={`${ADMIN_STATS.activeSubscriptions} actifs`} type="success" /> </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                    { ["Réf.", "Client", "Ligne", "Forfait", "Montant", "Commission", "Statut", "Paiement"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: COLORS.textSecondary, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUBSCRIPTIONS_HISTORY.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : COLORS.bg }}>
                      <td style={{ padding: "10px", fontFamily: "monospace", fontSize: 11, color: COLORS.textSecondary }}>{s.id}</td>
                      <td style={{ padding: "10px", fontWeight: 600, color: COLORS.textPrimary }}>{s.client}</td>
                      <td style={{ padding: "10px", color: COLORS.textSecondary }}>{s.route}</td>
                      <td style={{ padding: "10px" }}><Badge label={s.plan} type={s.plan === "Mensuel" ? "orange" : "info"} /></td>
                      <td style={{ padding: "10px", fontWeight: 700, color: COLORS.textPrimary }}>{fmtCFA(s.amount)}</td>
                      <td style={{ padding: "10px", fontWeight: 700, color: COLORS.green }}>+{fmtCFA(s.commission)}</td>
                      <td style={{ padding: "10px" }}><Badge label={s.status} type={s.status === "actif" ? "success" : "danger"} /></td>
                      <td style={{ padding: "10px", color: COLORS.textSecondary, fontSize: 12 }}>{s.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        {activeTab === "routes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ROUTES.map(r => (
              <Card key={r.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.textPrimary, marginBottom: 4 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 }}>{r.vehicle}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Badge label={`Départ : ${r.depart}`} type="info" />
                      <Badge label={`Retour : ${r.retour}`} type="default" />
                      <Badge label={r.operator} type="orange" />
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary }}>{r.booked}<span style={{ fontSize: 14, color: COLORS.textSecondary }}>/{r.seats}</span></div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 }}>places occupées</div>
                    <div style={{ width: 120, height: 8, background: COLORS.bg, borderRadius: 4, margin: "0 0 0 auto" }}>
                      <div style={{ height: "100%", width: `${(r.booked / r.seats) * 100}%`, background: r.booked / r.seats > 0.8 ? COLORS.orange : COLORS.green, borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Btn variant="ghost" style={{ alignSelf: "flex-start" }}>+ Ajouter une ligne</Btn>
          </div>
        )}
        {activeTab === "commissions" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
              <StatCard label="Commission du mois (10%)" value="487 500 FCFA" icon="💎" accent={COLORS.orange} />
              <StatCard label="Commission totale (2026)" value="1 524 300 FCFA" icon="🏆" accent={COLORS.green} />
              <StatCard label="En attente de virement" value="3 opérateurs" icon="⏳" accent={COLORS.yellow} />
            </div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary, marginBottom: 16 }}>Détail des commissions par ligne</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {ROUTES.map((r, i) => {
                  const lineRevenue = r.booked * (SUBSCRIPTIONS_HISTORY.find(s => s.route === r.name)?.amount || 22000);
                  const lineCommission = lineRevenue * 0.1;
                  return (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < ROUTES.length - 1 ? `1px solid ${COLORS.border}` : "none", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: COLORS.textPrimary, fontSize: 14 }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{r.operator} · {r.booked} abonnés</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.green }}>+{fmtCFA(lineCommission)}</div>
                        <div style={{ fontSize: 11, color: COLORS.textSecondary }}>sur {fmtCFA(lineRevenue)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card style={{ background: COLORS.orangeLight, border: `1px solid ${COLORS.orange}44` }}>
              <div style={{ fontWeight: 700, color: "#9A3412", marginBottom: 8 }}>💡 Règle de commission</div>
              <div style={{ fontSize: 13, color: "#C2410C", lineHeight: 1.7 }}> Navette Pro prélève automatiquement <strong>10%</strong> sur chaque abonnement souscrit via la plateforme. Les 90% restants sont reversés aux exploitants dans un délai de 48h ouvrables après paiement confirmé. </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState(null);
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  if (!role) return <Landing onLogin={setRole} />;
  if (role === "client") return <ClientDashboard onLogout={() => setRole(null)} />;
  if (role === "operator") return <OperatorDashboard onLogout={() => setRole(null)} />;
  if (role === "admin") return <AdminDashboard onLogout={() => setRole(null)} />;

  return null;
}