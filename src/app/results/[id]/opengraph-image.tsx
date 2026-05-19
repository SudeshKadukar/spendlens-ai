import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "SpendLens AI Audit Result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let monthlySavings = 0;
  let annualSavings = 0;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await supabase
      .from("audits")
      .select("total_monthly_savings, total_annual_savings")
      .eq("public_id", id)
      .single();
    if (data) {
      monthlySavings = Number(data.total_monthly_savings);
      annualSavings = Number(data.total_annual_savings);
    }
  }

  const headline =
    monthlySavings > 0
      ? `Save $${Math.round(monthlySavings)}/month on AI tools`
      : "Your AI stack audit is ready";

  const subline =
    monthlySavings > 0
      ? `$${Math.round(annualSavings).toLocaleString()}/year potential · Cursor, Claude, ChatGPT & more`
      : "SpendLens AI — free AI spend audit for startups";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #020617, #0f172a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <span style={{ fontSize: "48px", fontWeight: "bold" }}>SpendLens</span>
          <span style={{ fontSize: "48px", fontWeight: "bold", color: "#60a5fa", marginLeft: "12px" }}>
            AI
          </span>
        </div>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          {headline}
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          {subline}
        </p>
      </div>
    ),
    { ...size }
  );
}
