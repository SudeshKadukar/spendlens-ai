const CREDEX_URL = "https://credex.com";

export default function CredexCta({
  monthlySavings,
  annualSavings,
}: {
  monthlySavings: number;
  annualSavings: number;
}) {
  return (
    <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-emerald-500/30 p-6 rounded-xl text-center mb-8">
      <h4 className="text-xl font-bold text-emerald-400 mb-2">
        High savings detected
      </h4>
      <p className="text-slate-300 mb-2 text-sm max-w-lg mx-auto">
        You could save ${monthlySavings.toLocaleString()}/month — $
        {annualSavings.toLocaleString()}/year.
      </p>
      <p className="text-slate-400 mb-4 text-sm max-w-lg mx-auto">
        Credex can help your team capture these savings through discounted AI
        infrastructure credits.
      </p>
      <a
        href={CREDEX_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        Book a Credex consultation
      </a>
    </div>
  );
}
