/** Audit rule identifiers — logic lives in audit-engine.ts */
export const AUDIT_RULES = {
  SMALL_TEAM_EXPENSIVE_PLAN:
    "Small teams (≤2) should avoid Team/Business/Enterprise/Max/Ultra unless needed.",
  BILLING_MISMATCH:
    "Reported spend much higher than official pricing should be flagged.",
  API_LIGHT_USE:
    "API direct spend above $100 for light use cases should be reviewed.",
  GEMINI_ULTRA_SMALL_TEAM:
    "Gemini Ultra is expensive for teams of 3 or fewer.",
  V0_TEAM_SOLO:
    "v0 Team/Business is overkill for solo builders.",
} as const;

export const HIGH_SAVINGS_THRESHOLD = 500;
export const ALREADY_OPTIMIZED_THRESHOLD = 100;
