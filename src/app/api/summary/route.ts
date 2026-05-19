import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSummary } from "@/lib/llm-summary";
import type { AuditResult } from "@/lib/audit-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicId, result }: { publicId: string; result: AuditResult } = body;

    if (!publicId || !result) {
      return NextResponse.json({ error: "Missing publicId or result" }, { status: 400 });
    }

    const summaryText = await generateSummary(result);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase
        .from("audits")
        .update({ summary: summaryText })
        .eq("public_id", publicId);

      if (error) {
        console.error("Error updating summary in Supabase:", error);
      }
    }

    return NextResponse.json({ summary: summaryText });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
