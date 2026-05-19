import { describe, it, expect } from "vitest";
import { PRICING_DATA } from "../lib/pricing-data";

const REQUIRED_TOOLS = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API direct",
  "OpenAI API direct",
  "Gemini",
  "v0",
] as const;

describe("pricing-data", () => {
  it("includes all required tools", () => {
    for (const tool of REQUIRED_TOOLS) {
      expect(PRICING_DATA[tool]).toBeDefined();
      expect(PRICING_DATA[tool].length).toBeGreaterThan(0);
    }
  });

  it("ChatGPT Plus is $20 per seat", () => {
    const plus = PRICING_DATA.ChatGPT.find((p) => p.plan === "Plus");
    expect(plus?.monthlyPrice).toBe(20);
    expect(plus?.perSeat).toBe(true);
  });

  it("API direct plans are not per-seat", () => {
    const openai = PRICING_DATA["OpenAI API direct"].find((p) => p.plan === "API direct");
    expect(openai?.perSeat).toBe(false);
  });
});
