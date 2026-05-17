'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToolInput, AuditInput, ToolName, PlanName, UseCase, AuditResult } from '../lib/types';
import AuditResults from './AuditResults';

const TOOL_NAMES: ToolName[] = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 
  'Anthropic API direct', 'OpenAI API direct', 'Gemini', 'v0'
];

const TOOL_PLANS: Record<ToolName, PlanName[]> = {
  'Cursor': ['Hobby', 'Pro', 'Business', 'Enterprise'],
  'GitHub Copilot': ['Individual', 'Business', 'Enterprise'],
  'Claude': ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API direct'],
  'ChatGPT': ['Plus', 'Team', 'Enterprise', 'API direct'],
  'Anthropic API': ['API direct'],
  'OpenAI API': ['API direct'],
  'Anthropic API direct': ['API direct'],
  'OpenAI API direct': ['API direct'],
  'Gemini': ['Pro', 'Ultra', 'API'],
  'Windsurf': ['Free', 'Pro', 'Team'],
  'v0': ['Free', 'Premium', 'Team', 'Business', 'Enterprise']
};

const USE_CASES: UseCase[] = ['Coding', 'Writing', 'Data', 'Research', 'Mixed'];

export default function SpendForm() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Consolidate form state to avoid cascading renders in useEffect
  const [formState, setFormState] = useState<AuditInput>({
    teamSize: 1,
    useCase: 'Coding',
    tools: []
  });
  
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('spendLensData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as AuditInput;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormState(parsed);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    } else {
      // Default tool if nothing in storage
      setFormState(prev => ({
        ...prev,
        tools: [{
          id: uuidv4(),
          name: 'ChatGPT',
          plan: 'Plus',
          monthlySpend: 20,
          seats: 1
        }]
      }));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendLensData', JSON.stringify(formState));
    }
  }, [formState, isLoaded]);

  const addTool = () => {
    setFormState(prev => ({
      ...prev,
      tools: [...prev.tools, { id: uuidv4(), name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }]
    }));
  };

  const removeTool = (id: string) => {
    setFormState(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.id !== id)
    }));
  };

  const updateTool = (id: string, field: keyof ToolInput, value: string | number) => {
    setFormState(prev => ({
      ...prev,
      tools: prev.tools.map(t => {
        if (t.id === id) {
          if (field === 'name') {
            const newName = value as ToolName;
            const defaultPlan = TOOL_PLANS[newName]?.[0] || 'Free';
            return { ...t, name: newName, plan: defaultPlan };
          }
          return { ...t, [field]: value };
        }
        return t;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
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
    return <AuditResults result={auditResult} publicId={publicId} onReset={handleReset} teamSize={formState.teamSize} />;
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
              value={formState.teamSize} 
              onChange={(e) => setFormState(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Primary Use Case</label>
            <select 
              value={formState.useCase} 
              onChange={(e) => setFormState(prev => ({ ...prev, useCase: e.target.value as UseCase }))}
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
            {formState.tools.map((tool) => (
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
                    onChange={(e) => updateTool(tool.id, 'plan', e.target.value as PlanName)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TOOL_PLANS[tool.name]?.map(pn => <option key={pn} value={pn}>{pn}</option>) || <option value="Free">Free</option>}
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
            
            {formState.tools.length === 0 && (
              <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                No tools added yet. Click &quot;+ Add Tool&quot; to start.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-center">
          <button 
            type="submit" 
            disabled={formState.tools.length === 0 || isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Auditing your stack...' : 'Audit my AI spend'}
          </button>
        </div>
      </form>
    </div>
  );
}
