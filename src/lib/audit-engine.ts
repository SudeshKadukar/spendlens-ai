import { PRICING_DATA, ToolName, UseCase } from "./pricing-data";

export type ToolInput = {
  tool: ToolName;
  plan: string;
  seats: number;
  monthlySpend: number;
};

export type AuditInput = {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
};

export type ToolAuditResult = {
  tool: ToolName;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
};

export type AuditResult = {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  isAlreadyOptimized: boolean;
  results: ToolAuditResult[];
};

function getPlanPrice(tool: ToolName, plan: string) {
  return PRICING_DATA[tool].find((p) => p.plan === plan);
}

function calculateExpectedSpend(tool: ToolName, plan: string, seats: number) {
  const planData = getPlanPrice(tool, plan);

  if (!planData) {
    return 0;
  }

  if (planData.perSeat) {
    return planData.monthlyPrice * seats;
  }

  return 0;
}

function findCheaperPlan(tool: ToolName, currentPlan: string, seats: number) {
  const plans = PRICING_DATA[tool];
  const current = getPlanPrice(tool, currentPlan);

  if (!current) return null;

  const cheaperPlans = plans
    .filter((plan) => plan.monthlyPrice < current.monthlyPrice)
    .filter((plan) => plan.monthlyPrice > 0)
    .sort((a, b) => b.monthlyPrice - a.monthlyPrice);

  if (cheaperPlans.length === 0) return null;

  const bestPlan = cheaperPlans[0];

  return {
    plan: bestPlan.plan,
    expectedSpend: bestPlan.perSeat
      ? bestPlan.monthlyPrice * seats
      : bestPlan.monthlyPrice,
  };
}

function auditSingleTool(input: ToolInput, teamSize: number, useCase: UseCase): ToolAuditResult {
  const expectedSpend = calculateExpectedSpend(input.tool, input.plan, input.seats);
  let recommendedPlan = input.plan;
  let recommendedSpend = input.monthlySpend;
  let recommendedAction = "Keep current plan";
  let reason = "Your current setup looks reasonable for your team size and use case.";

  const cheaperPlan = findCheaperPlan(input.tool, input.plan, input.seats);

  // Rule 3: Expensive API direct usage for light use cases
  if (
    input.plan === "API direct" &&
    input.monthlySpend > 100 &&
    ["writing", "research", "mixed"].includes(useCase)
  ) {
    recommendedPlan = "Fixed subscription";
    recommendedSpend = 30;
    recommendedAction = "Consider a fixed monthly subscription";
    reason = "For light writing, research, or mixed usage, a fixed subscription may be cheaper and more predictable than API-based billing.";
  }

  // Rule 4: Very high Gemini Ultra spend for small teams
  else if (input.tool === "Gemini" && input.plan === "Ultra" && teamSize <= 3) {
    recommendedPlan = "Pro";
    recommendedSpend = 20 * input.seats;
    recommendedAction = "Downgrade to Gemini Pro";
    reason = "Gemini Ultra is expensive for a small team unless you need its highest-tier capabilities every day.";
  }

  // Rule 5: v0 Team/Business overkill for solo users
  else if (input.tool === "v0" && teamSize === 1 && ["Team", "Business"].includes(input.plan)) {
    recommendedPlan = "Premium";
    recommendedSpend = 20;
    recommendedAction = "Downgrade to v0 Premium";
    reason = "For a solo builder, v0 Premium is usually enough before upgrading to a team or business plan.";
  }

  // Rule 1: Team/Business/Enterprise is usually overkill for very small teams
  else if (
    teamSize <= 2 &&
    ["Team", "Business", "Enterprise", "Max", "Ultra"].includes(input.plan) &&
    cheaperPlan
  ) {
    recommendedPlan = cheaperPlan.plan;
    recommendedSpend = cheaperPlan.expectedSpend;
    recommendedAction = `Downgrade to ${cheaperPlan.plan}`;
    reason = `For a ${teamSize}-person team, ${input.plan} may be more than you need. ${cheaperPlan.plan} is likely enough for your current workflow.`;
  }

  // Rule 2: User is paying much more than official listed pricing
  else if (expectedSpend > 0 && input.monthlySpend > expectedSpend * 1.25) {
    recommendedPlan = input.plan;
    recommendedSpend = expectedSpend;
    recommendedAction = "Review billing and seat usage";
    reason = `Your reported spend is higher than the expected listed price for ${input.seats} seat(s). You may have unused seats, add-ons, or billing mismatch.`;
  }

  const monthlySavings = Math.max(0, input.monthlySpend - recommendedSpend);

  return {
    tool: input.tool,
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    recommendedAction,
    recommendedPlan,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const results = input.tools.map((tool) =>
    auditSingleTool(tool, input.teamSize, input.useCase)
  );

  const totalMonthlySpend = input.tools.reduce(
    (sum, tool) => sum + tool.monthlySpend,
    0
  );

  const totalMonthlySavings = results.reduce(
    (sum, result) => sum + result.monthlySavings,
    0
  );

  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings: totalMonthlySavings > 500,
    isAlreadyOptimized: totalMonthlySavings < 100,
    results,
  };
}
