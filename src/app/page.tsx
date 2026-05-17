import SpendForm from '@/components/SpendForm';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-8 md:p-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Stop overpaying for AI tools.
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light">
          Audit your Cursor, Claude, ChatGPT, Copilot, and API spend in under 60 seconds.
        </p>
      </div>
      
      <div className="w-full max-w-4xl">
        <SpendForm />
      </div>
      
      <div className="mt-24 max-w-3xl text-center">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">1. Enter your stack</h3>
            <p className="text-slate-400 text-sm">Tell us what AI tools you use, your team size, and what you spend.</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">2. Get audited</h3>
            <p className="text-slate-400 text-sm">Our deterministic engine finds unused seats, plan mismatches, and redundancies.</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2">3. Save money</h3>
            <p className="text-slate-400 text-sm">Get actionable recommendations and start saving thousands a year.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
