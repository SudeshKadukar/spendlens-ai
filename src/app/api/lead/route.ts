import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Simple in-memory rate limiting (for demo purposes)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

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
      honeypot // hidden field to catch bots
    } = body;

    // Honeypot check
    if (honeypot) {
      // Bot detected, pretend it succeeded
      return NextResponse.json({ success: true });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Rate limiting: 5 requests per 15 minutes per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    
    const record = rateLimitMap.get(ip);
    if (record) {
      if (now - record.timestamp < windowMs) {
        if (record.count >= 5) {
          return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        record.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from('leads').insert({
        audit_public_id: publicId,
        email,
        company_name: companyName,
        role,
        team_size: teamSize,
        monthly_savings: monthlySavings,
        is_high_savings: isHighSavings
      });

      if (error) {
        console.error('Error saving lead to Supabase:', error);
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
      }
    }

    // TODO: Send confirmation email using Resend (Day 6/7)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
