import { z } from "zod";

export const SAAS_TOOLS = [
  { name: "Salesforce", slug: "salesforce", monthlyCost: 165, mark: "SF" },
  { name: "HubSpot", slug: "hubspot", monthlyCost: 92, mark: "HS" },
  { name: "Zendesk", slug: "zendesk", monthlyCost: 75, mark: "ZD" },
  { name: "SAP", slug: "sap", monthlyCost: 210, mark: "SAP" },
  { name: "Jira", slug: "jira", monthlyCost: 18, mark: "JI" },
  { name: "ERP Propietario", slug: "erp", monthlyCost: 130, mark: "ERP" },
  { name: "Custom SaaS", slug: "custom", monthlyCost: 110, mark: "CS" },
] as const;

export const DEFAULT_SELECTED_TOOLS = ["Salesforce", "Jira", "HubSpot"];
export const STORAGE_KEY = "ip-vault-analysis-v3";
export const VAULT_WINDOW_MS = 72 * 60 * 60 * 1000;
export const APPOINTMENT_EXTENSION_MS = 48 * 60 * 60 * 1000;

export type ProspectRole = "CEO" | "CTO" | "VP Engineering";
export type Prospect = {
  name: string;
  role: ProspectRole;
  email: string;
  phone: string;
};

export type Appointment = {
  startsAt: string;
  timezone: string;
  durationMinutes: 20;
  confirmedAt: string;
};

export type OutboundSearch = {
  company: string;
  domain: string;
  saas: string;
  users: number;
  email: string;
};

export type AnalysisState = {
  version: 3;
  outboundKey: string;
  domain: string;
  selected: string[];
  users: number;
  years: number;
  prospect: Prospect;
  unlocked: boolean;
  vaultExpiresAt: number | null;
  appointment: Appointment | null;
  repositoryUnlocked: boolean;
  prototypeTheme: "dark" | "light";
  prototypeView: "preview" | "code";
  activeTab: number;
};

export const prospectSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre completo."),
  role: z.enum(["CEO", "CTO", "VP Engineering"]),
  email: z.string().trim().email("Escribe un correo corporativo válido."),
  phone: z.string().trim().min(7, "Escribe un teléfono válido.").max(30),
});

const storedStateSchema = z.object({
  version: z.literal(3),
  outboundKey: z.string().max(400),
  domain: z.string().max(160),
  selected: z.array(z.string()).max(SAAS_TOOLS.length),
  users: z.number().int().min(1).max(1000),
  years: z.number().int().min(1).max(10),
  prospect: prospectSchema,
  unlocked: z.boolean(),
  vaultExpiresAt: z.number().nullable(),
  appointment: z
    .object({
      startsAt: z.string().datetime(),
      timezone: z.string().min(1).max(100),
      durationMinutes: z.literal(20),
      confirmedAt: z.string().datetime(),
    })
    .nullable(),
  repositoryUnlocked: z.boolean(),
  prototypeTheme: z.enum(["dark", "light"]),
  prototypeView: z.enum(["preview", "code"]),
  activeTab: z.number().int().min(0).max(3),
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function companyFromDomain(domain: string) {
  const host = domain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[./]/)[0];

  if (!host) return "Acme";
  return host
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .slice(0, 80);
}

export function selectedToolsFromQuery(query: string) {
  const slugs = new Set(
    query
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  return SAAS_TOOLS.filter((tool) => slugs.has(tool.slug)).map((tool) => tool.name);
}

export function hasOutboundSearch(search: OutboundSearch) {
  return Boolean(search.company || search.domain || search.saas || search.users || search.email);
}

export function getOutboundKey(search: OutboundSearch) {
  if (!hasOutboundSearch(search)) return "";
  return [search.company, search.domain, search.email]
    .map((value) => String(value).trim().toLowerCase())
    .join("|")
    .slice(0, 400);
}

export function createInitialState(search: OutboundSearch): AnalysisState {
  const outboundTools = selectedToolsFromQuery(search.saas);
  return {
    version: 3,
    outboundKey: getOutboundKey(search),
    domain: search.domain.trim().slice(0, 160),
    selected: outboundTools.length ? outboundTools : [...DEFAULT_SELECTED_TOOLS],
    users: search.users ? clamp(search.users, 1, 1000) : 125,
    years: 4,
    prospect: { name: "", role: "CTO", email: search.email.trim().slice(0, 160), phone: "" },
    unlocked: false,
    vaultExpiresAt: null,
    appointment: null,
    repositoryUnlocked: false,
    prototypeTheme: "dark",
    prototypeView: "preview",
    activeTab: 0,
  };
}

export function readStoredState(): AnalysisState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem("ip-vault-analysis-v2");
    if (!raw) return null;
    const candidate = JSON.parse(raw) as Record<string, unknown>;
    const migrated =
      candidate["version"] === 2
        ? { ...candidate, version: 3, appointment: null, repositoryUnlocked: false }
        : candidate;
    const parsed = storedStateSchema.safeParse(migrated);
    if (!parsed.success) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
    window.localStorage.removeItem("ip-vault-analysis-v2");
    return parsed.data;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function calculateTco(input: Pick<AnalysisState, "selected" | "users" | "years">) {
  const selectedTools = SAAS_TOOLS.filter((tool) => input.selected.includes(tool.name));
  const monthlySaasPerUser = selectedTools.reduce((sum, tool) => sum + tool.monthlyCost, 0);
  const annualSaas = input.users * monthlySaasPerUser * 12;
  const licenseToDate = annualSaas * input.years;

  // The fixed platform investment scales with users and integration complexity.
  const basePlatform = 52_000;
  const userScale = input.users * 520;
  const integrationScale = selectedTools.length * 8_500;
  const development = basePlatform + userScale + integrationScale;
  const annualMaintenance = development * 0.15;
  const saasFiveYear = annualSaas * 5;
  const proprietaryFiveYear = development + annualMaintenance * 5;
  const netSavings = saasFiveYear - proprietaryFiveYear;
  const savingsPercent = saasFiveYear > 0 ? Math.round((netSavings / saasFiveYear) * 100) : 0;
  const sovereignty = clamp(
    Math.round(88 - selectedTools.length * 8 - input.years * 2 - Math.min(input.users / 35, 18)),
    8,
    100,
  );

  const chartData = Array.from({ length: 6 }, (_, year) => ({
    year: `Año ${year}`,
    saas: annualSaas * year,
    own: year === 0 ? development : development + annualMaintenance * year,
  }));
  const breakEvenPoint =
    chartData.find((point, index) => index > 0 && point.saas >= point.own)?.year ?? null;

  return {
    monthlySaasPerUser,
    annualSaas,
    licenseToDate,
    development,
    annualMaintenance,
    saasFiveYear,
    proprietaryFiveYear,
    netSavings,
    savingsPercent,
    sovereignty,
    chartData,
    breakEvenPoint,
  };
}

export function formatCountdown(expiresAt: number | null, now: number) {
  const seconds = Math.max(0, Math.floor(((expiresAt ?? now) - now) / 1000));
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${remainder}`;
}

export function projectSlug(company: string) {
  return (
    company
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "company"
  );
}
