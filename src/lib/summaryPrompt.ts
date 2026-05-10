import { AuditResult } from './types';

export function getSummaryPrompt(result: AuditResult): string {
  // Find the biggest savings recommendation
  let biggestReason = 'General plan optimization';
  if (result.recommendations.length > 0) {
    const sortedRecs = [...result.recommendations].sort((a, b) => b.potentialMonthlySavings - a.potentialMonthlySavings);
    if (sortedRecs[0].potentialMonthlySavings > 0) {
      biggestReason = `${sortedRecs[0].toolName} (${sortedRecs[0].action.toLowerCase()})`;
    }
  }

  return `Write a personalized AI spend audit summary of approximately 100 words.
Mention the total monthly spend: $${result.totalMonthlySpend.toFixed(2)}.
Mention the potential monthly savings: $${result.totalMonthlySavings.toFixed(2)}.
Mention the potential annual savings: $${result.totalAnnualSavings.toFixed(2)}.
Identify the biggest saving reason: ${biggestReason}.
${result.totalMonthlySavings > 500 ? 'Mention that Credex can help capture these high savings.' : ''}
Do not invent numbers. Do not change audit math.`;
}

export function getFallbackSummary(result: AuditResult): string {
  return `Your AI spend audit found potential monthly savings of $${result.totalMonthlySavings.toFixed(2)} and annual savings of $${result.totalAnnualSavings.toFixed(2)}. The largest opportunities come from plan fit, unused seats, and retail API usage. Based on your team size and primary use case, your stack can likely be optimized without reducing productivity.`;
}
