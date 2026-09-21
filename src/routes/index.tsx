import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, ArrowRight, Box, Check, ChevronDown, ChevronRight, CircleDollarSign,
  Clock3, Code2, Database, FileCode2, Folder, Gauge, GitBranch, Globe2, KeyRound,
  Layers3, LockKeyhole, Menu, Network, Play, Server, ShieldCheck, Sparkles, Terminal,
  Users, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IP Vault — Soberanía tecnológica" },
      { name: "description", content: "Calcula tu dependencia SaaS, simula una arquitectura propia y libera el código fuente de tu empresa." },
      { property: "og:title", content: "IP Vault — Recupera la propiedad de tu código" },
      { property: "og:description", content: "Protocolo de liberación de código y soberanía tecnológica para empresas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IpVault,
});

const tools = [
  { name: "Salesforce", cost: 165, mark: "SF" }, { name: "HubSpot", cost: 92, mark: "HS" },
  { name: "Zendesk", cost: 75, mark: "ZD" }, { name: "SAP", cost: 210, mark: "SAP" },
  { name: "Jira", cost: 18, mark: "JI" }, { name: "ERP Propietario", cost: 130, mark: "ERP" },
  { name: "Custom SaaS", cost: 110, mark: "CS" },
];

const logs = [
  "Extrayendo assets de marca del dominio...",
  "Eliminando dependencias de código propietario de terceros...",
  "Generando arquitectura limpia (React, Node.js, PostgreSQL, Docker)...",
  "Desplegando sandbox seguro en infraestructura aislada...",
];

const tabs = ["Panel Operativo", "Gestión de Usuarios", "Módulo de Métricas", "Conectores de API"];

