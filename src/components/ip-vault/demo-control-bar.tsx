import { useLocation } from "@tanstack/react-router";
import { ExternalLink, LayoutDashboard, MonitorSmartphone } from "lucide-react";

export function DemoControlBar() {
  // El prospecto nunca debe ver esta barra: ni con un enlace de outbound abierto
  // (company/domain en la URL) ni en producción, aunque no lleve parámetros.
  const search = useLocation({ select: (location) => location.search }) as Record<string, unknown>;
  const hasOutboundParams = Boolean(search["company"]) || Boolean(search["domain"]);
  const isProduction = process.env["NODE_ENV"] === "production";
  if (hasOutboundParams || isProduction) return null;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-primary/25 bg-background/95 px-3 py-2 shadow-[0_-12px_40px_rgba(0,0,0,.35)] backdrop-blur-xl"
      aria-label="Control de demostración"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="hidden items-center gap-2 font-mono text-[10px] text-muted-foreground sm:flex">
          <span className="pulse-dot size-1.5 rounded-full bg-primary" /> MODO DEMOSTRACIÓN
        </div>
        <div className="flex flex-1 justify-center gap-2 sm:flex-none">
          <a
            href="/"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium transition-colors hover:bg-accent"
          >
            <MonitorSmartphone className="size-3.5" /> Cliente
          </a>
          <a
            href="/admin"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <LayoutDashboard className="size-3.5" /> Admin
          </a>
        </div>
        <span className="hidden items-center gap-1 text-[10px] text-muted-foreground sm:flex">
          Datos locales <ExternalLink className="size-3" />
        </span>
      </div>
    </aside>
  );
}
