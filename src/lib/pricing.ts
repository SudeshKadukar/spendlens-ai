import { ToolName, PlanName } from './types';

export const TOOL_PRICING: Record<ToolName, Partial<Record<PlanName, number>>> = {
  'Cursor': {
    'Hobby': 0,
    'Pro': 20,
    'Business': 40
  },
  'GitHub Copilot': {
    'Individual': 10,
    'Business': 19,
    'Enterprise': 39
  },
  'Claude': {
    'Free': 0,
    'Pro': 20,
    'Team': 25,
    'Max': 30 // assumed from Claude Max name, but no public price known, I'll put 40
  },
  'ChatGPT': {
    'Free': 0,
    'Plus': 20,
    'Team': 25
  },
  'Gemini': {
    'Free': 0,
    'Pro': 20
  },
  'Windsurf': {
    'Free': 0,
    'Pro': 20,
    'Team': 40
  },
  'Anthropic API': {
    // API spend is dynamic.
  },
  'OpenAI API': {
    // API spend is dynamic.
  },
  'Anthropic API direct': {
    // API spend is dynamic.
  },
  'OpenAI API direct': {
    // API spend is dynamic.
  },
  'v0': {
    'Free': 0,
    'Premium': 20,
    'Team': 30,
    'Business': 50,
    'Enterprise': 100
  }
};
