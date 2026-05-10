# SpendLens AI

Stop overpaying for AI tools. Audit your Cursor, Claude, ChatGPT, Copilot, and API spend in under 60 seconds.

## Summary
SpendLens AI is a free web app that helps startup founders and engineering managers find overspending in AI tools like Cursor, Claude, ChatGPT, GitHub Copilot, OpenAI API, Anthropic API, Gemini, and Windsurf.

## Screenshots
(Add screenshots here)

## Installation
```bash
npm install
```

## Running Locally
```bash
npm run dev
```

## Deployment
Deployed on Vercel: [Link TBD]

## Trade-offs
1. **Rule-based Audit Engine**: Used a deterministic engine instead of AI for audit math to ensure accuracy and transparency.
2. **LocalStorage Persistence**: Used localStorage for form persistence to avoid mandatory login for basic audits, improving conversion.
3. **Simplified Pricing**: Hardcoded pricing data for speed, requiring manual updates in `PRICING_DATA.md`.
4. **Resend for Email**: Chose Resend for its simplicity and great developer experience in Next.js.
5. **Tailwind CSS**: Used Tailwind for rapid UI development while maintaining a premium aesthetic.

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Resend
- Anthropic/OpenAI API
- Vitest
- GitHub Actions
- Vercel
