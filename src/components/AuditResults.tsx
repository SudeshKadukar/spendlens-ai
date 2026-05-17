import { AuditResult } from '../lib/types';
import LeadCapture from './LeadCapture';

interface AuditResultsProps {
  result: any;
  publicId: string;
  teamSize?: number;
  onReset: () => void;
}

export default function AuditResults({ result, publicId, teamSize, onReset }: AuditResultsProps) {
  const isHighSavings = result.totalMonthlySavings > 500;
  const isLowSavings = result.totalMonthlySavings < 100;

  const recommendationsList = result.results || result.recommendations || [];

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Your Audit Results</h2>
        <p className="text-slate-400">We analyzed your stack and found potential savings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-slate-400 font-medium mb-1 relative z-10">Monthly Savings</p>
          <p className="text-4xl md:text-5xl font-extrabold text-blue-400 relative z-10">
            ${result.totalMonthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-slate-400 font-medium mb-1 relative z-10">Annual Savings</p>
          <p className="text-4xl md:text-5xl font-extrabold text-emerald-400 relative z-10">
            ${result.totalAnnualSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mb-10 space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-white">Tool-by-Tool Recommendations</h3>
        {recommendationsList.map((rec: any, index: number) => {
          const toolName = rec.tool || rec.toolName;
          const action = rec.recommendedAction || rec.action;
          const message = rec.reason || rec.message;
          const monthlySavings = rec.monthlySavings !== undefined ? rec.monthlySavings : rec.potentialMonthlySavings;
          const toolId = rec.toolId || `${toolName}-${index}`;

          const actionLower = action.toLowerCase();
          const isKeep = actionLower.includes('keep');
          const isDowngrade = actionLower.includes('downgrade') || actionLower.includes('consider');
          const isReview = actionLower.includes('review');

          return (
            <div key={toolId} className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg text-white">{toolName}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    isKeep ? 'bg-slate-700 text-slate-300' : 
                    isDowngrade ? 'bg-orange-900/50 text-orange-400 border border-orange-800/50' :
                    isReview ? 'bg-purple-900/50 text-purple-400 border border-purple-800/50' :
                    'bg-blue-900/50 text-blue-400 border border-blue-800/50'
                  }`}>
                    {action}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">{message}</p>
              </div>
              {monthlySavings > 0 && (
                <div className="text-right shrink-0">
                  <span className="text-emerald-400 font-bold block">+${monthlySavings}/mo</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isHighSavings && (
        <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-emerald-500/30 p-6 rounded-xl text-center mb-8">
          <h4 className="text-xl font-bold text-emerald-400 mb-2">High Savings Detected!</h4>
          <p className="text-slate-300 mb-4 text-sm max-w-lg mx-auto">
            You are leaving over $500/month on the table. Our partner Credex specializes in capturing these specific savings for startups.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Get a free consultation with Credex
          </button>
        </div>
      )}

      {isLowSavings && result.totalMonthlySavings > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl text-center mb-8 border border-slate-700">
          <h4 className="text-lg font-semibold text-slate-200 mb-2">You&apos;re doing great!</h4>
          <p className="text-slate-400 text-sm">
            Your spending is relatively well-optimized. Implementing the small changes above can save you a bit, but there are no major red flags.
          </p>
        </div>
      )}

      {result.totalMonthlySavings === 0 && (
        <div className="bg-slate-800 p-6 rounded-xl text-center mb-8 border border-slate-700">
          <h4 className="text-lg font-semibold text-slate-200 mb-2">Perfect Score!</h4>
          <p className="text-slate-400 text-sm">
            Your AI tool stack is perfectly optimized based on our current data. Keep it up!
          </p>
        </div>
      )}

      <LeadCapture 
        publicId={publicId} 
        monthlySavings={result.totalMonthlySavings} 
        isHighSavings={isHighSavings} 
        teamSize={teamSize} 
      />

      <div className="flex justify-center mt-8 pt-6 border-t border-slate-800">
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Audit another stack
        </button>
      </div>
    </div>
  );
}
