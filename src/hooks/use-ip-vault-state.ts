import { useEffect, useMemo, useReducer, useState } from "react";

import {
  APPOINTMENT_EXTENSION_MS,
  STORAGE_KEY,
  VAULT_WINDOW_MS,
  calculateTco,
  companyFromDomain,
  createInitialState,
  formatCountdown,
  getOutboundKey,
  hasOutboundSearch,
  readStoredState,
  type AnalysisState,
  type Appointment,
  type OutboundSearch,
  type Prospect,
} from "@/lib/ip-vault";
import { syncLead } from "@/lib/ip-vault-admin";

type Action =
  | { type: "hydrate"; state: AnalysisState }
  | { type: "set-domain"; domain: string }
  | { type: "toggle-tool"; tool: string }
  | { type: "set-users"; users: number }
  | { type: "set-years"; years: number }
  | { type: "set-prospect"; prospect: Prospect }
  | { type: "unlock"; prospect: Prospect; now: number }
  | { type: "schedule"; appointment: Appointment; now: number }
  | { type: "set-theme"; theme: AnalysisState["prototypeTheme"] }
  | { type: "set-view"; view: AnalysisState["prototypeView"] }
  | { type: "set-tab"; tab: number };

function reducer(state: AnalysisState, action: Action): AnalysisState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "set-domain":
      return { ...state, domain: action.domain.slice(0, 160) };
    case "toggle-tool":
      return {
        ...state,
        selected: state.selected.includes(action.tool)
          ? state.selected.filter((tool) => tool !== action.tool)
          : [...state.selected, action.tool],
      };
    case "set-users":
      return { ...state, users: action.users };
    case "set-years":
      return { ...state, years: action.years };
    case "set-prospect":
      return { ...state, prospect: action.prospect };
    case "unlock":
      return {
        ...state,
        prospect: action.prospect,
        unlocked: true,
        vaultExpiresAt: action.now + VAULT_WINDOW_MS,
      };
    case "schedule":
      return {
        ...state,
        appointment: action.appointment,
        repositoryUnlocked: true,
        unlocked: true,
        vaultExpiresAt:
          Math.max(state.vaultExpiresAt ?? action.now, action.now) + APPOINTMENT_EXTENSION_MS,
      };
    case "set-theme":
      return { ...state, prototypeTheme: action.theme };
    case "set-view":
      return { ...state, prototypeView: action.view };
    case "set-tab":
      return { ...state, activeTab: action.tab };
  }
}

export function useIpVaultState(search: OutboundSearch) {
  const outbound = hasOutboundSearch(search);
  const outboundKey = getOutboundKey(search);
  const [state, dispatch] = useReducer(reducer, search, createInitialState);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const stored = readStoredState();
    const sameOutboundCampaign = outbound && stored?.outboundKey === outboundKey;
    if (stored && (!outbound || sameOutboundCampaign)) dispatch({ type: "hydrate", state: stored });
    setHydrated(true);
  }, [outbound, outboundKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const company = (search.company.trim() || companyFromDomain(state.domain)).slice(0, 80);
  const tco = useMemo(() => calculateTco(state), [state]);
  const countdown = formatCountdown(state.vaultExpiresAt, now);
  const vaultExpired = Boolean(state.vaultExpiresAt && state.vaultExpiresAt <= now);

  useEffect(() => {
    if (hydrated) syncLead(state, company);
  }, [company, hydrated, state]);

  return { state, dispatch, outbound, company, tco, countdown, vaultExpired };
}