function IpVault() {
  const [domain, setDomain] = useState("");
  const [selected, setSelected] = useState(["Salesforce", "Jira", "HubSpot"]);
  const [users, setUsers] = useState(125);
  const [years, setYears] = useState(4);
  const [simulating, setSimulating] = useState(false);
  const [logCount, setLogCount] = useState(4);
  const [activeTab, setActiveTab] = useState(0);
  const [seconds, setSeconds] = useState(71 * 3600 + 59 * 60 + 59);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const monthly = tools.filter((t) => selected.includes(t.name)).reduce((sum, t) => sum + t.cost, 0) * users;
  const fiveYear = monthly * 60;
  const sovereignty = Math.max(8, Math.round(88 - selected.length * 8 - years * 2 - Math.min(users / 35, 18)));
  const migration = Math.round(fiveYear * 0.34);
  const company = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split(".")[0] || "Acme";

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!simulating || logCount >= logs.length) return;
    const timer = window.setTimeout(() => setLogCount((value) => value + 1), 720);
    return () => window.clearTimeout(timer);
  }, [simulating, logCount]);

  const time = useMemo(() => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [seconds]);

  function startAudit() {
    document.querySelector("#auditoria")?.scrollIntoView({ behavior: "smooth" });
  }

  function runSimulation() {
    setSimulating(true);
    setLogCount(0);
    window.setTimeout(() => document.querySelector("#simulador")?.scrollIntoView({ behavior: "smooth" }), 80);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} startAudit={startAudit} />

      <section className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-5xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary">
            <ShieldCheck className="size-3.5" /> PROTOCOLO DE SOBERANÍA TECNOLÓGICA
          </div>
          <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.08] tracking-normal sm:text-6xl lg:text-7xl">
            Reclama la propiedad de tu código. <span className="text-primary">Elimina el alquiler SaaS.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Analiza el costo de dependencia de tu empresa, simula la creación de tu sistema propio y libera tu repositorio Git.
          </p>
          <div className="mt-10 flex max-w-3xl flex-col gap-3 rounded-lg border border-border bg-card/70 p-2 backdrop-blur-xl sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Globe2 className="size-5 shrink-0 text-cyan" />
              <span className="sr-only">Dominio de tu empresa</span>
              <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && startAudit()} placeholder="Dominio de tu empresa (ej. acme.com)" className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <Button size="lg" onClick={startAudit}>Iniciar Auditoría <ArrowRight className="size-4" /></Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2"><Check className="size-3 text-primary" /> Sin acceso a datos internos</span>
            <span className="flex items-center gap-2"><Check className="size-3 text-primary" /> Sandbox aislado</span>
            <span className="flex items-center gap-2"><Check className="size-3 text-primary" /> Auditoría reversible</span>
          </div>
        </div>
      </section>

      <section id="auditoria" className="border-y border-border bg-card/20 py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle number="01" eyebrow="AUDITORÍA DE DEPENDENCIAS" title="Tu costo real de no poseer el código" text="Modela la exposición financiera acumulada y descubre cuánto capital permanece atrapado en licencias." />
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
            <div className="glass-panel rounded-lg p-5 sm:p-7">
              <div className="flex items-center justify-between"><h3 className="font-semibold">Stack SaaS actual</h3><span className="font-mono text-xs text-muted-foreground">{selected.length} seleccionadas</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tools.map((tool) => {
                  const active = selected.includes(tool.name);
                  return <button key={tool.name} aria-pressed={active} onClick={() => setSelected(active ? selected.filter((x) => x !== tool.name) : [...selected, tool.name])} className={cn("flex min-h-20 items-center gap-3 rounded-md border p-3 text-left transition-all", active ? "border-primary/60 bg-primary/10 text-foreground shadow-[var(--shadow-primary)]" : "border-border bg-background/30 text-muted-foreground hover:border-cyan/40")}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary font-mono text-[10px] text-cyan">{tool.mark}</span>
                    <span className="text-xs font-semibold leading-4">{tool.name}</span>
                    {active && <Check className="ml-auto size-3.5 text-primary" />}
                  </button>;
                })}
              </div>
              <RangeControl label="Número de usuarios activos" value={users} min={1} max={1000} onChange={setUsers} suffix="usuarios" />
              <RangeControl label="Años operando con estas herramientas" value={years} min={1} max={10} onChange={setYears} suffix="años" />
            </div>
            <div className="glass-panel relative overflow-hidden rounded-lg p-5 sm:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
              <p className="font-mono text-xs text-primary">TCO // PROYECCIÓN 60 MESES</p>
              <div className="mt-5 border-b border-border pb-6"><p className="text-sm text-muted-foreground">Gasto estimado acumulado</p><p className="mt-2 text-4xl font-bold tabular-nums sm:text-5xl">${fiveYear.toLocaleString("en-US")}</p><p className="mt-2 font-mono text-xs text-muted-foreground">USD · basado en {users} usuarios activos</p></div>
              <Metric icon={Gauge} label="Índice de Soberanía IP" value={`${sovereignty}%`} tone={sovereignty < 50 ? "danger" : "primary"} />
              <Metric icon={CircleDollarSign} label="Migración a arquitectura propia" value={`$${migration.toLocaleString("en-US")}`} tone="cyan" />
              <div className="mt-2 flex items-center justify-between rounded-md bg-primary/10 px-4 py-3 text-sm"><span className="text-muted-foreground">Ahorro proyectado</span><strong className="text-primary">66% a largo plazo</strong></div>
              <Button className="mt-6 w-full" size="lg" onClick={runSimulation}><Code2 className="size-4" /> Generar Prototipo Propietario</Button>
            </div>
          </div>
        </div>
      </section>

      <section id="simulador" className="py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle number="02" eyebrow="HACKATHON DE CÓDIGO EN VIVO" title="De la dependencia a un sistema propio" text="Observa cómo una arquitectura soberana reemplaza las capas propietarias de tu stack actual." />
          <div className="mt-12 overflow-hidden rounded-lg border border-border bg-card/70 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="flex gap-1.5"><i className="size-2.5 rounded-full bg-danger-soft"/><i className="size-2.5 rounded-full bg-cyan"/><i className="size-2.5 rounded-full bg-primary"/></div><span className="font-mono text-[11px] text-muted-foreground">ip-vault://{company.toLowerCase()}-sandbox</span><Terminal className="size-4 text-primary" /></div>
            <div className="relative min-h-64 overflow-hidden bg-background/80 p-5 font-mono text-xs sm:p-7 sm:text-sm">
              <div className="scan-line pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-transparent via-cyan/5 to-transparent" />
              {!simulating && <div className="flex min-h-48 flex-col items-center justify-center text-center"><Play className="mb-4 size-8 text-primary"/><p className="text-muted-foreground">El sandbox está listo para generar tu prototipo.</p><Button className="mt-5" variant="outline" onClick={runSimulation}>Ejecutar simulación</Button></div>}
              {simulating && <div className="space-y-4">{logs.slice(0, logCount).map((log, i) => <div key={log} className="flex gap-3"><span className="text-muted-foreground">[{["0.1s","0.8s","1.5s","2.2s"][i]}]</span><span className="text-primary">✓</span><span>{log}</span></div>)}{logCount < logs.length && <div className="flex items-center gap-3 text-cyan"><span className="inline-block h-4 w-1.5 animate-pulse bg-cyan"/> procesando...</div>}</div>}
            </div>
          </div>
          {simulating && logCount === logs.length && <Dashboard company={company} activeTab={activeTab} setActiveTab={setActiveTab} />}
        </div>
      </section>

      <section id="boveda" className="border-y border-border bg-card/20 py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle number="03" eyebrow="THE IP VAULT" title="Tu código. Tu infraestructura. Tus reglas." text="Una bóveda temporal y aislada contiene la base tecnológica generada para tu empresa." />
          <div className="glass-panel relative mt-12 overflow-hidden rounded-lg border-primary/50 shadow-[var(--shadow-primary)]">
            <div className="flex flex-col justify-between gap-5 border-b border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:p-7">
              <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-md border border-primary/40 bg-primary/10"><LockKeyhole className="size-5 text-primary" /></span><div><p className="font-mono text-[10px] text-primary">REPOSITORIO CIFRADO</p><h3 className="font-bold">{company.toLowerCase()}-core-platform</h3></div></div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-danger-soft/40 bg-danger-soft/10 px-3 py-1.5 font-mono text-[10px] text-danger-soft"><span className="pulse-dot size-1.5 rounded-full bg-danger-soft"/> ESTADO: BÓVEDA RESERVADA Y BLOQUEADA</div>
            </div>
            <div className="grid lg:grid-cols-[.85fr_1.15fr]">
              <div className="border-b border-border p-6 text-center lg:border-b-0 lg:border-r sm:p-10">
                <p className="font-mono text-xs text-muted-foreground">VENTANA DE RESERVA</p>
                <div className="my-5 font-mono text-4xl font-medium tabular-nums text-primary sm:text-6xl">{time}</div>
                <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">Tu arquitectura soberana está reservada. Al expirar el tiempo, el sandbox se autodestruirá para garantizar la privacidad de tus datos.</p>
                <Button className="mt-8 w-full max-w-md" size="lg" onClick={() => setBookingOpen(true)}><KeyRound className="size-4"/> Desbloquear Código y Agendar Sesión</Button>
              </div>
              <CodeTree />
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><Logo /><p>© 2026 IP Vault · Código soberano, por diseño.</p><div className="flex gap-5"><span>Privacidad</span><span>Protocolo</span><span>Seguridad</span></div></footer>
      {bookingOpen && <div className="fixed inset-0 z-[60] grid place-items-center bg-background/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="booking-title"><div className="glass-panel relative w-full max-w-lg rounded-lg border-primary/50 p-7 shadow-[var(--shadow-primary)]"><Button variant="ghost" size="icon" className="absolute right-4 top-4" aria-label="Cerrar" onClick={() => setBookingOpen(false)}><X className="size-4"/></Button><span className="grid size-12 place-items-center rounded-md border border-primary/40 bg-primary/10"><ShieldCheck className="size-6 text-primary"/></span><p className="mt-6 font-mono text-xs text-primary">SOLICITUD VERIFICADA</p><h2 id="booking-title" className="mt-2 text-2xl font-bold">Tu bóveda está lista para revisión</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">La sesión de arquitectura para <span className="font-semibold capitalize text-foreground">{company}</span> incluirá el mapa de migración y el acceso supervisado al repositorio.</p><div className="mt-6 rounded-md border border-border bg-background/40 p-4 font-mono text-xs text-muted-foreground"><div className="flex justify-between"><span>Estado</span><span className="text-primary">RESERVADO</span></div><div className="mt-3 flex justify-between"><span>Duración estimada</span><span className="text-foreground">45 min</span></div></div><Button className="mt-6 w-full" onClick={() => setBookingOpen(false)}>Confirmar solicitud <ArrowRight className="size-4"/></Button></div></div>}
    </main>
  );
}

