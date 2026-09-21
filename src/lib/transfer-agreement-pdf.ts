function ascii(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "");
}

function escapePdf(value: string) {
  return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(value: string, width = 84) {
  const words = ascii(value).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > width) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}

function text(lines: string[], x: number, y: number, size: number, leading: number, bold = false) {
  return [
    "BT",
    `/${bold ? "F2" : "F1"} ${size} Tf`,
    `${leading} TL`,
    `${x} ${y} Td`,
    ...lines
      .flatMap((line, index) => [index ? "T*" : "", `(${escapePdf(line)}) Tj`])
      .filter(Boolean),
    "ET",
  ].join("\n");
}

export function createTransferAgreementPdf(company: string, domain: string) {
  const issueDate = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const clauses = [
    `1. TRANSFERENCIA TOTAL. La Agencia transfiere a ${company} el cien por ciento (100%) de los derechos patrimoniales sobre el codigo fuente, documentacion, configuraciones y activos tecnicos producidos dentro del proyecto.`,
    `2. AUSENCIA DE ROYALTIES. La Agencia renuncia de forma irrevocable a exigir licencias, regalias, royalties o pagos recurrentes por el uso, modificacion, despliegue o comercializacion del software entregado.`,
    `3. ENTREGA SOBERANA. La entrega incluye repositorio Git, historial, llaves de cifrado, variables de configuracion y despliegue directo en la cuenta Cloud del Cliente, compatible con AWS, Google Cloud o Microsoft Azure.`,
  ];
  let cursor = 610;
  const content: string[] = [
    "0.04 0.08 0.12 rg 0 0 595 842 re f",
    "0.06 0.72 0.55 RG 48 786 m 547 786 l S",
    "0.88 0.95 0.95 rg",
    text(["IP VAULT / GARANTIA DE PROPIEDAD INTELECTUAL"], 48, 752, 10, 14, true),
    text(["BORRADOR DE ACUERDO DE TRANSFERENCIA DE IP"], 48, 716, 18, 22, true),
    text(
      [`Cliente: ${company}`, `Dominio: ${domain || "No especificado"}`, `Fecha: ${issueDate}`],
      48,
      680,
      10,
      16,
    ),
  ];
  for (const clause of clauses) {
    const lines = wrap(clause);
    content.push(
      "0.10 0.14 0.18 rg 44 " +
        (cursor - lines.length * 15 - 18) +
        " 507 " +
        (lines.length * 15 + 30) +
        " re f",
    );
    content.push("0.88 0.95 0.95 rg");
    content.push(text(lines, 58, cursor, 10, 15));
    cursor -= lines.length * 15 + 50;
  }
  content.push("0.62 0.70 0.72 rg");
  content.push(
    text(
      ["DOCUMENTO DE TRABAJO - SUJETO A REVISION LEGAL Y FIRMA DE LAS PARTES"],
      48,
      76,
      8,
      10,
      true,
    ),
  );
  content.push(text(["IP Vault / Protocolo de soberania tecnologica"], 48, 52, 8, 10));
  const stream = content.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n%IPVAULT\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

export function downloadTransferAgreement(company: string, domain: string) {
  const bytes = createTransferAgreementPdf(company, domain);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${
    ascii(company)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") || "ip-vault"
  }-acuerdo-transferencia-ip.pdf`;
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
