import { repository } from "@/lib/repository";

function toCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => `"${cell.replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const filters = {
    q: searchParams.get("q") ?? undefined,
    action: searchParams.get("action") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  };
  const [overview, series, auditLogs] = await Promise.all([
    repository.getOverview(filters),
    repository.getStatsSeries(filters),
    repository.listAuditLogs(filters),
  ]);

  const csv = toCsv([
    ["Section", "Label", "Valeur", "Extra"],
    ...overview.publicStats.map((stat) => ["overview", stat.label, stat.value, stat.trend ?? ""]),
    ...series.map((item) => [
      "series",
      item.name,
      String(item.propositions),
      String(item.signalements),
    ]),
    ...auditLogs.slice(0, 10).map((log) => ["audit", log.action, log.actor, log.resource]),
  ]);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cdc-stats-export.csv"',
    },
  });
}
