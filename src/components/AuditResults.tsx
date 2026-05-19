import type { AuditResult } from "@/lib/audit-engine";
import LeadCapture from "./LeadCapture";
import SavingsHero from "./savings-hero";
import CredexCta from "./credex-cta";
import ShareCard from "./share-card";
import SummaryBox from "./summary-box";
import { formatUsd } from "@/lib/utils";

interface AuditResultsProps {
  result: AuditResult & { summary?: string };
  publicId: string;
  teamSize?: number;
  onReset?: () => void;
  showShare?: boolean;
}

export default function AuditResults({
  result,
  publicId,
  teamSize,
  onReset,
  showShare = true,
}: AuditResultsProps) {
  const isHighSavings = result.isHighSavings;
  const recommendationsList = result.results;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl">
      <SavingsHero result={result} />

      {result.summary && <SummaryBox summary={result.summary} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
          <p className="text-slate-400 font-medium mb-1">Monthly savings</p>
          <p className="text-4xl md:text-5xl font-extrabold text-blue-400">
            ${formatUsd(result.totalMonthlySavings)}
          </p>
        </div>
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
          <p className="text-slate-400 font-medium mb-1">Annual savings</p>
          <p className="text-4xl md:text-5xl font-extrabold text-emerald-400">
            ${formatUsd(result.totalAnnualSavings)}
          </p>
        </div>
      </div>

      <div className="mb-10 space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-white">
          Tool-by-tool recommendations
        </h3>
        {recommendationsList.map((rec, index) => {
          const isKeep = rec.recommendedAction.toLowerCase().includes("keep");
          const isDowngrade =
            rec.recommendedAction.toLowerCase().includes("downgrade") ||
            rec.recommendedAction.toLowerCase().includes("consider");
          const isReview = rec.recommendedAction.toLowerCase().includes("review");

          return (
            <div
              key={`${rec.tool}-${index}`}
              className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-white">{rec.tool}</span>
                    <span className="text-slate-500 text-sm">
                      {rec.currentPlan} · ${formatUsd(rec.currentSpend)}/mo
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isKeep
                          ? "bg-slate-700 text-slate-300"
                          : isDowngrade
                            ? "bg-orange-900/50 text-orange-400 border border-orange-800/50"
                            : isReview
                              ? "bg-purple-900/50 text-purple-400 border border-purple-800/50"
                              : "bg-blue-900/50 text-blue-400 border border-blue-800/50"
                      }`}
                    >
                      {rec.recommendedAction}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{rec.reason}</p>
                  {rec.monthlySavings > 0 && (
                    <p className="text-emerald-400 text-sm font-semibold mt-2">
                      Savings: ${formatUsd(rec.monthlySavings)}/month ($
                      {formatUsd(rec.annualSavings)}/year)
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isHighSavings && (
        <CredexCta
          monthlySavings={result.totalMonthlySavings}
          annualSavings={result.totalAnnualSavings}
        />
      )}

      {showShare && <ShareCard publicId={publicId} />}

      <LeadCapture
        publicId={publicId}
        monthlySavings={result.totalMonthlySavings}
        isHighSavings={isHighSavings}
        teamSize={teamSize}
      />

      {onReset && (
        <div className="flex justify-center mt-8 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={onReset}
            className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Audit another stack
          </button>
        </div>
      )}
    </div>
  );
}
