import { describe, it, expect } from 'vitest';
import { runAudit } from '../lib/auditEngine';
import { AuditInput } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

describe('Audit Engine', () => {
  it('calculates monthly and annual savings correctly', () => {
    const input: AuditInput = {
      teamSize: 10,
      useCase: 'Mixed',
      tools: [
        {
          id: uuidv4(),
          name: 'ChatGPT',
          plan: 'Plus', // $20 expected
          monthlySpend: 40, // overpaying by $20
          seats: 1
        }
      ]
    };

    const result = runAudit(input);
    expect(result.totalMonthlySpend).toBe(40);
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.totalAnnualSavings).toBe(240);
  });

  it('recommends downgrade for small team on business plan', () => {
    const input: AuditInput = {
      teamSize: 3,
      useCase: 'Coding',
      tools: [
        {
          id: uuidv4(),
          name: 'Cursor',
          plan: 'Business', // $40 expected
          monthlySpend: 120, // 3 * 40
          seats: 3
        }
      ]
    };

    const result = runAudit(input);
    // Cursor Pro is 20 * 3 = 60. Downgrade saves $60.
    expect(result.totalMonthlySavings).toBe(60);
    expect(result.recommendations[0].action).toBe('Downgrade');
    expect(result.recommendations[0].message).toContain('Pro/Individual plan is usually sufficient');
  });

  it('recommends credits for high API spend', () => {
    const input: AuditInput = {
      teamSize: 10,
      useCase: 'Coding',
      tools: [
        {
          id: uuidv4(),
          name: 'OpenAI API',
          plan: 'Free',
          monthlySpend: 1000,
          seats: 1
        }
      ]
    };

    const result = runAudit(input);
    expect(result.recommendations.some(r => r.action === 'Optimize API')).toBe(true);
    // 15% of 1000 = 150
    expect(result.totalMonthlySavings).toBe(150);
  });

  it('returns keep when spending is already good', () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: 'Writing',
      tools: [
        {
          id: uuidv4(),
          name: 'Claude',
          plan: 'Pro',
          monthlySpend: 20,
          seats: 1
        }
      ]
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations[0].action).toBe('Keep');
  });

  it('never returns negative savings', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'Mixed',
      tools: [
        {
          id: uuidv4(),
          name: 'Cursor',
          plan: 'Pro', // Expected $20
          monthlySpend: 10, // Paying less than expected
          seats: 1
        }
      ]
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalMonthlySpend).toBe(10);
  });

  it('recommends consolidation when multiple coding tools are used for coding', () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: 'Coding',
      tools: [
        {
          id: uuidv4(),
          name: 'Cursor',
          plan: 'Pro',
          monthlySpend: 20,
          seats: 1
        },
        {
          id: uuidv4(),
          name: 'GitHub Copilot',
          plan: 'Individual',
          monthlySpend: 10,
          seats: 1
        }
      ]
    };

    const result = runAudit(input);
    // Should drop the cheaper one ($10)
    expect(result.totalMonthlySavings).toBe(10);
    expect(result.recommendations.some(r => r.action === 'Consolidate')).toBe(true);
  });
});
