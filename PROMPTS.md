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
The prompt is designed to be concise and data-driven, ensuring that the AI summary remains grounded in the deterministic audit results. By passing exactly what savings are and what the biggest reason is (calculated programmatically), we prevent the LLM from hallucinating incorrect math.

## Failures and Iterations
- Initial prompt allowed the AI to look at the raw tools list, but it often recalculated the savings incorrectly.
- We changed the logic to run the deterministic engine first, and only pass the finalized mathematical values to the LLM.
