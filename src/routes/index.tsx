import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { createFileRoute } from "@tanstack/react-router";
import JSZip from "jszip";
import {
  Activity,
  ArrowRight,
  Box,
  CalendarCheck2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Database,
  Download,
  Eye,
  ExternalLink,
  FileCode2,
  Folder,
  Gauge,
  GitBranch,
  Globe2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Menu,
  Moon,
  Play,
  Server,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { IpTransferContract } from "@/components/ip-vault/ip-transfer-contract";
import { SchedulingModal } from "@/components/ip-vault/scheduling-modal";
import { useIpVaultState } from "@/hooks/use-ip-vault-state";
import {
  projectSlug,
  prospectSchema,
  SAAS_TOOLS,
  type Appointment,
  type Prospect,
} from "@/lib/ip-vault";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  company: fallback(z.string(), "").default(""),
  domain: fallback(z.string(), "").default(""),
  saas: fallback(z.string(), "").default(""),
  users: fallback(z.number().int(), 0).default(0),
  email: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "IP Vault — Soberanía tecnológica" },
      {
        name: "description",
        content:
          "Calcula tu dependencia SaaS, simula una arquitectura propia y libera el código fuente de tu empresa.",
      },
      { property: "og:title", content: "IP Vault — Recupera la propiedad de tu código" },
      {
        property: "og:description",
        content: "Protocolo de liberación de código y soberanía tecnológica para empresas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IpVault,
});

const logs = [
  "Extrayendo assets de marca del dominio...",
  "Eliminando dependencias de código propietario de terceros...",
  "Generando arquitectura limpia (React, Node.js, PostgreSQL, Docker)...",
  "Desplegando sandbox seguro en infraestructura aislada...",
];
const tabs = ["Panel Operativo", "Gestión de Usuarios", "Módulo de Métricas", "Conectores de API"];