function Header({ mobileOpen, setMobileOpen, startAudit }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void; startAudit: () => void }) {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"><div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"><Logo/><nav className="hidden items-center gap-7 lg:flex"><a href="#auditoria" className="text-xs text-muted-foreground hover:text-foreground">Calculadora de Riesgo</a><a href="#simulador" className="text-xs text-muted-foreground hover:text-foreground">Simulador</a><a href="#boveda" className="text-xs text-muted-foreground hover:text-foreground">Soberanía IP</a></nav><div className="hidden items-center gap-4 sm:flex"><span className="flex items-center gap-2 font-mono text-[10px] text-primary"><i className="pulse-dot size-1.5 rounded-full bg-primary"/> Agentes de Análisis Activos</span><Button size="sm" onClick={startAudit}>Ver Demo</Button></div><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</Button></div>{mobileOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden"><div className="flex flex-col gap-4 text-sm"><a href="#auditoria" onClick={() => setMobileOpen(false)}>Calculadora de Riesgo</a><a href="#simulador" onClick={() => setMobileOpen(false)}>Simulador</a><a href="#boveda" onClick={() => setMobileOpen(false)}>Soberanía IP</a></div></nav>}</header>;
}

function Logo() { return <div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-md border border-primary/40 bg-primary/10 shadow-[var(--shadow-primary)]"><ShieldCheck className="size-5 text-primary"/></span><span className="text-base font-extrabold">IP <span className="text-primary">VAULT</span></span></div>; }

function StepTitle({ number, eyebrow, title, text }: { number: string; eyebrow: string; title: string; text: string }) { return <div className="grid gap-5 md:grid-cols-[110px_1fr] md:items-start"><span className="font-mono text-5xl font-medium text-border">/{number}</span><div><p className="font-mono text-xs text-cyan">{eyebrow}</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{text}</p></div></div>; }

function RangeControl({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (v: number) => void }) { return <div className="mt-7"><div className="mb-3 flex items-center justify-between gap-4"><label className="text-sm text-muted-foreground">{label}</label><output className="font-mono text-sm text-primary">{value.toLocaleString()} {suffix}</output></div><input className="h-1.5 w-full cursor-pointer accent-primary" type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}/><div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground"><span>{min}</span><span>{max.toLocaleString()}</span></div></div>; }

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Gauge; label: string; value: string; tone: "danger" | "primary" | "cyan" }) { return <div className="flex items-center justify-between border-b border-border py-5"><div className="flex items-center gap-3"><Icon className={cn("size-5", tone === "danger" ? "text-danger-soft" : tone === "cyan" ? "text-cyan" : "text-primary")}/><span className="text-sm text-muted-foreground">{label}</span></div><strong className={cn("font-mono text-xl", tone === "danger" ? "text-danger-soft" : tone === "cyan" ? "text-cyan" : "text-primary")}>{value}</strong></div>; }

