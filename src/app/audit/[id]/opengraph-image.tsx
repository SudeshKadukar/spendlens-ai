import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'SpendLens AI Audit Result';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // We can fetch data from Supabase here to make it dynamic
  // For this assignment, we'll keep it static but beautifully designed

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #020617, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '48px', fontWeight: 'bold' }}>SpendLens</span>
          <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#60a5fa', marginLeft: '12px' }}>AI</span>
        </div>
        
        <h1 style={{ fontSize: '72px', fontWeight: '900', textAlign: 'center', lineHeight: 1.1, marginBottom: '20px' }}>
          Your AI Stack Audit is Ready
        </h1>
        
        <p style={{ fontSize: '36px', color: '#94a3b8', textAlign: 'center', maxWidth: '900px' }}>
          We found potential savings on Cursor, Claude, ChatGPT, GitHub Copilot, and your API usage.
        </p>

        <div style={{ display: 'flex', marginTop: '60px', padding: '20px 40px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '20px', border: '2px solid rgba(59, 130, 246, 0.4)' }}>
          <span style={{ fontSize: '32px', color: '#60a5fa', fontWeight: 'bold' }}>View Full Report</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
