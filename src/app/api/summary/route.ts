import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSummaryPrompt, getFallbackSummary } from '@/lib/summaryPrompt';
import { AuditResult } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicId, result }: { publicId: string, result: AuditResult } = body;

    if (!publicId || !result) {
      return NextResponse.json({ error: 'Missing publicId or result' }, { status: 400 });
    }

    const prompt = getSummaryPrompt(result);
    let summaryText = getFallbackSummary(result); // Default to fallback

    // Try to call OpenAI API
    if (process.env.OPENAI_API_KEY) {
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 150
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          summaryText = aiData.choices[0].message.content.trim();
        } else {
          console.error('OpenAI API returned an error:', await aiResponse.text());
        }
      } catch (err) {
        console.error('Error calling OpenAI:', err);
      }
    }

    // Update Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase
        .from('audits')
        .update({ summary: summaryText })
        .eq('public_id', publicId);

      if (error) {
        console.error('Error updating summary in Supabase:', error);
      }
    }

    return NextResponse.json({ summary: summaryText });
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
