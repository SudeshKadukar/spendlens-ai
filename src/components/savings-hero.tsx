import type { AuditResult } from "@/lib/audit-engine";
import { formatUsd } from "@/lib/utils";

export default function SavingsHero({ result }: { result: AuditResult }) {
  const isLow = result.isAlreadyOptimized;

  if (isLow) {
    return (
      <div className="text-center mb-10 bg-slate-800 p-8 rounded-xl border border-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          You&apos;re spending well
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          We did not find major waste in your current AI stack. Leave your email
          below and we&apos;ll notify you when new optimization opportunities appear.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
        You could save ${formatUsd(result.totalMonthlySavings)}/month
      </h2>
      <p className="text-xl text-emerald-400 font-semibold">
        That is ${formatUsd(result.totalAnnualSavings)}/year
      </p>
      <p className="text-slate-400 mt-2 text-sm">
        Current reported spend: ${formatUsd(result.totalMonthlySpend)}/month
      </p>
    </div>
  );
}
