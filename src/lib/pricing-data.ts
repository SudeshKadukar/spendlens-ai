export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API direct"
  | "OpenAI API direct"
  | "Gemini"
  | "v0";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type PricingPlan = {
  plan: string;
  monthlyPrice: number;
  perSeat: boolean;
};

export const PRICING_DATA: Record<ToolName, PricingPlan[]> = {
  Cursor: [
    { plan: "Hobby", monthlyPrice: 0, perSeat: true },
    { plan: "Pro", monthlyPrice: 20, perSeat: true },
    { plan: "Business", monthlyPrice: 40, perSeat: true },
    { plan: "Enterprise", monthlyPrice: 60, perSeat: true },
  ],

  "GitHub Copilot": [
    { plan: "Individual", monthlyPrice: 10, perSeat: true },
    { plan: "Business", monthlyPrice: 19, perSeat: true },
    { plan: "Enterprise", monthlyPrice: 39, perSeat: true },
  ],

  Claude: [
    { plan: "Free", monthlyPrice: 0, perSeat: true },
    { plan: "Pro", monthlyPrice: 20, perSeat: true },
    { plan: "Max", monthlyPrice: 100, perSeat: true },
    { plan: "Team", monthlyPrice: 30, perSeat: true },
    { plan: "Enterprise", monthlyPrice: 60, perSeat: true },
    { plan: "API direct", monthlyPrice: 0, perSeat: false },
  ],

  ChatGPT: [
    { plan: "Plus", monthlyPrice: 20, perSeat: true },
    { plan: "Team", monthlyPrice: 30, perSeat: true },
    { plan: "Enterprise", monthlyPrice: 60, perSeat: true },
    { plan: "API direct", monthlyPrice: 0, perSeat: false },
  ],

  "Anthropic API direct": [
    { plan: "API direct", monthlyPrice: 0, perSeat: false },
  ],

  "OpenAI API direct": [
    { plan: "API direct", monthlyPrice: 0, perSeat: false },
  ],

  Gemini: [
    { plan: "Pro", monthlyPrice: 20, perSeat: true },
    { plan: "Ultra", monthlyPrice: 250, perSeat: true },
    { plan: "API", monthlyPrice: 0, perSeat: false },
  ],

  v0: [
    { plan: "Free", monthlyPrice: 0, perSeat: true },
    { plan: "Premium", monthlyPrice: 20, perSeat: true },
    { plan: "Team", monthlyPrice: 30, perSeat: true },
    { plan: "Business", monthlyPrice: 50, perSeat: true },
    { plan: "Enterprise", monthlyPrice: 100, perSeat: true },
  ],
};
