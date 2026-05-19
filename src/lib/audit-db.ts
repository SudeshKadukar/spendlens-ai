import type { AuditResult } from "./audit-engine";
import type { StoredAuditRow } from "./types";

export function rowToAuditResult(row: StoredAuditRow): AuditResult & { summary?: string } {
  const recommendations =
    typeof row.recommendations === "string"
      ? JSON.parse(row.recommendations)
      : row.recommendations;

  return {
    totalMonthlySpend: Number(row.total_monthly_spend),
    totalMonthlySavings: Number(row.total_monthly_savings),
    totalAnnualSavings: Number(row.total_annual_savings),
    isHighSavings: Number(row.total_monthly_savings) > 500,
    isAlreadyOptimized: Number(row.total_monthly_savings) < 100,
    results: recommendations,
    summary: row.summary ?? undefined,
  };
}