function Dashboard({ company, activeTab, setActiveTab }: { company: string; activeTab: number; setActiveTab: (v: number) => void }) {
  const chart = [38, 55, 47, 72, 64, 84, 76, 93];
  return <div className="mt-6 overflow-hidden rounded-lg border border-primary/30 bg-card/80"><div className="flex items-center justify-between border-b border-border p-4"><div className="flex items-center gap-3"><Box className="size-5 text-primary"/><strong className="capitalize">{company} OS</strong><span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[9px] text-primary">SANDBOX LIVE</span></div><Activity className="size-4 text-cyan"/></div><div className="flex overflow-x-auto border-b border-border">{tabs.map((tab, i) => <button key={tab} onClick={() => setActiveTab(i)} className={cn("shrink-0 border-b-2 px-5 py-4 text-xs transition-colors", activeTab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{tab}</button>)}</div><div className="grid gap-4 p-5 lg:grid-cols-3"><div className="rounded-md border border-border bg-background/40 p-5"><p className="text-xs text-muted-foreground">{tabs[activeTab]}</p><p className="mt-2 text-3xl font-bold">{["98.4%", "1,284", "+24.8%", "12"][activeTab]}</p><p className="mt-2 font-mono text-[10px] text-primary">↑ OPERACIÓN ESTABLE</p></div><div className="rounded-md border border-border bg-background/40 p-5 lg:col-span-2"><div className="mb-8 flex justify-between"><p className="text-xs text-muted-foreground">Actividad del sistema</p><span className="font-mono text-[10px] text-cyan">TIEMPO REAL</span></div><div className="flex h-24 items-end gap-3">{chart.map((height, i) => <div key={i} className="flex-1 rounded-t-sm bg-primary/30 transition-all hover:bg-primary" style={{ height: `${height}%` }}/>)}</div></div></div></div>;
}

