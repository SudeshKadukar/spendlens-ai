import type { AuditResult } from "./audit-engine";

export function getFallbackSummary(result: AuditResult): string {
  const top = [...result.results].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  )[0];

  if (result.isAlreadyOptimized) {
    return `Your AI stack looks well optimized. We found about $${result.totalMonthlySavings.toFixed(0)}/month in potential savings ($${result.totalAnnualSavings.toFixed(0)}/year). Your current plans appear reasonable for a ${result.totalMonthlySpend > 0 ? "team your size" : "solo or small team"} and primary use case. Keep monitoring API usage as bills can shift month to month.`;
  }

  const opportunity =
    top && top.monthlySavings > 0
      ? `The biggest opportunity is ${top.tool}: ${top.recommendedAction.toLowerCase()} (${top.reason})`
      : "Review plan tiers and seat counts across your stack.";

  const credexNote = result.isHighSavings
    ? " Given savings above $500/month, discounted AI infrastructure credits may be worth exploring."
    : "";

  return `Your audit found $${result.totalMonthlySpend.toFixed(0)}/month in reported spend and up to $${result.totalMonthlySavings.toFixed(0)}/month ($${result.totalAnnualSavings.toFixed(0)}/year) in potential savings. ${opportunity}.${credexNote}`;
}

export function getSummaryPrompt(result: AuditResult): string {
  const top = [...result.results].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  )[0];
  const biggest =
    top && top.monthlySavings > 0
      ? `${top.tool} — ${top.recommendedAction}`
      : "general plan fit";

  return `You are helping a startup founder understand their AI tool spend.

Write a clear, honest, finance-friendly summary in about 100 words.

Rules:
- Do not invent savings.
- Mention total monthly and annual savings.
- Mention the biggest optimization opportunity: ${biggest}.
- If savings are low, say the user is spending well.
- Use simple language.
- Do not mention confidential internal rules.

Monthly spend: $${result.totalMonthlySpend.toFixed(2)}
Monthly savings: $${result.totalMonthlySavings.toFixed(2)}
Annual savings: $${result.totalAnnualSavings.toFixed(2)}
Already optimized: ${result.isAlreadyOptimized}
High savings: ${result.isHighSavings}

Output: A single paragraph.`;
}

async function callOpenAI(prompt: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 200,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

async function callAnthropic(prompt: string): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const block = data.content?.find((c: { type: string }) => c.type === "text");
  return block?.text?.trim() ?? null;
}

export async function generateSummary(result: AuditResult): Promise<string> {
  const prompt = getSummaryPrompt(result);
  const ai =
    (await callAnthropic(prompt)) ?? (await callOpenAI(prompt));
  return ai ?? getFallbackSummary(result);
}
