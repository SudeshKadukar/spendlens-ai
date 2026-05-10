# PROMPTS

## Audit Summary Prompt
The following prompt is used to generate the personalized audit summary.

```text
Write a personalized AI spend audit summary of approximately 100 words.
Mention the total monthly spend: {{total_spend}}.
Mention the potential monthly savings: {{monthly_savings}}.
Mention the potential annual savings: {{annual_savings}}.
Identify the biggest saving reason: {{biggest_reason}}.
If savings are more than $500/month, mention that Credex can help capture these savings.
Do not invent numbers. Do not change audit math.
```

## Rationale
The prompt is designed to be concise and data-driven, ensuring that the AI summary remains grounded in the deterministic audit results.

## Failures and Iterations
[TBD]
