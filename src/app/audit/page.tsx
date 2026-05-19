import SpendForm from "@/components/SpendForm";
import Link from "next/link";

export default function AuditPage() {
  return (
    <main className="flex-grow flex flex-col items-center p-8 md:p-16">
      <div className="w-full max-w-4xl mb-8">
        <Link href="/" className="text-slate-400 hover:text-white text-sm">
          ← Back to home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-2">
          Audit your AI spend
        </h1>
        <p className="text-slate-400">
          Enter your tools, plans, seats, and monthly spend. Progress saves automatically.
        </p>
      </div>
      <SpendForm />
    </main>
  );
}
