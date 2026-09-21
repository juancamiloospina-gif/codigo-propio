// Fuente de verdad única para la identidad legal de la empresa. La lee
// PrivacyNotice (y cualquier otro sitio que necesite estos datos en el
// futuro) en vez de tenerlos repetidos y sueltos por el código.
//
// name usa un valor por defecto porque "Cupperlab" ya aparece sin más en
// el resto de la página (contrato de cesión de IP, branding). taxId y
// address NO tienen un valor por defecto que parezca un dato real: sin
// COMPANY_NIF / COMPANY_ADDRESS configuradas, quedan marcadas como
// pendientes explícitamente, y PrivacyNotice las omite en vez de mostrar
// un NIF o una dirección inventados. Rellénalas con los datos registrales
// reales antes de publicar el enlace a un prospecto real.
export const COMPANY_CONFIG = {
  name: process.env["COMPANY_LEGAL_NAME"] || "Cupperlab S.A.S.",
  taxId: process.env["COMPANY_NIF"] || "[NIF/CIF Pendiente de Configuración]",
  address: process.env["COMPANY_ADDRESS"] || "[Domicilio Social Pendiente de Configuración]",
  contactEmail: process.env["LEAD_NOTIFY_TO"] || "juancamilo@cupperlab.com",
};
