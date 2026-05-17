import { v4 as uuidv4 } from 'uuid';
import { AuditInput, AuditResult, Recommendation, ToolInput, ToolName } from './types';
import { TOOL_PRICING } from './pricing';

const isCodingTool = (name: ToolName) => ['Cursor', 'GitHub Copilot', 'Windsurf', 'v0'].includes(name);
const isApiTool = (name: ToolName) => ['OpenAI API', 'Anthropic API', 'OpenAI API direct', 'Anthropic API direct'].includes(name);

export function runAudit(input: AuditInput): AuditResult {
  let totalMonthlySpend = 0;
  let totalMonthlySavings = 0;
  const recommendations: Recommendation[] = [];

  const codingTools: ToolInput[] = [];
  let apiSpend = 0;

  for (const tool of input.tools) {
    totalMonthlySpend += tool.monthlySpend;

    if (isCodingTool(tool.name)) codingTools.push(tool);
    if (isApiTool(tool.name)) apiSpend += tool.monthlySpend;

    let savings = 0;
    let action: Recommendation['action'] = 'Keep';
    let message = 'You are spending optimally on this tool.';

    const expectedPrice = TOOL_PRICING[tool.name]?.[tool.plan];
    
    // 1. Check for basic overspending (paying more than listed price * seats)
    if (expectedPrice !== undefined) {
      const expectedTotal = expectedPrice * tool.seats;
      if (tool.monthlySpend > expectedTotal) {
        savings += (tool.monthlySpend - expectedTotal);
        action = 'Downgrade';
        message = `You are paying $${tool.monthlySpend} but the expected price for ${tool.seats} seats on ${tool.plan} is $${expectedTotal}.`;
      }
    }

    // 2. Check for downgrade opportunity for small teams on expensive plans
    if (input.teamSize <= 5 && ['Business', 'Enterprise', 'Team'].includes(tool.plan)) {
      // Suggest Pro instead
      const proPrice = TOOL_PRICING[tool.name]?.['Pro'] || TOOL_PRICING[tool.name]?.['Individual'] || TOOL_PRICING[tool.name]?.['Plus'];
      if (proPrice !== undefined) {
        const potentialNewTotal = proPrice * tool.seats;
        // Only suggest if it actually saves money
        if (tool.monthlySpend > potentialNewTotal) {
          const downgradeSavings = tool.monthlySpend - potentialNewTotal;
          if (downgradeSavings > savings) {
            savings = downgradeSavings;
            action = 'Downgrade';
            message = `For a team of ${input.teamSize}, a Pro/Individual plan is usually sufficient and saves money compared to ${tool.plan}.`;
          }
        }
      }
    }

    if (savings > 0 || action !== 'Keep') {
      recommendations.push({
        toolId: tool.id,
        toolName: tool.name,
        action,
        message,
        potentialMonthlySavings: savings
      });
      totalMonthlySavings += savings;
    } else {
      recommendations.push({
        toolId: tool.id,
        toolName: tool.name,
        action: 'Keep',
        message: 'Your spending is optimal for this tool.',
        potentialMonthlySavings: 0
      });
    }
  }

  // 3. Consolidate coding tools
  if (codingTools.length > 1 && input.useCase === 'Coding') {
    // Find the most expensive coding tools to recommend dropping
    const sortedCodingTools = [...codingTools].sort((a, b) => b.monthlySpend - a.monthlySpend);
    // Keep the most expensive one (assume it's the primary), drop the rest
    for (let i = 1; i < sortedCodingTools.length; i++) {
      const toolToDrop = sortedCodingTools[i];
      const existingRecIndex = recommendations.findIndex(r => r.toolId === toolToDrop.id);
      
      const consolidateSavings = toolToDrop.monthlySpend;
      
      const newRec: Recommendation = {
        toolId: toolToDrop.id,
        toolName: toolToDrop.name,
        action: 'Consolidate',
        message: `You have multiple coding tools. Consolidating to a single tool can save $${consolidateSavings}/mo.`,
        potentialMonthlySavings: consolidateSavings
      };

      if (existingRecIndex >= 0) {
        // Replace if consolidate savings are better
        if (consolidateSavings > recommendations[existingRecIndex].potentialMonthlySavings) {
          totalMonthlySavings = totalMonthlySavings - recommendations[existingRecIndex].potentialMonthlySavings + consolidateSavings;
          recommendations[existingRecIndex] = newRec;
        }
      } else {
        recommendations.push(newRec);
        totalMonthlySavings += consolidateSavings;
      }
    }
  }

  // 4. API spend recommendation
  if (apiSpend > 100) {
    const apiSavings = apiSpend * 0.15; // Assume 15% savings with credits
    const hasAnthropic = input.tools.some(t => t.name.includes('Anthropic'));
    const apiToolName: ToolName = hasAnthropic ? 'Anthropic API direct' : 'OpenAI API direct';
    
    recommendations.push({
      toolId: uuidv4(),
      toolName: apiToolName,
      action: 'Optimize API',
      message: `Your API spend is high ($${apiSpend}/mo). You could save ~15% by purchasing discounted compute credits.`,
      potentialMonthlySavings: apiSavings
    });
    totalMonthlySavings += apiSavings;
  }

  return {
    id: uuidv4(),
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    recommendations,
    summary: 'Pending AI summary...'
  };
}
