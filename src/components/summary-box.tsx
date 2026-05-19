export default function SummaryBox({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <div className="bg-blue-900/20 border border-blue-800/30 p-6 rounded-xl mb-8">
      <h3 className="text-blue-400 font-semibold mb-2">Personalized summary</h3>
      <p className="text-slate-200 leading-relaxed">{summary}</p>
    </div>
  );
}
