import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { createFileRoute } from "@tanstack/react-router";
import JSZip from "jszip";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  Download,
  FileCode2,
  Fingerprint,
  Folder,
  Gauge,
  GitBranch,
  Globe2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Menu,
  Play,
  Server,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { IpTransferContract } from "@/components/ip-vault/ip-transfer-contract";
import { PrivacyNotice } from "@/components/ip-vault/privacy-notice";
import { SchedulingModal } from "@/components/ip-vault/scheduling-modal";
import { useIpVaultState } from "@/hooks/use-ip-vault-state";
import {
  projectSlug,
  prospectSchema,
  SAAS_TOOLS,
  type Appointment,
  type Prospect,
} from "@/lib/ip-vault";
import { notifyLead } from "@/lib/lead-notify";
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

// Interpola el número mostrado hacia `target` en vez de saltar de golpe, para
// que mover un slider se sienta fluido en las cifras grandes de la tarjeta de
// impacto. Sin dependencias nuevas: solo requestAnimationFrame.
function useAnimatedNumber(target: number, duration = 450) {
  const [display, setDisplay] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (from.current === target) return;
    const start = from.current;
    const startTime = performance.now();
    let frame: number;
    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (target - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
      else from.current = target;
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return display;
}

function IpVault() {
  const search = Route.useSearch();
  const { state, dispatch, outbound, company, tco, countdown, vaultExpired } =
    useIpVaultState(search);
  const lossDisplay = useAnimatedNumber(tco.licenseToDate);
  const investmentDisplay = useAnimatedNumber(tco.development);
  const [simulating, setSimulating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  function startAudit() {
    document.querySelector("#auditoria")?.scrollIntoView({ behavior: "smooth" });
  }
  function runSimulation() {
    setSimulating(true);
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
    notifyLead({
      data: {
        event: "boveda_abierta",
        company,
        domain: state.domain,
        outboundKey: state.outboundKey,
        prospect: result.data,
        selected: state.selected,
        users: state.users,
        years: state.years,
        appointment: null,
      },
    }).catch((error) => console.error("[ip-vault] No se pudo notificar el lead", error));
  }
  function confirmAppointment(appointment: Appointment) {
    dispatch({ type: "schedule", appointment, now: Date.now() });
    notifyLead({
      data: {
        event: "cita_agendada",
        company,
        domain: state.domain,
        outboundKey: state.outboundKey,
        prospect: state.prospect,
        selected: state.selected,
        users: state.users,
        years: state.years,
        appointment: { startsAt: appointment.startsAt, timezone: appointment.timezone },
      },
    }).catch((error) => console.error("[ip-vault] No se pudo notificar el lead", error));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} startAudit={startAudit} />
      <section className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-52 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" />
        <div className="relative max-w-5xl rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-10 lg:p-12">
          {outbound && (
            <div className="mb-6 inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/20 py-2 pl-2 pr-4">
              <ProspectAvatar company={company} domain={state.domain} />
              <span className="text-xs font-medium leading-snug text-cyan sm:text-sm">
                Auditoría Financiera Personalizada para{" "}
                <strong className="text-foreground">{company}</strong>
              </span>
            </div>
          )}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary">
            <ShieldCheck className="size-3.5" /> PROTOCOLO DE SOBERANÍA TECNOLÓGICA
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-6xl lg:text-7xl">
            Reemplazamos tus licencias SaaS por{" "}
            <span className="text-primary">tu propio software a la medida.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Diseñamos y desarrollamos la plataforma interna que tu empresa necesita, te entregamos
            el 100% del código fuente y eliminamos las rentas mensuales por usuario para siempre.
          </p>
          <div className="mt-10 flex max-w-3xl flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-2 sm:flex-row">
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
              Calcular Mi Ahorro Financiero <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <ComparisonModule />

      <section id="auditoria" className="border-y border-border bg-card/20 py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle
            number="01"
            eyebrow="AUDITORÍA DE DEPENDENCIAS"
            title="Diagnóstico de Costos"
            text="Modela la exposición financiera acumulada y descubre cuánto capital permanece atrapado en licencias."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl sm:p-7">
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
                        "h-20 justify-start border-white/10 px-3 text-left transition-colors duration-200",
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
              <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-5">
                <p className="mb-1 font-mono text-[10px] tracking-wide text-cyan">
                  PARÁMETROS DE LA AUDITORÍA
                </p>
                <RangeControl
                  label="Número de usuarios activos"
                  value={state.users}
                  min={1}
                  max={1000}
                  onChange={(users) => dispatch({ type: "set-users", users })}
                  suffix="usuarios"
                  hint={`$${tco.monthlySaasPerUser.toLocaleString()} / mes por usuario`}
                />
                <RangeControl
                  label="Años operando con estas herramientas"
                  value={state.years}
                  min={1}
                  max={10}
                  onChange={(years) => dispatch({ type: "set-years", years })}
                  suffix="años"
                  hint={`${state.selected.length} herramientas activas`}
                />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl sm:p-7">
              <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-emerald-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-cyan/20 blur-3xl" />
              <div className="relative">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
                <p className="font-mono text-xs text-primary">TCO // MODELO DINÁMICO</p>
                <div className="mt-5 border-b border-white/10 pb-5">
                  <p className="text-sm text-muted-foreground">
                    Pérdida patrimonial acumulada en {state.years} años
                  </p>
                  <p className="mt-2 text-5xl font-extrabold tabular-nums text-emerald-400 drop-shadow-[0_0_28px_rgba(52,211,153,0.45)] transition-all duration-300 sm:text-6xl">
                    ${lossDisplay.toLocaleString("en-US")}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {state.users} usuarios × ${tco.monthlySaasPerUser.toLocaleString()} / mes × 12 ×{" "}
                    {state.years}
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-danger-soft/30 bg-danger-soft/10 px-4 py-3 transition-all duration-300">
                    <span className="block font-mono text-[9px] tracking-wide text-danger-soft">
                      GASTO LICENCIAS
                    </span>
                    <strong className="mt-1 block truncate text-lg text-danger-soft">
                      ${lossDisplay.toLocaleString("en-US")}
                    </strong>
                    <span className="text-[10px] text-muted-foreground">Gasto perdido</span>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 transition-all duration-300">
                    <span className="block font-mono text-[9px] tracking-wide text-primary">
                      INVERSIÓN CUPPERLAB
                    </span>
                    <strong className="mt-1 block truncate text-lg text-primary">
                      ${investmentDisplay.toLocaleString("en-US")}
                    </strong>
                    <span className="text-[10px] text-muted-foreground">Activo propio</span>
                  </div>
                </div>
                <Metric
                  icon={Gauge}
                  label="Índice de Soberanía IP"
                  value={`${tco.sovereignty}%`}
                  tone={tco.sovereignty < 50 ? "danger" : "primary"}
                />
                <p className="-mt-1 mb-1 text-xs text-muted-foreground">
                  Ahorro proyectado a 5 años:{" "}
                  <strong className={tco.savingsPercent >= 0 ? "text-primary" : "text-danger-soft"}>
                    {tco.savingsPercent}%
                  </strong>
                </p>
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
          </div>
          <TcoChart data={tco.chartData} breakEvenPoint={tco.breakEvenPoint} />
        </div>
      </section>

      <section id="simulador" className="py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <StepTitle
            number="02"
            eyebrow="SIMULACIÓN DE TU NUEVA PLATAFORMA PROPIA"
            title="Prototipo de Tu Sistema"
            text="Así se vería el sistema que Cupperlab desarrollará a la medida de tu operación para reemplazar tus herramientas actuales."
          />
          <PlatformPreview
            company={company}
            domain={state.domain}
            selected={state.selected}
            users={state.users}
            sovereignty={tco.sovereignty}
            simulating={simulating}
            onRun={runSimulation}
          />
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
            title="Entrega de Código & Repositorio"
            text="Al finalizar el proyecto con Cupperlab, este es el paquete de código fuente y documentación que se transfiere legalmente a tu empresa."
          />
          {state.unlocked && !vaultExpired ? (
            <Vault
              company={company}
              time={countdown}
              appointment={state.appointment}
              repositoryUnlocked={state.repositoryUnlocked}
              onSchedule={() => setSchedulingOpen(true)}
              selected={state.selected}
              users={state.users}
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
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => setPrivacyOpen(true)}
          >
            Privacidad
          </button>
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
          onOpenPrivacy={() => setPrivacyOpen(true)}
        />
      )}
      <SchedulingModal
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
        company={company}
        prospect={state.prospect}
        onConfirm={confirmAppointment}
      />
      <PrivacyNotice open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
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
            Diagnóstico
          </a>
          <a href="#simulador" className="text-xs text-muted-foreground hover:text-foreground">
            Prototipo
          </a>
          <a href="#boveda" className="text-xs text-muted-foreground hover:text-foreground">
            Entrega de Código
          </a>
          <a href="#garantia-ip" className="text-xs text-muted-foreground hover:text-foreground">
            Contrato
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
              Diagnóstico
            </a>
            <a href="#simulador" onClick={() => setMobileOpen(false)}>
              Prototipo
            </a>
            <a href="#boveda" onClick={() => setMobileOpen(false)}>
              Entrega de Código
            </a>
            <a href="#garantia-ip" onClick={() => setMobileOpen(false)}>
              Contrato
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
function CompanyMark({ company, className = "" }: { company: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-cyan/30 bg-cyan/10 font-mono font-bold",
        className,
      )}
    >
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
// Favicon real del dominio del prospecto vía el proxy público de Google. Si el
// dominio está vacío o la imagen falla en cargar, cae a las iniciales de
// CompanyMark en vez de dejar un hueco roto.
function ProspectAvatar({
  company,
  domain,
  className = "",
}: {
  company: string;
  domain: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!domain || failed) return <CompanyMark company={company} className={className} />;
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
      alt={`Logo de ${company}`}
      width={40}
      height={40}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn(
        "size-10 shrink-0 rounded-md border border-white/10 bg-white object-contain p-1.5",
        className,
      )}
    />
  );
}

