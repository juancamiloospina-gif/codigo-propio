import { calculateTco, projectSlug, type AnalysisState, type Appointment } from "@/lib/ip-vault";

export const LEADS_STORAGE_KEY = "ip-vault-admin-leads-v1";
const LEADS_EVENT = "ip-vault-leads-updated";

export type LeadStatus = "Reservado" | "Expirado" | "Agendado";

export type LeadRecord = {
  id: string;
  company: string;
  domain: string;
  email: string;
  role: string;
  tco: number;
  pipelineValue: number;
  vaultStatus: LeadStatus;
  vaultExpiresAt: number | null;
  appointment: Appointment | null;
  updatedAt: string;
};

export function readLeads(): LeadRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LEADS_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as LeadRecord[]) : [];
  } catch {
    return [];
  }
}

export function syncLead(state: AnalysisState, company: string) {
  if (typeof window === "undefined" || (!state.domain && !state.prospect.email)) return;
  const tco = calculateTco(state);
  const now = Date.now();
  const vaultStatus: LeadStatus = state.appointment
    ? "Agendado"
    : state.vaultExpiresAt && state.vaultExpiresAt <= now
      ? "Expirado"
      : "Reservado";
  const lead: LeadRecord = {
    id: state.outboundKey || `${projectSlug(company)}|${state.domain.toLowerCase()}`,
    company,
    domain: state.domain || "Sin dominio",
    email: state.prospect.email,
    role: state.prospect.role,
    tco: tco.saasFiveYear,
    pipelineValue: Math.max(tco.development, tco.netSavings),
    vaultStatus,
    vaultExpiresAt: state.vaultExpiresAt,
    appointment: state.appointment,
    updatedAt: new Date().toISOString(),
  };
  const leads = readLeads();
  const index = leads.findIndex((item) => item.id === lead.id);
  if (index >= 0) leads[index] = lead;
  else leads.unshift(lead);
  window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads.slice(0, 250)));
  window.dispatchEvent(new CustomEvent(LEADS_EVENT));
}

export function subscribeToLeads(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const listener = () => callback();
  window.addEventListener(LEADS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(LEADS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function buildOutboundUrl(
  origin: string,
  input: { company: string; domain: string; saas: string[]; users: number; email: string },
) {
  const params = new URLSearchParams({
    company: input.company.trim(),
    domain: input.domain.trim(),
    saas: input.saas.join(","),
    users: String(Math.min(1000, Math.max(1, input.users))),
    email: input.email.trim(),
  });
  return `${origin}/?${params.toString()}`;
}
