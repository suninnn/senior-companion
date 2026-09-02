import type { ScamAssessment, ScamInputKind } from '@/models';

export interface ScamProvider {
  assess(input: { kind: ScamInputKind; text?: string; imageUri?: string }): Promise<ScamAssessment>;
}
