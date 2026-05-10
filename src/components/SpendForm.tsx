'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToolInput, AuditInput, ToolName, PlanName, UseCase, AuditResult } from '../lib/types';
import { runAudit } from '../lib/auditEngine';
import AuditResults from './AuditResults';

const TOOL_NAMES: ToolName[] = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 
  'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'
];

const PLAN_NAMES: PlanName[] = [
  'Free', 'Hobby', 'Pro', 'Business', 'Enterprise', 'Team', 'Max', 'Individual'
];

const USE_CASES: UseCase[] = ['Coding', 'Writing', 'Data', 'Research', 'Mixed'];

export default function SpendForm() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<UseCase>('Coding');
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('spendLensData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as AuditInput;
        setTeamSize(parsed.teamSize);
        setUseCase(parsed.useCase);
        setTools(parsed.tools);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    } else {
      // Default tool
      setTools([{
        id: uuidv4(),
        name: 'ChatGPT',
        plan: 'Plus',
        monthlySpend: 20,
        seats: 1
      }]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendLensData', JSON.stringify({ teamSize, useCase, tools }));
    }
  }, [teamSize, useCase, tools, isLoaded]);

  const addTool = () => {
    setTools([...tools, { id: uuidv4(), name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }]);
  };

  const removeTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const updateTool = (id: string, field: keyof ToolInput, value: any) => {
    setTools(tools.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamSize, useCase, tools })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuditResult(data.result);
        setPublicId(data.publicId);
      } else {
        alert('Failed to generate audit. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setPublicId(null);
  };

  if (!isLoaded) return <div className="text-center p-8">Loading your saved tools...</div>;

  if (auditResult && publicId) {
    return <AuditResults result={auditResult} publicId={publicId} onReset={handleReset} teamSize={teamSize} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Global Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Team Size</label>
            <input 
              type="number" 
              min="1" 
              value={teamSize} 
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Primary Use Case</label>
            <select 
              value={useCase} 
              onChange={(e) => setUseCase(e.target.value as UseCase)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {USE_CASES.map(uc => <option key={uc} value={uc}>{uc}</option>)}
            </select>
          </div>
        </div>

        {/* Tools List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-100">Your AI Stack</h2>
            <button 
              type="button" 
              onClick={addTool}
              className="text-sm bg-slate-800 hover:bg-slate-700 text-white py-1 px-3 rounded border border-slate-700 transition-colors"
            >
              + Add Tool
            </button>
          </div>
          
          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div key={tool.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                <div className="md:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Tool</label>
                  <select 
                    value={tool.name} 
                    onChange={(e) => updateTool(tool.id, 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TOOL_NAMES.map(tn => <option key={tn} value={tn}>{tn}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Plan</label>
                  <select 
                    value={tool.plan} 
                    onChange={(e) => updateTool(tool.id, 'plan', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PLAN_NAMES.map(pn => <option key={pn} value={pn}>{pn}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Seats</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={tool.seats} 
                    onChange={(e) => updateTool(tool.id, 'seats', parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Total Monthly Spend ($)</label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    value={tool.monthlySpend} 
                    onChange={(e) => updateTool(tool.id, 'monthlySpend', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-1 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => removeTool(tool.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Remove tool"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
            
            {tools.length === 0 && (
              <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                No tools added yet. Click "+ Add Tool" to start.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-center">
          <button 
            type="submit" 
            disabled={tools.length === 0}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Audit my AI spend
          </button>
        </div>
      </form>
    </div>
  );
}