const SAAS_RISKS = [
  "Pagos mensuales por usuario",
  "Subidas de precio unilaterales",
  "Propiedad intelectual de un tercero",
  "Cero activo en tu balance",
];
const CUPPERLAB_BENEFITS = [
  "Inversión única de desarrollo",
  "Usuarios e integración ilimitada",
  "100% propiedad del código fuente",
  "Activo digital tangible para tu empresa",
];

function ComparisonModule() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs text-cyan">EL MODELO CUPPERLAB</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Dos caminos para tu tecnología</h2>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
          <div className="bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8">
            <p className="font-mono text-xs text-danger-soft">RIESGO</p>
            <h3 className="mt-2 text-xl font-bold">Arriendo SaaS Perpetuo</h3>
            <ul className="mt-6 space-y-4">
              {SAAS_RISKS.map((risk) => (
                <li key={risk} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger-soft" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8">
            <p className="font-mono text-xs text-primary">SOLUCIÓN</p>
            <h3 className="mt-2 text-xl font-bold">Software Propio con Cupperlab</h3>
            <ul className="mt-6 space-y-4">
              {CUPPERLAB_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
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
  hint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  hint?: string;
  onChange: (v: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="mt-7 first:mt-0">
      <div className="mb-3 flex items-center justify-between gap-4">
        <label className="text-sm text-muted-foreground">{label}</label>
        <output className="font-mono text-sm text-primary transition-all duration-300">
          {value.toLocaleString()} {suffix}
        </output>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--primary) ${percent}%, oklch(1 0 0 / 12%) ${percent}%)`,
        }}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full outline-none transition-[background] duration-150",
          "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--primary)]",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-[0_0_10px_var(--primary)]",
          "[&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
        )}
      />
      <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground">
        <span>{min.toLocaleString()}</span>
        {hint && <span className="truncate text-cyan">{hint}</span>}
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

type ChartTooltipEntry = { name?: string; value?: number | string; color?: string };

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-2 font-mono text-[10px] text-muted-foreground">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <i className="size-2 rounded-full" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <strong className="ml-auto font-mono tabular-nums text-foreground">
              ${Number(entry.value ?? 0).toLocaleString("en-US")}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function TcoChart({
  data,
  breakEvenPoint,
}: {
  data: { year: string; saas: number; own: number }[];
  breakEvenPoint: string | null;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl sm:p-7">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <p className="font-mono text-xs text-cyan">CURVA DE INVERSIÓN · 5 AÑOS</p>
          <h3 className="mt-2 font-semibold">SaaS acumulado vs. código propietario</h3>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-danger-soft shadow-[0_0_8px_var(--danger-soft)]" />
            SaaS
          </span>
          <span className="flex items-center gap-2">
            <i className="size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            Código propio
          </span>
          {breakEvenPoint && (
            <span className="flex items-center gap-2">
              <i className="size-2 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
              Payback
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 h-72 w-full" aria-label="Gráfica comparativa de costos">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={10} />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
            />
            <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: "var(--border)" }} />
            {breakEvenPoint && (
              <ReferenceLine
                x={breakEvenPoint}
                stroke="var(--cyan)"
                strokeDasharray="4 4"
                label={{
                  value: "Payback",
                  position: "insideTopRight",
                  fill: "var(--cyan)",
                  fontSize: 10,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="saas"
              name="SaaS acumulado"
              stroke="var(--danger-soft)"
              strokeWidth={3}
              dot={false}
              style={{ filter: "drop-shadow(0 0 6px var(--danger-soft))" }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="own"
              name="Código propietario"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={false}
              style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Huella real (SHA-256, Web Crypto, sin dependencias) de los parámetros reales
// de esta auditoría. No es "el hash del código fuente" —no existe código que
// firmar todavía—, es la huella de la sesión: empresa, dominio, stack y
// usuarios que el propio prospecto introdujo. Cambia si cambia cualquiera.
function useVaultFingerprint(seed: string) {
  const [hash, setHash] = useState("");
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (typeof window === "undefined" || !window.crypto?.subtle) return;
      const bytes = new TextEncoder().encode(seed);
      const digest = await window.crypto.subtle.digest("SHA-256", bytes);
      const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      if (!cancelled) setHash(hex);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [seed]);
  return hash;
}

function downloadArchitectureZip(company: string, users: number, selected: string[]) {
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
  zip.folder("src")?.file("App.tsx", `export function App() { return <main>${company} OS</main> }`);
  zip.generateAsync({ type: "blob" }).then((blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}-architecture-demo.zip`;
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  });
}

