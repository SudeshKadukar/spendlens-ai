import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AuditResults from "@/components/AuditResults";
import { rowToAuditResult } from "@/lib/audit-db";
import type { StoredAuditRow } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let savings = 0;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await supabase
      .from("audits")
      .select("total_monthly_savings")
      .eq("public_id", id)
      .single();
    if (data) savings = Number(data.total_monthly_savings);
  }

  const savingsText =
    savings > 0
      ? `Found $${savings.toFixed(0)}/month in potential AI tool savings.`
      : "AI spend audit results from SpendLens.";

  return {
    title: `AI Spend Audit | SpendLens`,
    description: savingsText,
    openGraph: {
      title: "My AI Spend Audit — SpendLens",
      description: savingsText,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "My AI Spend Audit",
      description: savingsText,
    },
  };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: publicId } = await params;
  let auditData: StoredAuditRow | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("public_id", publicId)
      .single();

    if (data && !error) {
      auditData = data as StoredAuditRow;
    }
  }

  const result = auditData ? rowToAuditResult(auditData) : null;

  return (
    <main className="flex-grow flex flex-col items-center p-8 md:p-24 bg-slate-950 min-h-screen">
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          SpendLens <span className="text-blue-400">AI</span>
        </Link>
        <Link
          href="/audit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Audit your stack
        </Link>
      </div>

      {!result ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-xl w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4">Audit not found</h2>
          <p className="text-slate-400 mb-8">
            We couldn&apos;t find an audit with this ID. Run a new audit from the
            home page.
          </p>
          <Link href="/audit" className="text-blue-400 hover:text-blue-300 underline">
            Start a new audit
          </Link>
        </div>
      ) : (
        <AuditResults
          result={result}
          publicId={publicId}
          teamSize={auditData?.team_size}
          showShare
        />
      )}
    </main>
  );
}
