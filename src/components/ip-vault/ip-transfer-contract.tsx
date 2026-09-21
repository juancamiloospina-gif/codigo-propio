import { CheckCircle2, Cloud, Download, FileKey2, Scale, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadTransferAgreement } from "@/lib/transfer-agreement-pdf";

const clauses = [
  {
    icon: Scale,
    title: "Transferencia patrimonial total",
    text: "Transferencia del 100% de los derechos patrimoniales del código fuente, documentación y activos técnicos.",
  },
  {
    icon: ShieldCheck,
    title: "Cero licencias o royalties",
    text: "La agencia renuncia a cualquier cobro futuro por uso, modificación, despliegue o comercialización.",
  },
  {
    icon: Cloud,
    title: "Entrega en tu infraestructura",
    text: "Llaves de cifrado, repositorio e implementación directa en AWS, Google Cloud o Microsoft Azure.",
  },
];

export function IpTransferContract({ company, domain }: { company: string; domain: string }) {
  return (
    <section id="garantia-ip" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-5 md:grid-cols-[110px_1fr]">
          <span className="font-mono text-5xl font-medium text-border">/04</span>
          <div>
            <p className="font-mono text-xs text-cyan">GARANTÍA DE PROPIEDAD INTELECTUAL</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Contrato de Propiedad Total</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Previsualiza las cláusulas esenciales del acuerdo de transferencia preparado para{" "}
              {company}.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <div className="space-y-3">
            {clauses.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="glass-panel rounded-lg p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <p className="font-mono text-[10px] text-cyan">CLÁUSULA 0{index + 1}</p>
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <article className="overflow-hidden rounded-lg border border-border bg-[#f3f0e8] text-[#17202a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileKey2 className="size-5 text-emerald-700" />
                <div>
                  <p className="text-xs font-bold tracking-[.18em]">CUPPERLAB</p>
                  <p className="text-[10px] text-black/50">BORRADOR · V1.0</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-800/20 bg-emerald-700/10 px-3 py-1 text-[10px] font-semibold text-emerald-800">
                PERSONALIZADO
              </span>
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-center font-serif text-xs tracking-[.2em] text-black/50">
                ACUERDO DE TRANSFERENCIA DE IP
              </p>
              <h3 className="mx-auto mt-4 max-w-lg text-center font-serif text-2xl font-bold">
                Cesión integral de código fuente y activos tecnológicos
              </h3>
              <div className="mx-auto my-7 h-px max-w-md bg-black/15" />
              <p className="font-serif text-sm leading-7">
                Entre <strong>Cupperlab</strong>, en adelante “La Agencia”, y{" "}
                <strong>{company}</strong>, asociado al dominio{" "}
                <strong>{domain || "por definir"}</strong>, en adelante “El Cliente”, se establecen
                las siguientes garantías:
              </p>
              <ol className="mt-6 space-y-5 font-serif text-sm leading-7">
                {clauses.map((clause, index) => (
                  <li key={clause.title} className="grid grid-cols-[28px_1fr] gap-3">
                    <span className="font-bold text-emerald-800">{index + 1}.</span>
                    <span>
                      <strong>{clause.title}.</strong> {clause.text}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex items-center gap-2 border-t border-black/10 pt-5 text-xs text-black/55">
                <CheckCircle2 className="size-4 text-emerald-700" /> Borrador orientativo. El
                acuerdo que se firma lo revisan los abogados de las dos partes.
              </div>
            </div>
            <div className="border-t border-black/10 bg-black/[.025] p-5">
              <Button
                className="w-full"
                size="lg"
                onClick={() => downloadTransferAgreement(company, domain)}
              >
                <Download className="size-4" /> Descargar borrador de acuerdo en PDF
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
