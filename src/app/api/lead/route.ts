import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAuditConfirmationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      companyName,
      role,
      teamSize,
      publicId,
      monthlySavings,
      isHighSavings,
      honeypot,
    } = body;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from("leads").insert({
        audit_public_id: publicId,
        email,
        company_name: companyName,
        role,
        team_size: teamSize,
        monthly_savings: monthlySavings,
        is_high_savings: isHighSavings,
      });

      if (error) {
        console.error("Error saving lead to Supabase:", error);
        return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
      }
    }

    if (publicId) {
      await sendAuditConfirmationEmail(
        email,
        publicId,
        Number(monthlySavings) || 0
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
