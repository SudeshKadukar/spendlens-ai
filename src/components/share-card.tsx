"use client";

import { useState } from "react";
import { getShareUrl } from "@/lib/utils";
import { Button } from "./ui/button";

export default function ShareCard({ publicId }: { publicId: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl(publicId);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link. Please copy manually.");
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-8">
      <h3 className="text-lg font-bold text-white mb-2">Share your audit</h3>
      <p className="text-slate-400 text-sm mb-4">
        Anyone with this link can view your anonymous audit report.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          readOnly
          value={shareUrl}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-300"
        />
        <Button type="button" onClick={copyLink} className="shrink-0">
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}
