# IP Vault · contexto del proyecto

Herramienta de outbound de **Cupperlab**. Se manda por correo en frío a un prospecto con
sus datos en la URL, le calcula lo que gasta en licencias SaaS, le enseña cómo sería un
sistema propio y le pide 20 minutos de agenda.

**No es un entregable de cliente. Es un activo propio de captación (Carril B, Revenue YA).**

## Cómo se abre

```
/?company=Seguralia&domain=seguralia.es&saas=salesforce,hubspot,zendesk&users=180&email=cto@seguralia.es
```

`saas` acepta los slugs de `SAAS_TOOLS` en `src/lib/ip-vault.ts`. `/admin` tiene el generador
de estos enlaces.

## Stack

TanStack Start 1.168 + React + Vite + Tailwind v4 + shadcn/Radix + Recharts + JSZip + zod.
Build vía `@lovable.dev/vite-tanstack-config` (ya trae devtools, tanstackStart, viteReact,
tailwind, tsConfigPaths y nitro con target Cloudflare; **no añadir esos plugins a mano**).
`src/server.ts` envuelve el SSR para capturar errores que h3 se traga.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local |
| `npm run build` | Build (nitro → `.output`) |
| `npm run lint` | ESLint + Prettier |
| `npx tsc --noEmit` | Typecheck |

`src/routeTree.gen.ts` se genera solo. No se edita a mano. Una ruta nueva necesita un
`npm run dev` para regenerarlo.

## Mapa de ficheros

| Fichero | Qué hay |
|---|---|
| `src/routes/index.tsx` | La landing entera: hero, calculadora, simulador, bóveda, captura |
| `src/routes/admin.tsx` | Panel interno: leads, métricas, generador de enlaces |
| `src/lib/ip-vault.ts` | Motor de TCO, esquemas zod, persistencia, slugs |
| `src/lib/ip-vault-admin.ts` | Registro de leads en localStorage (para pruebas locales) y `buildOutboundUrl` |
| `src/lib/lead-notify.ts` | Server function `notifyLead`: manda el lead por correo (Resend, `RESEND_API_KEY`) |
| `src/lib/admin-auth.ts` | Server functions de `/admin`: código de acceso y sesión, nada en el bundle del cliente |
| `src/hooks/use-ip-vault-state.ts` | Estado global (reducer + localStorage + contador) |
| `src/components/ip-vault/scheduling-modal.tsx` | Agendamiento en 2 pasos |
| `src/components/ip-vault/ip-transfer-contract.tsx` | Contrato de cesión de IP |
| `src/lib/transfer-agreement-pdf.ts` | Genera el PDF a mano, sin dependencias |
| `src/components/ip-vault/privacy-notice.tsx` | Aviso RGPD (falta razón social/NIF) |

## Motor de TCO (`calculateTco`)

```
licencias        = usuarios × (suma de coste/mes de las herramientas) × 12 × años
desarrollo       = 52.000 + (usuarios × 520) + (nº integraciones × 8.500)
mantenimiento/año= desarrollo × 0,15
```

Todo en **dólares**, decisión de Juan del 21-sep-2026. La gráfica son 6 puntos (año 0 a 5)
con su punto de equilibrio.

## Git y despliegue

- Remote: `github.com/juancamiloospina-gif/codigo-propio`. **Conectado a Lovable.**
- `AGENTS.md`: no reescribir historia publicada (nada de force push, rebase ni amend
  sobre commits ya subidos). Lo que se pushea a la rama conectada aparece en el editor
  de Lovable.
- `main` está publicado en https://codigo-propio.lovable.app
- `feat/ip-vault-admin` lleva el panel admin, el contrato y el agendamiento. Ya pusheada,
  sin desplegar.
- Se despliega con el botón Publish de Lovable. Hay un preset de Cloudflare Workers
  configurado por si algún día se sale de Lovable (`npx wrangler deploy` desde `.output`).

## Reglas que NO se saltan

Esto sale de la capa de integridad del método Cupperlab y bloquea la publicación.

1. **Nada fabricado junto al nombre real del prospecto.** Se retiraron `247 archivos`,
   `38 tablas`, `12 servicios`, `SHA 7f2a9c1` y un enlace a un repo de GitHub inexistente.
   Si vuelve una cifra a la página, sale de un cálculo con los datos que él metió.
2. **Nada de escasez falsa.** Un contador que dice que se destruye algo tiene que destruir
   algo de verdad. El contador actual cuelga de un hueco de agenda, que sí es real.
3. **El emisor es Cupperlab.** «IP Vault Agency» no existe y no puede firmar un borrador de
   cesión de IP junto a una empresa real.
4. **Si se piden datos personales, hay aviso de privacidad en el momento de la recogida**
   (RGPD art. 13).
5. **Nunca se menciona al prospecto que esto lo hace una IA.**

## Estado a 21-sep-2026

Hecho:
- Landing funcional con personalización por URL, TCO, gráfica, simulador, bóveda,
  descarga en .zip, contrato y PDF.
- Panel `/admin` con tabla de leads, métricas y generador de enlaces.
- Copy reescrito para un decisor no técnico (**Juan lo rechazó: quedó plano y sin tensión.
  Pendiente de rehacer con el número mandando desde el primer pantallazo**).
- Aviso de privacidad.
- Envío de leads por correo (`src/lib/lead-notify.ts`, server function `notifyLead`).
  Se dispara al abrir la bóveda y al confirmar cita, manda a juancamilo@cupperlab.com
  vía Resend. Sin `RESEND_API_KEY` en el servidor, no manda nada: solo deja un
  `console.warn` con el lead. `syncLead()` sigue escribiendo en localStorage además
  (sirve para probar `/admin` en el propio navegador), pero ya no es la única vía.
- Validación de `/admin` movida a servidor (`src/lib/admin-auth.ts`). El código ya no
  vive en el bundle del cliente; el servidor lo compara contra `ADMIN_ACCESS_CODE` y
  guarda la sesión en una cookie firmada (`ADMIN_SESSION_SECRET`). Sin esas dos
  variables de entorno, cae a un valor de desarrollo (`IPVAULT-DEMO`) que solo vive en
  el bundle del servidor, nunca en el del cliente (verificado con build + grep sobre
  `.output/public`).

Abierto:
- **Las dos cosas de arriba necesitan las variables de entorno puestas en el servidor
  de producción** (`RESEND_API_KEY`, `LEAD_NOTIFY_FROM` opcional, `ADMIN_ACCESS_CODE`,
  `ADMIN_SESSION_SECRET`) para dejar de depender de los valores de desarrollo. Sigue
  sin decidirse el despliegue (Lovable Cloud vs. salir a Cloudflare directo), así que
  sigue sin decidirse dónde se ponen esas variables.
- Badge «Edit with Lovable» visible en producción, con el ID del proyecto.
- Cero tracking. No se sabe quién abre cada enlace de outbound.
- El dominio `*.lovable.app` contradice el discurso. Debería acabar en cupperlab.com.
- Falta razón social, NIF y domicilio en el aviso de privacidad.

## Tono

Castellano de España, tuteo, para alguien que firma facturas y no sabe de tecnología.
Sin jerga («TCO», «soberanía tecnológica», «stack» fuera de la página). Sin raya larga.
Sin la figura «no es X, sino Y». Cifras sin redondear. Cero humor.
