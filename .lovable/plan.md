# Plan: Evolución funcional de IP Vault

## Resultado
Convertir IP Vault en una experiencia outbound personalizable por URL, con estado persistente, proyecciones financieras detalladas, captura de prospectos y un prototipo interactivo descargable.

## Implementación
- Validar parámetros `company`, `domain`, `saas`, `users` y `email` desde la URL, normalizarlos y precargar la experiencia sin romper URLs incompletas o inválidas.
- Personalizar el saludo, identidad simulada, dominio, herramientas, usuarios y correo usando los datos del agente outbound.
- Centralizar y persistir durante la sesión el análisis, la simulación, el tema, la vista del prototipo y el prospecto capturado.
- Sustituir el cálculo resumido por un motor TCO explícito: licencias por usuario, desarrollo propio escalable, mantenimiento anual y ahorro acumulado.
- Añadir una gráfica comparativa a cinco años para SaaS frente a código propietario.
- Ampliar el dashboard con cambio de tema, alternancia entre código fuente y vista previa, y descarga de un ZIP de demostración con README.
- Interceptar el acceso a la bóveda con un formulario de nombre, cargo, correo corporativo y teléfono; desbloquearla solo tras una captura válida.
- Mantener la estética cyber-fintech existente y verificar el flujo con parámetros outbound, persistencia, formulario, descarga y vistas responsive.

## Alcance técnico
- Estado React centralizado y almacenamiento de sesión en el navegador.
- Parámetros tipados mediante el sistema de búsqueda de TanStack Router.
- Gráfica con Recharts y ZIP generado en el navegador.
- Sin envío a servicios externos: la captura permanece únicamente en la sesión local.
