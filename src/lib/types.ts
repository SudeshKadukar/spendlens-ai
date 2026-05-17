export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API' 
  | 'OpenAI API' 
  | 'Anthropic API direct' 
  | 'OpenAI API direct' 
  | 'Gemini' 
  | 'Windsurf'
  | 'v0';

export type PlanName = 
  | 'Free'
  | 'Hobby'
  | 'Pro'
  | 'Business'
  | 'Enterprise'
  | 'Team'
  | 'Max'
  | 'Individual'
  | 'Plus'
  | 'Ultra'
  | 'API direct'
  | 'API';

export type UseCase = 'Coding' | 'Writing' | 'Data' | 'Research' | 'Mixed';

export interface ToolInput {
  id: string;
  name: ToolName;
  plan: PlanName;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
}

export interface Recommendation {
  toolId: string;
  toolName: ToolName;
  action: 'Keep' | 'Downgrade' | 'Consolidate' | 'Optimize API';
  message: string;
  potentialMonthlySavings: number;
}

export interface AuditResult {
  id: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: Recommendation[];
  summary: string;
}
