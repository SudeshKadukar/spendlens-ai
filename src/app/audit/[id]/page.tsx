import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import AuditResults from '@/components/AuditResults';
import { AuditResult } from '@/lib/types';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `AI Spend Audit Result | SpendLens`,
    description: `I just audited my AI stack and found potential savings. Audit yours for free.`,
    openGraph: {
      title: `AI Audit Result #${id.substring(0, 8)}`,
      description: 'Check out these potential savings on Cursor, Claude, OpenAI, and more.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'My AI Spend Audit Result',
      description: 'Check out these potential savings on Cursor, Claude, OpenAI, and more.',
    }
  };
}

export default async function PublicAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const publicId = id;

  let auditData = null;
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('public_id', publicId)
      .single();
      
    if (data && !error) {
      auditData = data;
    }
  }

  // Fallback for demo when Supabase isn't connected
  const mockResult: AuditResult | null = auditData ? {
    id: auditData.id,
    totalMonthlySpend: Number(auditData.total_monthly_spend),
    totalMonthlySavings: Number(auditData.total_monthly_savings),
    totalAnnualSavings: Number(auditData.total_annual_savings),
    recommendations: typeof auditData.recommendations === 'string' 
      ? JSON.parse(auditData.recommendations) 
      : auditData.recommendations,
    summary: auditData.summary
  } : null;

  return (
    <main className="flex-grow flex flex-col items-center p-8 md:p-24 bg-slate-950 min-h-screen">
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">SpendLens <span className="text-blue-400">AI</span></Link>
        <Link href="/" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
          Audit Your Stack
        </Link>
      </div>

      {!auditData || !mockResult ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-xl w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4">Audit Not Found</h2>
          <p className="text-slate-400 mb-8">We couldn&apos;t find an audit with this ID, or the database isn&apos;t connected.</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300 underline">Go back home</Link>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {mockResult.summary && (
            <div className="bg-blue-900/20 border border-blue-800/30 p-6 rounded-xl mb-8">
              <h3 className="text-blue-400 font-semibold mb-2">AI Summary</h3>
              <p className="text-slate-200">{mockResult.summary}</p>
            </div>
          )}
          
          <AuditResults 
            result={mockResult} 
            publicId={publicId} 
            teamSize={auditData?.team_size} 
            onReset={() => {}} // Not used in public view as they have a header button
          />
        </div>
      )}
    </main>
  );
}
