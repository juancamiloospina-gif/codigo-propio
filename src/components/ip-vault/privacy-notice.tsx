import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COMPANY_CONFIG } from "@/config/company";

function isPending(value: string) {
  return value.includes("Pendiente de Configuración");
}

// Solo entran en el aviso el NIF y el domicilio que de verdad están configurados
// (COMPANY_NIF / COMPANY_ADDRESS). Mientras no lo estén, no se muestra ningún
// dato inventado ni el placeholder en bruto: la frase simplemente los omite.
const identityFacts = [
  isPending(COMPANY_CONFIG.taxId) ? null : `NIF ${COMPANY_CONFIG.taxId}`,
  isPending(COMPANY_CONFIG.address) ? null : `domicilio en ${COMPANY_CONFIG.address}`,
].filter((fact): fact is string => Boolean(fact));

const identityLine = identityFacts.length
  ? `${COMPANY_CONFIG.name} (${identityFacts.join(", ")})`
  : COMPANY_CONFIG.name;

const blocks: { title: string; body: string }[] = [
  {
    title: "Quién trata vuestros datos",
    body: `${identityLine}. Para cualquier asunto relacionado con esta página, escribid a ${COMPANY_CONFIG.contactEmail}.`,
  },
  {
    title: "Qué se queda en vuestro navegador",
    body: "El cálculo entero (herramientas, número de personas, años, importes y el paquete de ejemplo) se hace en vuestro ordenador y se guarda en el almacenamiento local del navegador. Nada de eso llega a Cupperlab. El botón «Borrar mis datos» lo elimina en el momento, y podéis comprobarlo vosotros mismos en las herramientas de desarrollo del navegador.",
  },
  {
    title: "Qué nos llega a nosotros",
    body: "Solo lo que escribís en el formulario de reserva y pulsáis enviar: nombre, cargo, correo corporativo y teléfono. Lo usamos para contactaros y preparar la sesión de 20 minutos, y para nada más.",
  },
  {
    title: "Con qué base legal",
    body: "Interés legítimo en la prospección entre empresas (art. 6.1.f del RGPD) para el primer contacto, y vuestro consentimiento al enviar el formulario para el resto. Podéis retirarlo cuando queráis.",
  },
  {
    title: "Cuánto tiempo los guardamos",
    body: "Los datos de contacto se conservan mientras la conversación comercial siga viva y, como máximo, doce meses desde el último contacto. Después se eliminan.",
  },
  {
    title: "Quién más los ve",
    body: "Los proveedores que alojan esta página y el correo con el que la gestionamos, actuando como encargados del tratamiento. No se venden ni se ceden a terceros para publicidad.",
  },
  {
    title: "Vuestros derechos",
    body: `Podéis pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${COMPANY_CONFIG.contactEmail}. Si creéis que no os atendemos bien, podéis reclamar ante la Agencia Española de Protección de Datos (aepd.es).`,
  },
];

export function PrivacyNotice({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-background/85 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
    >
      <div className="glass-panel relative my-8 w-full max-w-2xl rounded-lg p-6 sm:p-8">
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
        <h2 id="privacy-title" className="pr-10 text-2xl font-bold">
          Privacidad y datos
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          En corto: el cálculo se queda en vuestro ordenador y solo recibimos lo que nos enviáis a
          propósito.
        </p>
        <div className="mt-7 space-y-6">
          {blocks.map((block) => (
            <section key={block.title}>
              <h3 className="text-sm font-semibold">{block.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{block.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
