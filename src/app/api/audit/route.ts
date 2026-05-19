import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import type { UseCase } from "@/lib/pricing-data";
import { generateSummary } from "@/lib/llm-summary";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamSize, useCase, tools } = body;

    if (!teamSize || !useCase || !tools?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const mappedTools = tools.map((t: { name: string; plan: string; seats: number; monthlySpend: number }) => ({
      tool: t.name,
      plan: t.plan,
      seats: Number(t.seats) || 1,
      monthlySpend: Number(t.monthlySpend) || 0,
    }));

    const result = runAudit({
      teamSize: Number(teamSize) || 1,
      useCase: String(useCase).toLowerCase() as UseCase,
      tools: mappedTools,
    });

    const summary = await generateSummary(result);
    const publicId = uuidv4().replace(/-/g, "").substring(0, 10);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from("audits").insert({
        public_id: publicId,
        team_size: teamSize,
        use_case: useCase,
        tools: JSON.stringify(tools),
        recommendations: JSON.stringify(result.results),
        total_monthly_spend: result.totalMonthlySpend,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        summary,
      });

      if (error) {
        console.error("Error saving audit to Supabase:", error);
      }
    }

    return NextResponse.json({
      result: { ...result, summary },
      publicId,
    });
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
