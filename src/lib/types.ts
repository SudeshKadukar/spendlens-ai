import type { ToolName as PricingToolName } from "./pricing-data";

export type { AuditResult, ToolAuditResult } from "./audit-engine";

export type ToolName = PricingToolName | "Anthropic API" | "OpenAI API" | "Windsurf";

export type PlanName =
  | "Free"
  | "Hobby"
  | "Pro"
  | "Business"
  | "Enterprise"
  | "Team"
  | "Max"
  | "Individual"
  | "Plus"
  | "Ultra"
  | "API direct"
  | "API"
  | "Premium";

export type UseCase = "Coding" | "Writing" | "Data" | "Research" | "Mixed";

export interface ToolInput {
  id: string;
  name: ToolName;
  plan: PlanName;
  monthlySpend: number;
  seats: number;
}

export interface FormAuditInput {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
}

export interface StoredAuditRow {
  id: string;
  public_id: string;
  team_size: number;
  use_case: string;
  tools: unknown;
  recommendations: unknown;
  total_monthly_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  summary: string | null;
}