function PlatformPreview({
  company,
  domain,
  selected,
  users,
  sovereignty,
  simulating,
  onRun,
}: {
  company: string;
  domain: string;
  selected: string[];
  users: number;
  sovereignty: number;
  simulating: boolean;
  onRun: () => void;
}) {
  const [barReady, setBarReady] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const fingerprint = useVaultFingerprint(`${company}|${domain}|${selected.join(",")}|${users}`);

  useEffect(() => {
    if (!simulating) {
      setBarReady(false);
      setContentReady(false);
      setVisible(false);
      return;
    }
    setBarReady(false);
    setContentReady(false);
    setVisible(false);
    const growFrame = requestAnimationFrame(() => setBarReady(true));
    const doneTimer = window.setTimeout(() => setContentReady(true), 1500);
    return () => {
      cancelAnimationFrame(growFrame);
      window.clearTimeout(doneTimer);
    };
  }, [simulating]);

  useEffect(() => {
    if (!contentReady) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [contentReady]);

  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex shrink-0 gap-1.5">
          <i className="size-2.5 rounded-full bg-red-500" />
          <i className="size-2.5 rounded-full bg-amber-400" />
          <i className="size-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <ProspectAvatar company={company} domain={domain} className="size-5 rounded p-0.5" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            ip-vault://{(domain || `${projectSlug(company)}.io`).toLowerCase()}/sovereignty-core
          </span>
        </div>
        <span className="hidden shrink-0 truncate text-xs font-medium text-foreground sm:block">
          {company} Sovereign OS
        </span>
      </div>
      {simulating && !contentReady && (
        <div className="h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-linear-to-r from-cyan to-primary"
            style={{
              width: barReady ? "100%" : "4%",
              transition: "width 1.5s cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
        </div>
      )}
      <div className="min-h-72 p-6 sm:p-8">
        {!simulating && (
          <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <Play className="mb-4 size-8 text-primary" />
            <p className="text-muted-foreground">
              El motor de síntesis está listo para tu stack seleccionado.
            </p>
            <Button className="mt-5" variant="outline" onClick={onRun}>
              Ejecutar simulación
            </Button>
          </div>
        )}
        {simulating && !contentReady && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
            <Sparkles className="size-6 animate-pulse text-cyan" />
            <p className="font-mono text-xs text-cyan">Sintetizando módulos a la medida...</p>
          </div>
        )}
        {contentReady && (
          <div
            className={cn(
              "transition-all duration-500",
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] text-primary">
              <span className="pulse-dot size-1.5 rounded-full bg-primary" />
              ARQUITECTURA COMPILADA · 100% CÓDIGO PROPIETARIO
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <PlatformWidget
                icon={ShieldCheck}
                title="Módulos reemplazados"
                subtitle="Por cada herramienta seleccionada en tu auditoría"
              >
                {selected.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No seleccionaste herramientas en la auditoría. Vuelve al paso 01 para marcar tu
                    stack.
                  </p>
                ) : (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {SAAS_TOOLS.filter((tool) => selected.includes(tool.name)).map((tool) => (
                      <div
                        key={tool.slug}
                        className="rounded-lg border border-white/10 bg-black/20 p-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-secondary font-mono text-[10px] text-cyan">
                            {tool.mark}
                          </span>
                          <p className="min-w-0 truncate text-xs font-semibold">
                            Reemplazo de {tool.name}
                          </p>
                        </div>
                        <span className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary">
                          <ShieldCheck className="size-2.5" /> SOBERANÍA 100%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </PlatformWidget>

              <PlatformWidget
                icon={Server}
                title="Proyección de infraestructura dedicada"
                subtitle="Estimado a partir de tu auditoría, no una medición en vivo"
              >
                <InfraMeter
                  label="Índice de Soberanía IP"
                  value={sovereignty}
                  detail={`${sovereignty}%`}
                />
                <InfraMeter
                  label="Módulos desacoplados de SaaS"
                  value={SAAS_TOOLS.length ? (selected.length / SAAS_TOOLS.length) * 100 : 0}
                  detail={`${selected.length} de ${SAAS_TOOLS.length}`}
                />
              </PlatformWidget>

              <PlatformWidget
                icon={Fingerprint}
                title="Registro de propiedad intelectual"
                subtitle="Huella de esta sesión, lista para la bóveda"
                className="lg:col-span-2"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-muted-foreground">
                      HUELLA SHA-256 · EMPRESA + DOMINIO + STACK + USUARIOS
                    </p>
                    <p className="mt-1.5 break-all font-mono text-xs text-primary sm:text-sm">
                      {fingerprint
                        ? fingerprint.match(/.{1,8}/g)?.join(":")
                        : "calculando huella..."}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => downloadArchitectureZip(company, users, selected)}
                  >
                    <Download className="size-3.5" />
                    Paquete de referencia
                  </Button>
                </div>
              </PlatformWidget>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlatformWidget({
  icon: Icon,
  title,
  subtitle,
  className,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  subtitle: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-slate-950/40 p-5", className)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-cyan/10 text-cyan">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold">{title}</h4>
          <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function InfraMeter({ label, value, detail }: { label: string; value: number; detail: string }) {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-cyan">{detail}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-linear-to-r from-cyan to-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function CaptureModal({
  company,
  prospect,
  setProspect,
  onClose,
  onSubmit,
  onOpenPrivacy,
}: {
  company: string;
  prospect: Prospect;
  setProspect: (p: Prospect) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onOpenPrivacy: () => void;
}) {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
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
        <label className="mt-5 flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
          <input
            required
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          Acepto los términos de procesamiento de datos corporativos y{" "}
          <button
            type="button"
            className="underline underline-offset-2 hover:text-foreground"
            onClick={onOpenPrivacy}
          >
            política de privacidad
          </button>
          .
        </label>
        <Button type="submit" className="mt-4 w-full" size="lg" disabled={!privacyAccepted}>
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
  selected,
  users,
}: {
  company: string;
  time: string;
  appointment: Appointment | null;
  repositoryUnlocked: boolean;
  onSchedule: () => void;
  selected: string[];
  users: number;
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
            <div className="mx-auto mt-8 w-full max-w-md rounded-md border border-primary/30 bg-primary/5 px-5 py-4">
              <p className="font-mono text-[10px] text-primary">IDENTIFICADOR DE BÓVEDA</p>
              <p className="mt-2 flex items-center justify-center gap-2 break-all font-mono text-sm text-primary">
                <LockKeyhole className="size-4 shrink-0" />
                ip-vault://{projectSlug(company)}-sovereign-core
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Acceso confirmado. Un Lead Architect prepara la entrega del repositorio.
              </p>
            </div>
          ) : (
            <Button className="mt-8 w-full max-w-md" size="lg" onClick={onSchedule}>
              <KeyRound className="size-4" />
              Desbloquear Código Fuente y Agendar Sesión
            </Button>
          )}
        </div>
        <CodeTree company={company} selected={selected} users={users} />
      </div>
    </div>
  );
}
function CodeTree({
  company,
  selected,
  users,
}: {
  company: string;
  selected: string[];
  users: number;
}) {
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
      <p className="font-mono text-[10px] text-cyan">
        ESTRUCTURA DE ARQUITECTURA MODULAR PROPIETARIA
      </p>
      <div className="mb-5 mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <GitBranch className="size-4 shrink-0 text-cyan" />
          <span className="truncate font-mono text-xs">main</span>
        </div>
        <span className="truncate font-mono text-[10px] text-muted-foreground">
          ip-vault://{projectSlug(company)}-sovereign-core
        </span>
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
        <MiniStat icon={Layers3} value={String(folders.length)} label="módulos" />
        <MiniStat
          icon={Database}
          value={String(selected.length)}
          label="integraciones sustituidas"
        />
        <MiniStat icon={Server} value={users.toLocaleString()} label="usuarios con acceso" />
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
