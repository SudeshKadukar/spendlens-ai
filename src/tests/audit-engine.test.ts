import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/audit-engine";

describe("Rule-based AI Spend Audit Engine", () => {
  it("Scenario 1: Solo coding user with ChatGPT Plus is already optimized", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "coding",
      tools: [
        {
          tool: "ChatGPT",
          plan: "Plus",
          seats: 1,
          monthlySpend: 20,
        },
      ],
    });

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
    expect(result.isAlreadyOptimized).toBe(true);
    expect(result.isHighSavings).toBe(false);
    expect(result.results[0].recommendedAction).toBe("Keep current plan");
    expect(result.results[0].reason).toContain("Your current setup looks reasonable");
  });

  it("Rule 1: Downgrade ChatGPT Team/Enterprise to Plus for small teams (<=2)", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "coding",
      tools: [
        {
          tool: "ChatGPT",
          plan: "Team",
          seats: 1,
          monthlySpend: 30,
        },
      ],
    });

    // ChatGPT Team is $30, Plus is $20. Savings: $10.
    expect(result.totalMonthlySavings).toBe(10);
    expect(result.results[0].recommendedPlan).toBe("Plus");
    expect(result.results[0].recommendedAction).toBe("Downgrade to Plus");
    expect(result.results[0].reason).toContain("more than you need");
  });

  it("Rule 2: Detects billing/seat mismatches (reported spend > expected * 1.25)", () => {
    const result = runAudit({
      teamSize: 5,
      useCase: "coding",
      tools: [
        {
          tool: "Cursor",
          plan: "Pro",
          seats: 2,
          monthlySpend: 100, // Expected: 20 * 2 = 40. 100 > 40 * 1.25 (50).
        },
      ],
    });

    expect(result.totalMonthlySavings).toBe(60); // 100 - 40
    expect(result.results[0].recommendedPlan).toBe("Pro");
    expect(result.results[0].recommendedAction).toBe("Review billing and seat usage");
    expect(result.results[0].reason).toContain("reported spend is higher than the expected");
  });

  it("Rule 3: Expensive API direct usage for light use cases", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "writing",
      tools: [
        {
          tool: "OpenAI API direct",
          plan: "API direct",
          seats: 1,
          monthlySpend: 150, // > 100
        },
      ],
    });

    expect(result.totalMonthlySavings).toBe(120); // 150 - 30
    expect(result.results[0].recommendedPlan).toBe("Fixed subscription");
    expect(result.results[0].recommendedAction).toBe("Consider a fixed monthly subscription");
    expect(result.results[0].reason).toContain("fixed subscription may be cheaper");
  });

  it("Rule 4: Very high Gemini Ultra spend for small teams", () => {
    const result = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [
        {
          tool: "Gemini",
          plan: "Ultra",
          seats: 2,
          monthlySpend: 500, // 250 * 2
        },
      ],
    });

    // Pro plan is 20 * 2 = 40. Savings = 460
    expect(result.totalMonthlySavings).toBe(460);
    expect(result.results[0].recommendedPlan).toBe("Pro");
    expect(result.results[0].recommendedAction).toBe("Downgrade to Gemini Pro");
  });

  it("Rule 5: v0 Team/Business overkill for solo users", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "coding",
      tools: [
        {
          tool: "v0",
          plan: "Team",
          seats: 1,
          monthlySpend: 30,
        },
      ],
    });

    expect(result.totalMonthlySavings).toBe(10); // 30 - 20 (Premium)
    expect(result.results[0].recommendedPlan).toBe("Premium");
    expect(result.results[0].recommendedAction).toBe("Downgrade to v0 Premium");
  });
});
