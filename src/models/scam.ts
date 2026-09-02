export type RiskLevel = 'high' | 'caution' | 'likelySafe';
export type ScamInputKind = 'voice' | 'text' | 'image';

export interface ScamAssessment {
  id: string;
  riskLevel: RiskLevel;
  headline: string;
  plainExplanation: string;
  advice: string[];
  disclaimer: string;
  inputKind: ScamInputKind;
  createdAt: string;
}
