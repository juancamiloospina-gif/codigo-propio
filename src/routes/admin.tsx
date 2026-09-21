import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CalendarCheck2,
  Check,
  Copy,
  DollarSign,
  ExternalLink,
  KeyRound,
  Link2,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { checkAdminSession, unlockAdmin } from "@/lib/admin-auth";
import { SAAS_TOOLS } from "@/lib/ip-vault";
import {
  buildOutboundUrl,
  readLeads,
  subscribeToLeads,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/ip-vault-admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "IP Vault Admin — Pipeline de soberanía" },
      { name: "description", content: "Panel interno de operaciones y prospección de IP Vault." },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAdminSession()
      .then((result) => setAuthorized(result.authorized))
      .catch(() => setAuthorized(false))
      .finally(() => setChecking(false));
  }, []);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const result = await unlockAdmin({ data: { code: accessCode } });
      if (result.authorized) setAuthorized(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) return null;
  if (!authorized)
    return (
      <AdminGate
        code={accessCode}
        setCode={setAccessCode}
        unlock={unlock}
        error={error}
        submitting={submitting}
      />
    );
  return <AdminDashboard />;
}

function AdminGate({
  code,
  setCode,
  unlock,
  error,
  submitting,
}: {
  code: string;
  setCode: (value: string) => void;
  unlock: (event: FormEvent) => void;
  error: boolean;
  submitting: boolean;
}) {
  return (
    <main className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-5 py-16">
      <form
        onSubmit={unlock}
        className="glass-panel w-full max-w-md rounded-xl border-primary/30 p-7 text-center shadow-[var(--shadow-primary)]"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-md bg-primary/10 text-primary">
          <LockKeyhole className="size-6" />
        </span>
        <p className="mt-5 font-mono text-xs text-cyan">ACCESO INTERNO</p>
        <h1 className="mt-2 text-2xl font-bold">Panel de operaciones IP Vault</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Esta vista contiene datos comerciales guardados localmente en el navegador.
        </p>
        <label className="mt-6 block text-left text-xs text-muted-foreground">
          Código de acceso
          <Input
            className="mt-2 h-11 font-mono uppercase"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Código de acceso"
            autoComplete="off"
          />
        </label>
        {error && <p className="mt-2 text-left text-xs text-danger-soft">Código incorrecto.</p>}
        <Button type="submit" className="mt-4 w-full" size="lg" disabled={submitting}>
          <KeyRound className="size-4" /> {submitting ? "Comprobando..." : "Entrar al panel"}
        </Button>
      </form>
    </main>
  );
}

function AdminDashboard() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);

  useEffect(() => {
    const refresh = () => setLeads(readLeads());
    refresh();
    return subscribeToLeads(refresh);
  }, []);

  const metrics = useMemo(() => {
    const now = Date.now();
    return {
      audits: leads.length,
      pipeline: leads.reduce((total, lead) => total + lead.pipelineValue, 0),
      activeVaults: leads.filter((lead) => lead.vaultExpiresAt && lead.vaultExpiresAt > now).length,
      scheduled: leads.filter((lead) => lead.appointment).length,
    };
  }, [leads]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs text-primary">
              <ShieldCheck className="size-4" /> OPERACIONES INTERNAS
            </p>
            <h1 className="mt-2 text-3xl font-bold">Pipeline de soberanía tecnológica</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Auditorías, bóvedas y sesiones de arquitectura en un solo lugar.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:bg-accent"
          >
            Ver experiencia cliente <ExternalLink className="size-4" />
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-12">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Activity}
            label="Auditorías realizadas"
            value={String(metrics.audits)}
          />
          <MetricCard
            icon={DollarSign}
            label="Pipeline potencial"
            value={currency(metrics.pipeline)}
          />
          <MetricCard
            icon={LockKeyhole}
            label="Bóvedas activas"
            value={String(metrics.activeVaults)}
          />
          <MetricCard
            icon={CalendarCheck2}
            label="Citas agendadas"
            value={String(metrics.scheduled)}
          />
        </section>

        <section className="glass-panel overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
            <div>
              <p className="font-mono text-xs text-cyan">LEADS CAPTADOS</p>
              <h2 className="mt-1 text-xl font-bold">Actividad comercial</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
              {leads.length} registros
            </span>
          </div>
          {leads.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa / dominio</TableHead>
                  <TableHead>TCO a 5 años</TableHead>
                  <TableHead>Estado de bóveda</TableHead>
                  <TableHead>Fecha de cita</TableHead>
                  <TableHead>Contacto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <strong className="block">{lead.company}</strong>
                      <span className="text-xs text-muted-foreground">{lead.domain}</span>
                    </TableCell>
                    <TableCell className="font-mono">{currency(lead.tco)}</TableCell>
                    <TableCell>
                      <Status status={lead.vaultStatus} />
                    </TableCell>
                    <TableCell className="text-xs">
                      {lead.appointment
                        ? new Intl.DateTimeFormat("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(lead.appointment.startsAt))
                        : "Sin agendar"}
                    </TableCell>
                    <TableCell>
                      <span className="block text-xs">{lead.email || "Sin correo"}</span>
                      <span className="text-[10px] text-muted-foreground">{lead.role}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid min-h-52 place-items-center p-8 text-center text-sm text-muted-foreground">
              <div>
                <UsersRound className="mx-auto mb-3 size-7 text-cyan" />
                Aún no hay análisis capturados. Abre la vista Cliente y completa una auditoría.
              </div>
            </div>
          )}
        </section>

        <OutboundLinkGenerator />
      </div>
    </main>
  );
}

