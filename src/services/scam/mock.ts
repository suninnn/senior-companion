import type { ScamAssessment, ScamInputKind } from '@/models';
import type { ScamProvider } from './types';

const HIGH_RISK_PHRASES = [
  'send money',
  'bank account has been locked',
  'password',
  'urgent',
  'immediately',
  'click this link',
  'verify your account',
  'social security',
  'credit card',
];

const CAUTION_PHRASES = [
  'free',
  'won',
  'prize',
  'limited time',
  'act now',
  'call now',
];

export const mockScamProvider: ScamProvider = {
  async assess(input) {
    await delay(600);
    const text = (input.text ?? '').toLowerCase();

    const highRiskMatches = HIGH_RISK_PHRASES.filter((p) => text.includes(p));
    const cautionMatches = CAUTION_PHRASES.filter((p) => text.includes(p));

    if (highRiskMatches.length > 0) {
      return buildAssessment('high', input.kind, highRiskMatches);
    }
    if (cautionMatches.length > 0 || input.kind === 'image') {
      return buildAssessment('caution', input.kind, cautionMatches);
    }
    return buildAssessment('likelySafe', input.kind, []);
  },
};

function buildAssessment(
  level: ScamAssessment['riskLevel'],
  kind: ScamInputKind,
  matches: string[]
): ScamAssessment {
  const id = Math.random().toString(36).slice(2);
  const now = new Date().toISOString();

  if (level === 'high') {
    return {
      id,
      riskLevel: 'high',
      headline: 'HIGH RISK',
      plainExplanation:
        'This message may be a scam. It is asking for things that scammers often ask for.',
      advice: [
        'Do not send money.',
        'Do not share your password or bank information.',
        'Call your daughter before responding.',
      ],
      disclaimer:
        'This app cannot promise a message is safe. When in doubt, check with a trusted family member.',
      inputKind: kind,
      createdAt: now,
    };
  }

  if (level === 'caution') {
    return {
      id,
      riskLevel: 'caution',
      headline: 'BE CAREFUL',
      plainExplanation:
        'This message looks a little suspicious. It may be real, but it may also be a scam.',
      advice: [
        'Take your time.',
        'Do not click links you are unsure about.',
        'Ask a family member if you are not sure.',
      ],
      disclaimer:
        'This app cannot promise a message is safe. When in doubt, check with a trusted family member.',
      inputKind: kind,
      createdAt: now,
    };
  }

  return {
    id,
    riskLevel: 'likelySafe',
    headline: 'LOOKS OKAY',
    plainExplanation:
      'This message does not show common warning signs, but that does not mean it is definitely safe.',
    advice: ['Still be careful with personal information.'],
    disclaimer:
      'This app cannot promise a message is safe. When in doubt, check with a trusted family member.',
    inputKind: kind,
    createdAt: now,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