function IpVault() {
  const search = Route.useSearch();
  const { state, dispatch, outbound, company, tco, countdown, vaultExpired } =
    useIpVaultState(search);
  const [simulating, setSimulating] = useState(false);
  const [logCount, setLogCount] = useState(4);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);

  useEffect(() => {
    if (!simulating || logCount >= logs.length) return;
    const timer = window.setTimeout(() => setLogCount((v) => v + 1), 720);
    return () => window.clearTimeout(timer);
  }, [simulating, logCount]);

  function startAudit() {
    document.querySelector("#auditoria")?.scrollIntoView({ behavior: "smooth" });
  }
  function runSimulation() {
    setSimulating(true);
    setLogCount(0);
    window.setTimeout(
      () => document.querySelector("#simulador")?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  }
  function requestVault() {
    if (state.unlocked && !vaultExpired)
      document.querySelector("#boveda")?.scrollIntoView({ behavior: "smooth" });
    else setCaptureOpen(true);
  }
  function capture(event: FormEvent) {
    event.preventDefault();
    const result = prospectSchema.safeParse(state.prospect);
    if (!result.success) return;
    dispatch({ type: "unlock", prospect: result.data, now: Date.now() });
    setCaptureOpen(false);
    window.setTimeout(
      () => document.querySelector("#boveda")?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  }
  function confirmAppointment(appointment: Appointment) {
    dispatch({ type: "schedule", appointment, now: Date.now() });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} startAudit={startAudit} />
      <section className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-5xl">
          {outbound && (
            <div className="mb-6 flex max-w-3xl items-start gap-3 rounded-md border border-cyan/30 bg-cyan/5 p-4 text-sm leading-6 text-cyan">
              <CompanyMark company={company} />
              <p>
                <strong>Bienvenido equipo de {company}.</strong> Hemos preparado el análisis de
                soberanía de código para su infraestructura.
              </p>
            </div>
          )}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary">
            <ShieldCheck className="size-3.5" /> PROTOCOLO DE SOBERANÍA TECNOLÓGICA
          </div>
          <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.08] sm:text-6xl lg:text-7xl">
            Reclama la propiedad de tu código.{" "}
            <span className="text-primary">Elimina el alquiler SaaS.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Analiza el costo de dependencia de tu empresa, simula la creación de tu sistema propio y
            libera tu repositorio Git.
          </p>
          <div className="mt-10 flex max-w-3xl flex-col gap-3 rounded-lg border border-border bg-card/70 p-2 backdrop-blur-xl sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Globe2 className="size-5 shrink-0 text-cyan" />
              <span className="sr-only">Dominio de tu empresa</span>
              <input
                value={state.domain}
                onChange={(e) => dispatch({ type: "set-domain", domain: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && startAudit()}
                placeholder="Dominio de tu empresa (ej. acme.com)"
                className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <Button size="lg" onClick={startAudit}>
              Iniciar Auditoría <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <section id="auditoria" className="border-y border-border bg-card/20 py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle
            number="01"
            eyebrow="AUDITORÍA DE DEPENDENCIAS"
            title="Tu costo real de no poseer el código"
            text="Modela la exposición financiera acumulada y descubre cuánto capital permanece atrapado en licencias."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
            <div className="glass-panel rounded-lg p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Stack SaaS actual</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {state.selected.length} seleccionadas
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SAAS_TOOLS.map((tool) => {
                  const active = state.selected.includes(tool.name);
                  return (
                    <Button
                      key={tool.name}
                      variant="outline"
                      aria-pressed={active}
                      onClick={() => dispatch({ type: "toggle-tool", tool: tool.name })}
                      className={cn(
                        "h-20 justify-start px-3 text-left",
                        active && "border-primary/60 bg-primary/10 shadow-[var(--shadow-primary)]",
                      )}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary font-mono text-[10px] text-cyan">
                        {tool.mark}
                      </span>
                      <span className="text-xs">{tool.name}</span>
                      {active && <Check className="ml-auto size-3.5 text-primary" />}
                    </Button>
                  );
                })}
              </div>
              <RangeControl
                label="Número de usuarios activos"
                value={state.users}
                min={1}
                max={1000}
                onChange={(users) => dispatch({ type: "set-users", users })}
                suffix="usuarios"
              />
              <RangeControl
                label="Años operando con estas herramientas"
                value={state.years}
                min={1}
                max={10}
                onChange={(years) => dispatch({ type: "set-years", years })}
                suffix="años"
              />
            </div>
            <div className="glass-panel relative overflow-hidden rounded-lg p-5 sm:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
              <p className="font-mono text-xs text-primary">TCO // MODELO DINÁMICO</p>
              <div className="mt-5 border-b border-border pb-5">
                <p className="text-sm text-muted-foreground">
                  Licencias acumuladas en {state.years} años
                </p>
                <p className="mt-2 text-4xl font-bold tabular-nums">
                  ${tco.licenseToDate.toLocaleString("en-US")}
                </p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {state.users} usuarios × ${tco.monthlySaasPerUser.toLocaleString()} / mes × 12 ×{" "}
                  {state.years}
                </p>
              </div>
              <Metric
                icon={Gauge}
                label="Índice de Soberanía IP"
                value={`${tco.sovereignty}%`}
                tone={tco.sovereignty < 50 ? "danger" : "primary"}
              />
              <Metric
                icon={CircleDollarSign}
                label="Desarrollo propio inicial"
                value={`$${tco.development.toLocaleString("en-US")}`}
                tone="cyan"
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-primary/10 px-4 py-3 text-sm">
                  <span className="block text-xs text-muted-foreground">Ahorro a 5 años</span>
                  <strong className={tco.savingsPercent >= 0 ? "text-primary" : "text-danger-soft"}>
                    {tco.savingsPercent}%
                  </strong>
                </div>
                <div className="rounded-md bg-cyan/10 px-4 py-3 text-sm">
                  <span className="block text-xs text-muted-foreground">Punto de equilibrio</span>
                  <strong className="text-cyan">{tco.breakEvenPoint ?? "> 5 años"}</strong>
                </div>
              </div>
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={runSimulation}
                disabled={!state.selected.length}
              >
                <Code2 className="size-4" />
                Generar Prototipo Propietario
              </Button>
            </div>
          </div>
          <TcoChart data={tco.chartData} />
        </div>
      </section>

      <section id="simulador" className="py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle
            number="02"
            eyebrow="HACKATHON DE CÓDIGO EN VIVO"
            title="De la dependencia a un sistema propio"
            text="Observa cómo una arquitectura soberana reemplaza las capas propietarias de tu stack actual."
          />
          <TerminalPanel
            company={company}
            simulating={simulating}
            logCount={logCount}
            runSimulation={runSimulation}
          />
          {simulating && logCount === logs.length && (
            <Dashboard
              company={company}
              users={state.users}
              selected={state.selected}
              activeTab={state.activeTab}
              setActiveTab={(tab) => dispatch({ type: "set-tab", tab })}
              theme={state.prototypeTheme}
              setTheme={(theme) => dispatch({ type: "set-theme", theme })}
              view={state.prototypeView}
              setView={(view) => dispatch({ type: "set-view", view })}
            />
          )}
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg" onClick={requestVault}>
              <LockKeyhole className="size-4" />
              Acceder a The IP Vault
            </Button>
          </div>
        </div>
      </section>

      <section id="boveda" className="border-y border-border bg-card/20 py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle
            number="03"
            eyebrow="THE IP VAULT"
            title="Tu código. Tu infraestructura. Tus reglas."
            text="Una bóveda temporal y aislada contiene la base tecnológica generada para tu empresa."
          />
          {state.unlocked && !vaultExpired ? (
            <Vault
              company={company}
              time={countdown}
              appointment={state.appointment}
              repositoryUnlocked={state.repositoryUnlocked}
              onSchedule={() => setSchedulingOpen(true)}
            />
          ) : (
            <div className="glass-panel mt-12 grid min-h-80 place-items-center rounded-lg border-primary/30 p-8 text-center">
              <div>
                <LockKeyhole className="mx-auto size-10 text-primary" />
                <h3 className="mt-5 text-2xl font-bold">
                  {vaultExpired ? "La reserva ha vencido" : "Bóveda protegida"}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  Completa la verificación profesional para revelar la estructura reservada de{" "}
                  {company}.
                </p>
                <Button className="mt-6" onClick={() => setCaptureOpen(true)}>
                  <UserRound className="size-4" />
                  {vaultExpired ? "Renovar acceso" : "Verificar y acceder"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <IpTransferContract company={company} domain={state.domain} />
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Logo />
        <p>© 2026 IP Vault · Código soberano, por diseño.</p>
        <div className="flex gap-5">
          <span>Privacidad</span>
          <span>Protocolo</span>
          <span>Seguridad</span>
        </div>
      </footer>
      {captureOpen && (
        <CaptureModal
          company={company}
          prospect={state.prospect}
          setProspect={(prospect) => dispatch({ type: "set-prospect", prospect })}
          onClose={() => setCaptureOpen(false)}
          onSubmit={capture}
        />
      )}
      <SchedulingModal
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
        company={company}
        prospect={state.prospect}
        onConfirm={confirmAppointment}
      />
    </main>
  );
}

function Header({
  mobileOpen,
  setMobileOpen,
  startAudit,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  startAudit: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          <a href="#auditoria" className="text-xs text-muted-foreground hover:text-foreground">
            Calculadora de Riesgo
          </a>
          <a href="#simulador" className="text-xs text-muted-foreground hover:text-foreground">
            Simulador
          </a>
          <a href="#boveda" className="text-xs text-muted-foreground hover:text-foreground">
            Soberanía IP
          </a>
          <a href="#garantia-ip" className="text-xs text-muted-foreground hover:text-foreground">
            Garantía IP
          </a>
        </nav>
        <div className="hidden items-center gap-4 sm:flex">
          <span className="flex items-center gap-2 font-mono text-[10px] text-primary">
            <i className="pulse-dot size-1.5 rounded-full bg-primary" />
            Agentes Activos
          </span>
          <Button size="sm" onClick={startAudit}>
            Ver Demo
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir menú"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {mobileOpen && (
        <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4 text-sm">
            <a href="#auditoria" onClick={() => setMobileOpen(false)}>
              Calculadora de Riesgo
            </a>
            <a href="#simulador" onClick={() => setMobileOpen(false)}>
              Simulador
            </a>
            <a href="#boveda" onClick={() => setMobileOpen(false)}>
              Soberanía IP
            </a>
            <a href="#garantia-ip" onClick={() => setMobileOpen(false)}>
              Garantía IP
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-md border border-primary/40 bg-primary/10 shadow-[var(--shadow-primary)]">
        <ShieldCheck className="size-5 text-primary" />
      </span>
      <span className="font-extrabold">
        IP <span className="text-primary">VAULT</span>
      </span>
    </div>
  );
}
function CompanyMark({ company }: { company: string }) {
  return (
    <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-cyan/30 bg-cyan/10 font-mono font-bold">
      <Sparkles className="absolute right-0.5 top-0.5 size-2.5 text-cyan/70" />
      {company
        .replace(/[^a-z0-9 ]/gi, "")
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </span>
  );
}
function StepTitle({
  number,
  eyebrow,
  title,
  text,
}: {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[110px_1fr]">
      <span className="font-mono text-5xl font-medium text-border">/{number}</span>
      <div>
        <p className="font-mono text-xs text-cyan">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {text}
        </p>
      </div>
    </div>
  );
}
function RangeControl({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-7">
      <div className="mb-3 flex items-center justify-between gap-4">
        <label className="text-sm text-muted-foreground">{label}</label>
        <output className="font-mono text-sm text-primary">
          {value.toLocaleString()} {suffix}
        </output>
      </div>
      <input
        className="h-1.5 w-full cursor-pointer accent-primary"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{min}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  tone: "danger" | "primary" | "cyan";
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-5">
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "size-5",
            tone === "danger" ? "text-danger-soft" : tone === "cyan" ? "text-cyan" : "text-primary",
          )}
        />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <strong
        className={cn(
          "font-mono text-xl",
          tone === "danger" ? "text-danger-soft" : tone === "cyan" ? "text-cyan" : "text-primary",
        )}
      >
        {value}
      </strong>
    </div>
  );
}

function TcoChart({ data }: { data: { year: string; saas: number; own: number }[] }) {
  return (
    <div className="glass-panel mt-6 rounded-lg p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <p className="font-mono text-xs text-cyan">CURVA DE INVERSIÓN · 5 AÑOS</p>
          <h3 className="mt-2 font-semibold">SaaS acumulado vs. código propietario</h3>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-danger-soft" />
            SaaS
          </span>
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-primary" />
            Código propio
          </span>
        </div>
      </div>
      <div className="mt-6 h-72 w-full" aria-label="Gráfica comparativa de costos">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={10} />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
              formatter={(v) => [`$${Number(v).toLocaleString("en-US")}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="saas"
              name="SaaS acumulado"
              stroke="var(--danger-soft)"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="own"
              name="Código propietario"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TerminalPanel({
  company,
  simulating,
  logCount,
  runSimulation,
}: {
  company: string;
  simulating: boolean;
  logCount: number;
  runSimulation: () => void;
}) {
  return (
    <div className="mt-12 overflow-hidden rounded-lg border border-border bg-card/70 shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-danger-soft" />
          <i className="size-2.5 rounded-full bg-cyan" />
          <i className="size-2.5 rounded-full bg-primary" />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          ip-vault://{company.toLowerCase()}-sandbox
        </span>
        <Terminal className="size-4 text-primary" />
      </div>
      <div className="relative min-h-64 overflow-hidden bg-background/80 p-5 font-mono text-xs sm:p-7 sm:text-sm">
        {!simulating ? (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <Play className="mb-4 size-8 text-primary" />
            <p className="text-muted-foreground">
              El sandbox está listo para generar tu prototipo.
            </p>
            <Button className="mt-5" variant="outline" onClick={runSimulation}>
              Ejecutar simulación
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.slice(0, logCount).map((log, i) => (
              <div key={log} className="flex gap-3">
                <span className="text-muted-foreground">
                  [{["0.1s", "0.8s", "1.5s", "2.2s"][i]}]
                </span>
                <span className="text-primary">✓</span>
                <span>{log}</span>
              </div>
            ))}
            {logCount < logs.length && <div className="text-cyan">▌ procesando...</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({
  company,
  users,
  selected,
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  view,
  setView,
}: {
  company: string;
  users: number;
  selected: string[];
  activeTab: number;
  setActiveTab: (v: number) => void;
  theme: "dark" | "light";
  setTheme: (v: "dark" | "light") => void;
  view: "preview" | "code";
  setView: (v: "preview" | "code") => void;
}) {
  async function downloadZip() {
    const slug = projectSlug(company);
    const zip = new JSZip();
    zip.file(
      "README.md",
      `# ${company} Core Platform\n\nArquitectura soberana de demostración generada por IP Vault.\n\n## Alcance del análisis\n- Usuarios: ${users}\n- Integraciones a reemplazar: ${selected.join(", ") || "Ninguna"}\n\n## Stack propuesto\n- React + TypeScript\n- Node.js\n- PostgreSQL\n- Docker\n\n## Inicio local\n1. Instala dependencias con npm install.\n2. Inicia el entorno con npm run dev.\n\n> Este paquete es una demostración técnica y requiere una sesión de arquitectura antes de utilizarse en producción.`,
    );
    zip.file(
      "architecture.json",
      JSON.stringify(
        {
          company,
          slug,
          users,
          integrations: selected,
          stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
    zip
      .folder("src")
      ?.file("App.tsx", `export function App() { return <main>${company} OS</main> }`);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}-architecture-demo.zip`;
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-primary/30 bg-card/80">
      <div className="flex flex-col justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Box className="size-5 text-primary" />
          <strong>{company} OS</strong>
          <span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[9px] text-primary">
            SANDBOX LIVE
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md border border-border p-1">
            <Button
              size="sm"
              variant={view === "preview" ? "secondary" : "ghost"}
              onClick={() => setView("preview")}
            >
              <Eye className="size-3.5" />
              Vista
            </Button>
            <Button
              size="sm"
              variant={view === "code" ? "secondary" : "ghost"}
              onClick={() => setView("code")}
            >
              <Code2 className="size-3.5" />
              Código
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {theme === "dark" ? "Claro" : "Oscuro"}
          </Button>
          <Button size="sm" onClick={downloadZip}>
            <Download className="size-4" />
            ZIP
          </Button>
        </div>
      </div>
      {view === "code" ? (
        <pre className="min-h-80 overflow-x-auto bg-background p-6 font-mono text-xs leading-6 text-cyan">
          <code>{`import { Dashboard } from "@${company.toLowerCase()}/core";\n\nexport function Operations() {\n  return (\n    <Dashboard tenant="${company}" secure>\n      <Metrics realtime />\n      <Users count={${users}} />\n      <ApiConnectors isolated />\n    </Dashboard>\n  );\n}`}</code>
        </pre>
      ) : (
        <div
          className={cn(
            "transition-colors",
            theme === "light"
              ? "bg-prototype-light text-prototype-light-foreground"
              : "bg-prototype-dark text-prototype-dark-foreground",
          )}
        >
          <div className="flex overflow-x-auto border-b border-current/10">
            {tabs.map((tab, i) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(i)}
                className={cn(
                  "shrink-0 rounded-none border-b-2",
                  activeTab === i ? "border-primary text-primary" : "border-transparent",
                )}
              >
                {tab}
              </Button>
            ))}
          </div>
          <div className="grid gap-4 p-5 lg:grid-cols-3">
            <div className="rounded-md border border-current/10 p-5">
              <p className="text-xs opacity-60">{tabs[activeTab]}</p>
              <p className="mt-2 text-3xl font-bold">
                {["98.4%", users.toLocaleString(), "+24.8%", "12"][activeTab]}
              </p>
              <p className="mt-2 font-mono text-[10px] text-primary">↑ OPERACIÓN ESTABLE</p>
            </div>
            <div className="rounded-md border border-current/10 p-5 lg:col-span-2">
              <div className="mb-8 flex justify-between">
                <p className="text-xs opacity-60">Actividad del sistema</p>
                <Activity className="size-4 text-cyan" />
              </div>
              <div className="flex h-24 items-end gap-3">
                {[38, 55, 47, 72, 64, 84, 76, 93].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary/40"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaptureModal({
  company,
  prospect,
  setProspect,
  onClose,
  onSubmit,
}: {
  company: string;
  prospect: Prospect;
  setProspect: (p: Prospect) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const input =
    "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-hidden focus:ring-2 focus:ring-ring";
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-background/85 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="capture-title"
    >
      <form
        onSubmit={onSubmit}
        className="glass-panel relative w-full max-w-lg rounded-lg border-primary/50 p-6 shadow-[var(--shadow-primary)] sm:p-8"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
        <span className="grid size-11 place-items-center rounded-md border border-primary/40 bg-primary/10">
          <KeyRound className="size-5 text-primary" />
        </span>
        <p className="mt-5 font-mono text-xs text-primary">VERIFICACIÓN PROFESIONAL</p>
        <h2 id="capture-title" className="mt-2 text-2xl font-bold">
          Acceso reservado para {company}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tus datos se guardan únicamente en este navegador para mantener el análisis sincronizado.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-muted-foreground">
            Nombre
            <input
              required
              minLength={2}
              autoComplete="name"
              value={prospect.name}
              onChange={(e) => setProspect({ ...prospect, name: e.target.value })}
              className={cn(input, "mt-2")}
              placeholder="Nombre completo"
            />
          </label>
          <label className="text-xs text-muted-foreground">
            Cargo
            <select
              value={prospect.role}
              onChange={(e) =>
                setProspect({ ...prospect, role: e.target.value as Prospect["role"] })
              }
              className={cn(input, "mt-2")}
            >
              <option>CEO</option>
              <option>CTO</option>
              <option>VP Engineering</option>
            </select>
          </label>
          <label className="text-xs text-muted-foreground sm:col-span-2">
            Correo corporativo
            <input
              required
              type="email"
              autoComplete="email"
              value={prospect.email}
              onChange={(e) => setProspect({ ...prospect, email: e.target.value })}
              className={cn(input, "mt-2")}
              placeholder="nombre@empresa.com"
            />
          </label>
          <label className="text-xs text-muted-foreground sm:col-span-2">
            Teléfono
            <input
              required
              minLength={7}
              maxLength={30}
              type="tel"
              autoComplete="tel"
              value={prospect.phone}
              onChange={(e) => setProspect({ ...prospect, phone: e.target.value })}
              className={cn(input, "mt-2")}
              placeholder="+34 600 000 000"
            />
          </label>
        </div>
        <Button type="submit" className="mt-6 w-full" size="lg">
          Verificar y abrir bóveda <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  );
}

function Vault({
  company,
  time,
  appointment,
  repositoryUnlocked,
  onSchedule,
}: {
  company: string;
  time: string;
  appointment: Appointment | null;
  repositoryUnlocked: boolean;
  onSchedule: () => void;
}) {
  return (
    <div className="glass-panel relative mt-12 overflow-hidden rounded-lg border-primary/50 shadow-[var(--shadow-primary)]">
      <div className="flex flex-col justify-between gap-5 border-b border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-md border border-primary/40 bg-primary/10">
            <LockKeyhole className="size-5 text-primary" />
          </span>
          <div>
            <p className="font-mono text-[10px] text-primary">REPOSITORIO CIFRADO</p>
            <h3 className="font-bold">{company.toLowerCase()}-core-platform</h3>
          </div>
        </div>
        <div
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px]",
            repositoryUnlocked
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-danger-soft/40 bg-danger-soft/10 text-danger-soft",
          )}
        >
          <span
            className={cn(
              "pulse-dot size-1.5 rounded-full",
              repositoryUnlocked ? "bg-primary" : "bg-danger-soft",
            )}
          />
          {repositoryUnlocked
            ? "REPOSITORIO DESBLOQUEADO · +48 HORAS"
            : "ESTADO: RESERVADA Y BLOQUEADA"}
        </div>
      </div>
      <div className="grid lg:grid-cols-[.85fr_1.15fr]">
        <div className="border-b border-border p-6 text-center lg:border-b-0 lg:border-r sm:p-10">
          <p className="font-mono text-xs text-muted-foreground">VENTANA DE RESERVA</p>
          <div className="my-5 font-mono text-4xl font-medium tabular-nums text-primary sm:text-6xl">
            {time}
          </div>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            Este repositorio se autodestruirá cuando el contador llegue a cero para garantizar la
            privacidad de tus datos.
          </p>
          {appointment && (
            <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
              <CalendarCheck2 className="size-4" />
              Cita:{" "}
              {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(
                new Date(appointment.startsAt),
              )}
            </div>
          )}
          {repositoryUnlocked ? (
            <a
              href={`https://github.com/ip-vault-private/${projectSlug(company)}-core-platform`}
              target="_blank"
              rel="noreferrer"
              className="mx-auto mt-8 inline-flex h-11 w-full max-w-md items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ExternalLink className="size-4" /> Abrir repositorio privado simbólico
            </a>
          ) : (
            <Button className="mt-8 w-full max-w-md" size="lg" onClick={onSchedule}>
              <KeyRound className="size-4" />
              Desbloquear Código Fuente y Agendar Sesión
            </Button>
          )}
        </div>
        <CodeTree />
      </div>
    </div>
  );
}
function CodeTree() {
  const [open, setOpen] = useState(["src", "config"]);
  const folders = [
    { name: "src", children: ["app.tsx", "modules", "services"] },
    { name: "config", children: ["security.ts", "env.schema.ts"] },
    { name: "docker", children: ["Dockerfile"] },
    { name: "database", children: ["schema.sql", "migrations"] },
    { name: "tests", children: ["integration.spec.ts"] },
  ];
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="size-4 text-cyan" />
          <span className="font-mono text-xs">main</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">SHA 7f2a9c1</span>
      </div>
      <div className="rounded-md border border-border bg-background/50 p-3 font-mono text-xs">
        {folders.map((folder) => {
          const isOpen = open.includes(folder.name);
          return (
            <div key={folder.name}>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 text-muted-foreground"
                onClick={() =>
                  setOpen(isOpen ? open.filter((x) => x !== folder.name) : [...open, folder.name])
                }
              >
                {isOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                <Folder className="size-4 text-cyan" />/{folder.name}
              </Button>
              {isOpen && (
                <div className="ml-7 border-l border-border pl-3">
                  {folder.children.map((file) => (
                    <div className="flex items-center gap-2 py-2 text-muted-foreground" key={file}>
                      <FileCode2 className="size-3.5 text-primary" />
                      {file}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <MiniStat icon={Layers3} value="247" label="archivos" />
        <MiniStat icon={Database} value="38" label="tablas" />
        <MiniStat icon={Server} value="12" label="servicios" />
      </div>
    </div>
  );
}
function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Layers3;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/30 p-3">
      <Icon className="mx-auto size-4 text-cyan" />
      <strong className="mt-2 block font-mono text-sm">{value}</strong>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