function CodeTree() {
  const [open, setOpen] = useState(["src", "config"]);
  const folders = [{ name: "src", children: ["app.tsx", "modules", "services"] }, { name: "config", children: ["security.ts", "env.schema.ts"] }, { name: "docker", children: ["Dockerfile"] }, { name: "database", children: ["schema.sql", "migrations"] }, { name: "tests", children: ["integration.spec.ts"] }];
  return <div className="p-6 sm:p-8"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><GitBranch className="size-4 text-cyan"/><span className="font-mono text-xs">main</span></div><span className="font-mono text-[10px] text-muted-foreground">SHA 7f2a9c1</span></div><div className="rounded-md border border-border bg-background/50 p-3 font-mono text-xs">{folders.map((folder) => { const isOpen = open.includes(folder.name); return <div key={folder.name}><button className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => setOpen(isOpen ? open.filter((x) => x !== folder.name) : [...open, folder.name])}>{isOpen ? <ChevronDown className="size-3"/> : <ChevronRight className="size-3"/>}<Folder className="size-4 text-cyan"/>/{folder.name}</button>{isOpen && <div className="ml-7 border-l border-border pl-3">{folder.children.map((file) => <div className="flex items-center gap-2 py-2 text-muted-foreground" key={file}><FileCode2 className="size-3.5 text-primary"/>{file}</div>)}</div>}</div>; })}</div><div className="mt-5 grid grid-cols-3 gap-3 text-center"><MiniStat icon={Layers3} value="247" label="archivos"/><MiniStat icon={Database} value="38" label="tablas"/><MiniStat icon={Server} value="12" label="servicios"/></div></div>;
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof Layers3; value: string; label: string }) { return <div className="rounded-md border border-border bg-background/30 p-3"><Icon className="mx-auto size-4 text-cyan"/><strong className="mt-2 block font-mono text-sm">{value}</strong><span className="text-[10px] text-muted-foreground">{label}</span></div>; }