import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

// Ninguna de estas dos constantes llega al bundle del cliente: createServerFn extrae
// el cuerpo de .handler() a una función que solo corre en el servidor y lo sustituye,
// en el código que se envía al navegador, por una llamada RPC.
//
// Los valores de aquí abajo son solo para que /admin funcione en local sin configurar
// nada. En producción hace falta fijar ADMIN_ACCESS_CODE y ADMIN_SESSION_SECRET como
// variables de entorno del servidor (ver CLAUDE.md, "Lovable no inyecta secretos...").
const DEV_FALLBACK_ACCESS_CODE = "IPVAULT-DEMO";
const DEV_FALLBACK_SESSION_SECRET = "ip-vault-dev-only-session-secret-do-not-deploy-32c";

function adminSession() {
  // No es un hook de React: es el helper de sesión de servidor de TanStack Start,
  // que solo corre dentro de un server function.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<{ authorized?: boolean }>({
    password: process.env["ADMIN_SESSION_SECRET"] ?? DEV_FALLBACK_SESSION_SECRET,
    name: "ip-vault-admin",
    maxAge: 60 * 60 * 12,
    cookie: { secure: true, sameSite: "lax" },
  });
}

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await adminSession();
  return { authorized: Boolean(session.data.authorized) };
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .validator(z.object({ code: z.string().trim().min(1).max(64) }))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_ACCESS_CODE"] ?? DEV_FALLBACK_ACCESS_CODE;
    if (data.code.toUpperCase() !== expected.toUpperCase()) {
      return { authorized: false as const };
    }
    const session = await adminSession();
    await session.update({ authorized: true });
    return { authorized: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  await session.clear();
  return { authorized: false as const };
});