function OutboundLinkGenerator() {
  const [form, setForm] = useState({
    company: "AcmeCorp",
    domain: "acme.com",
    email: "cto@acme.com",
    users: 50,
  });
  const [selected, setSelected] = useState(["salesforce", "hubspot"]);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  function generate(event: FormEvent) {
    event.preventDefault();
    setGeneratedUrl(buildOutboundUrl(window.location.origin, { ...form, saas: selected }));
    setCopied(false);
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
  }

  return (
    <section className="glass-panel rounded-xl p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-cyan/10 text-cyan">
          <Link2 className="size-5" />
        </span>
        <div>
          <p className="font-mono text-xs text-cyan">OUTBOUND AGENT TOOL</p>
          <h2 className="mt-1 text-xl font-bold">Generador de enlaces personalizados</h2>
        </div>
      </div>
      <form onSubmit={generate} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="Empresa"
          value={form.company}
          onChange={(company) => setForm({ ...form, company })}
        />
        <Field
          label="Dominio"
          value={form.domain}
          onChange={(domain) => setForm({ ...form, domain })}
        />
        <Field
          label="Correo del prospecto"
          type="email"
          value={form.email}
          onChange={(email) => setForm({ ...form, email })}
        />
        <Field
          label="Usuarios"
          type="number"
          value={String(form.users)}
          onChange={(users) => setForm({ ...form, users: Number(users) || 1 })}
        />
        <div className="md:col-span-2">
          <p className="mb-2 text-xs text-muted-foreground">Stack SaaS detectado</p>
          <div className="flex flex-wrap gap-2">
            {SAAS_TOOLS.map((tool) => {
              const active = selected.includes(tool.slug);
              return (
                <Button
                  key={tool.slug}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  aria-pressed={active}
                  onClick={() =>
                    setSelected(
                      active
                        ? selected.filter((slug) => slug !== tool.slug)
                        : [...selected, tool.slug],
                    )
                  }
                >
                  {active && <Check className="size-3" />}
                  {tool.name}
                </Button>
              );
            })}
          </div>
        </div>
        <Button type="submit" size="lg" className="md:col-span-2">
          <Link2 className="size-4" /> Generar URL outbound
        </Button>
      </form>
      {generatedUrl && (
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="font-mono text-[10px] text-primary">ENLACE LISTO PARA EL AGENTE</p>
          <p className="mt-2 break-all text-xs leading-5 text-muted-foreground">{generatedUrl}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={copyUrl}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copiado" : "Copiar enlace"}
            </Button>
            <a
              href={generatedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-accent"
            >
              Abrir prueba <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="text-xs text-muted-foreground">
      {label}
      <Input
        required
        className="mt-2 h-11"
        type={type}
        value={value}
        min={type === "number" ? 1 : undefined}
        max={type === "number" ? 1000 : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">LIVE</span>
      </div>
      <p className="mt-5 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Status({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px]",
        status === "Agendado"
          ? "border-primary/30 bg-primary/10 text-primary"
          : status === "Expirado"
            ? "border-danger-soft/30 bg-danger-soft/10 text-danger-soft"
            : "border-cyan/30 bg-cyan/10 text-cyan",
      )}
    >
      {status}
    </span>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
