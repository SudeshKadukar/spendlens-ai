import { NextResponse } from 'next/server';
import { runAudit } from '@/lib/auditEngine';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamSize, useCase, tools } = body;

    if (!teamSize || !useCase || !tools) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Run the audit engine
    const result = runAudit({ teamSize, useCase, tools });
    const publicId = uuidv4().replace(/-/g, '').substring(0, 10);

    // Save to Supabase (Mocked if no credentials)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from('audits').insert({
        public_id: publicId,
        team_size: teamSize,
        use_case: useCase,
        tools: JSON.stringify(tools),
        recommendations: JSON.stringify(result.recommendations),
        total_monthly_spend: result.totalMonthlySpend,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        summary: result.summary
      });

      if (error) {
        console.error('Error saving audit to Supabase:', error);
        // We still return the result even if db fails for resilience
      }
    }

    return NextResponse.json({
      result,
      publicId
    });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
