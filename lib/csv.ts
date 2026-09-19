import type { CountRecord } from "./types";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsv(count: CountRecord): string {
  const rows: string[] = [];

  if (count.orgName) {
    rows.push(`Church/Organization,${escapeCsvField(count.orgName)}`);
  }
  if (count.serviceName) {
    rows.push(`Service,${escapeCsvField(count.serviceName)}`);
  }
  rows.push(`Date,${new Date(count.createdAt).toISOString().slice(0, 10)}`);
  rows.push("");
  rows.push("Denomination,Quantity,Subtotal");
  for (const line of count.denominations) {
    rows.push(`${line.value},${line.qty},${line.subtotal}`);
  }
  rows.push(`Total,,${count.total}`);

  return rows.join("\n");
}

export function downloadCsv(count: CountRecord, filename: string): void {
  const csv = buildCsv(count);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
