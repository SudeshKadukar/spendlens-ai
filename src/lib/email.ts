export async function sendAuditConfirmationEmail(
  email: string,
  publicId: string,
  monthlySavings: number
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "SpendLens AI <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email");
    return false;
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const reportUrl = `${appUrl}/results/${publicId}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your SpendLens AI audit report",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
          <h1 style="color: #1e293b;">Your AI spend audit is ready</h1>
          <p>We found up to <strong>$${monthlySavings.toFixed(2)}/month</strong> in potential savings.</p>
          <p><a href="${reportUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">View full report</a></p>
          <p style="color:#64748b;font-size:14px;">Share this link with your team: ${reportUrl}</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    console.error("Resend error:", await res.text());
    return false;
  }

  return true;
}
