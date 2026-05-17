'use client';

import { useState } from 'react';

interface LeadCaptureProps {
  publicId: string;
  monthlySavings: number;
  isHighSavings: boolean;
  teamSize?: number;
}

export default function LeadCapture({ publicId, monthlySavings, isHighSavings, teamSize }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-bot field

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          role,
          teamSize,
          publicId,
          monthlySavings,
          isHighSavings,
          honeypot
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-900/30 border border-emerald-800/50 p-6 rounded-xl text-center">
        <h4 className="text-xl font-bold text-emerald-400 mb-2">Check your inbox!</h4>
        <p className="text-slate-300">We&apos;ve sent a confirmation email with a link to your full audit report.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mt-8 max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-white mb-2 text-center">Save this report & get optimization tips</h3>
      <p className="text-slate-400 text-sm text-center mb-6">We&apos;ll send you a secure link to this audit so you can share it with your team.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - invisible to users */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input 
            type="text" 
            id="website" 
            name="website" 
            value={honeypot} 
            onChange={(e) => setHoneypot(e.target.value)} 
            tabIndex={-1} 
            autoComplete="off" 
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Work Email <span className="text-red-400">*</span></label>
          <input 
            type="email" 
            id="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@startup.com"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">Company (Optional)</label>
            <input 
              type="text" 
              id="company" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Role (Optional)</label>
            <input 
              type="text" 
              id="role" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. CTO, Founder"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || !email}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Sending...' : 'Send me the report'}
        </button>
      </form>
    </div>
  );
}
