export type DenialCategory =
  | 'No Surprises Act Violation'
  | 'Medical Necessity'
  | 'Lack of Prior Authorization'
  | 'Coding / Unbundling Inaccuracy'
  | 'Step Therapy Failure'
  | 'Out-of-Network Balance Bill'
  | 'Experimental / Investigational';

export type ClaimStatus =
  | 'draft'
  | 'analyzed'
  | 'appeal_generated'
  | 'submitted'
  | 'under_review'
  | 'won'
  | 'settled'
  | 'denied';

export interface IdentifiedCode {
  code: string;
  description: string;
  flaggedIssue: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  isCrucial: boolean;
  isCollected?: boolean;
}

export interface LegalCitation {
  statute: string;
  summary: string;
  impact: string;
}

export interface AppealLetterData {
  letterSubject: string;
  fullLetterText: string;
  legalCitations: LegalCitation[];
  doctorAttestationInstructions: string;
  submissionInstructions: {
    mailOption: string;
    faxOption: string;
    portalOption: string;
  };
  generatedAt: string;
}

export interface CallScriptData {
  initialGreeting: string;
  criticalQuestionsToAsk: string[];
  objectionsAndRebuttals: Array<{
    agentPushback: string;
    exactPatientRebuttal: string;
  }>;
  keyLegalKeywords: string[];
  closingDemand: string;
}

export interface Claim {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ClaimStatus;
  patientName: string;
  patientPolicyNumber: string;
  doctorName?: string;
  insurerName: string;
  billedAmount: number;
  disputedAmount: number;
  savedAmount?: number;
  denialCategory: DenialCategory;
  primaryReasonPlainEnglish: string;
  rawDenialText?: string;
  identifiedCodes: IdentifiedCode[];
  legalViolationsOrBypasses: string[];
  appealSuccessProbability: 'High' | 'Medium' | 'Fair';
  appealSuccessReasoning: string;
  recommendedStrategy: string;
  deadlineDaysRemaining: number;
  deadlineDate: string; // ISO date
  evidenceChecklist: EvidenceItem[];
  potentialSavings: number;
  appealLetter?: AppealLetterData;
  callScript?: CallScriptData;
  notes?: string[];
  submissionDate?: string;
}
