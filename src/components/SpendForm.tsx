"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { FormAuditInput, ToolInput, ToolName, PlanName, UseCase } from "../lib/types";
import type { AuditResult } from "../lib/audit-engine";
import { loadFormState, saveFormState } from "../lib/storage";
import AuditResults from "./AuditResults";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";

const TOOL_NAMES: ToolName[] = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API direct",
  "OpenAI API direct",
  "Gemini",
  "v0",
];

const TOOL_PLANS: Record<string, PlanName[]> = {
  Cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  Claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  ChatGPT: ["Plus", "Team", "Enterprise", "API direct"],
  "Anthropic API direct": ["API direct"],
  "OpenAI API direct": ["API direct"],
  Gemini: ["Pro", "Ultra", "API"],
  v0: ["Free", "Premium", "Team", "Business", "Enterprise"],
};

const USE_CASES: UseCase[] = ["Coding", "Writing", "Data", "Research", "Mixed"];

const DEFAULT_TOOL: ToolInput = {
  id: "",
  name: "ChatGPT",
  plan: "Plus",
  monthlySpend: 20,
  seats: 1,
};

export default function SpendForm() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formState, setFormState] = useState<FormAuditInput>({
    teamSize: 1,
    useCase: "Coding",
    tools: [],
  });
  const [auditResult, setAuditResult] = useState<(AuditResult & { summary?: string }) | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = loadFormState();
    if (saved?.tools?.length) {
      setFormState(saved);
    } else {
      setFormState((prev) => ({
        ...prev,
        tools: [{ ...DEFAULT_TOOL, id: uuidv4() }],
      }));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveFormState(formState);
    }
  }, [formState, isLoaded]);

  const addTool = () => {
    setFormState((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        { id: uuidv4(), name: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
      ],
    }));
  };

  const removeTool = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.id !== id),
    }));
  };

  const updateTool = (id: string, field: keyof ToolInput, value: string | number) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => {
        if (t.id !== id) return t;
        if (field === "name") {
          const newName = value as ToolName;
          const defaultPlan = TOOL_PLANS[newName]?.[0] ?? "Free";
          return { ...t, name: newName, plan: defaultPlan };
        }
        return { ...t, [field]: value };
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        const data = await response.json();
        setAuditResult(data.result);
        setPublicId(data.publicId);
        window.history.replaceState(null, "", `/results/${data.publicId}`);
      } else {
        alert("Failed to generate audit. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setPublicId(null);
    window.history.replaceState(null, "", "/audit");
  };

  if (!isLoaded) {
    return <div className="text-center p-8 text-slate-400">Loading your saved tools...</div>;
  }

  if (auditResult && publicId) {
    return (
      <AuditResults
        result={auditResult}
        publicId={publicId}
        onReset={handleReset}
        teamSize={formState.teamSize}
      />
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Team size</label>
            <Input
              type="number"
              min={1}
              value={formState.teamSize}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  teamSize: parseInt(e.target.value, 10) || 1,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Primary use case</label>
            <Select
              value={formState.useCase}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  useCase: e.target.value as UseCase,
                }))
              }
            >
              {USE_CASES.map((uc) => (
                <option key={uc} value={uc}>
                  {uc}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-100">Your AI stack</h2>
            <Button type="button" variant="secondary" onClick={addTool} className="text-sm py-1 px-3">
              + Add tool
            </Button>
          </div>

          <div className="space-y-4">
            {formState.tools.map((tool) => (
              <div
                key={tool.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-800/50 p-4 rounded-lg border border-slate-700/50"
              >
                <div className="md:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Tool</label>
                  <Select
                    value={tool.name}
                    onChange={(e) => updateTool(tool.id, "name", e.target.value)}
                    className="text-sm"
                  >
                    {TOOL_NAMES.map((tn) => (
                      <option key={tn} value={tn}>
                        {tn}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Plan</label>
                  <Select
                    value={tool.plan}
                    onChange={(e) => updateTool(tool.id, "plan", e.target.value)}
                    className="text-sm"
                  >
                    {(TOOL_PLANS[tool.name] ?? ["Free"]).map((pn) => (
                      <option key={pn} value={pn}>
                        {pn}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Seats</label>
                  <Input
                    type="number"
                    min={1}
                    value={tool.seats}
                    onChange={(e) =>
                      updateTool(tool.id, "seats", parseInt(e.target.value, 10) || 1)
                    }
                    className="text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">
                    Total monthly spend ($)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={tool.monthlySpend}
                    onChange={(e) =>
                      updateTool(tool.id, "monthlySpend", parseFloat(e.target.value) || 0)
                    }
                    className="text-sm"
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTool(tool.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Remove tool"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {formState.tools.length === 0 && (
              <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                No tools added yet. Click &quot;+ Add tool&quot; to start.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-center">
          <Button
            type="submit"
            disabled={formState.tools.length === 0 || isSubmitting}
            className="py-3 px-8"
          >
            {isSubmitting ? "Auditing your stack..." : "Audit my AI spend"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
