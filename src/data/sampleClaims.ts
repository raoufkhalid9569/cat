import { Claim } from '../types/claim';

export const SAMPLE_CLAIMS: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'deadlineDate'>[] = [
  {
    status: 'analyzed',
    patientName: 'Sarah Jenkins',
    patientPolicyNumber: 'ANT-9842104-B',
    doctorName: 'Dr. Gregory Hayes, MD (Memorial Regional Emergency)',
    insurerName: 'Anthem Blue Cross',
    billedAmount: 4280.00,
    disputedAmount: 3850.00,
    potentialSavings: 3850.00,
    denialCategory: 'No Surprises Act Violation',
    primaryReasonPlainEnglish: 'You received emergency trauma treatment at an in-network hospital, but the attending on-call anesthesiologist was deemed out-of-network and billed you the balance.',
    rawDenialText: `CLAIM DENIAL NOTICE - EXPLANATION OF BENEFITS
Member: Sarah Jenkins | Policy: ANT-9842104-B
Date of Service: 08/14/2026 | Provider: Apex Anesthesia Partners LLC
Billed Charges: $4,280.00 | Plan Allowed: $430.00 | Patient Responsibility: $3,850.00
Denial Code: PR-204 (This service is not covered when performed by an out-of-network provider under member's plan).
Notes: Facility Memorial Regional is In-Network. Individual rendering physician provider #08492 is Non-Participating. Balance billing applied.`,
    identifiedCodes: [
      {
        code: 'CPT 00840',
        description: 'Anesthesia for intraperitoneal procedures in lower abdomen (appendectomy)',
        flaggedIssue: 'Non-participating physician billing at an in-network emergency facility'
      },
      {
        code: 'ICD-10 K35.80',
        description: 'Acute appendicitis, other and unspecified',
        flaggedIssue: 'Emergency Medical Condition under EMTALA definition'
      }
    ],
    legalViolationsOrBypasses: [
      'Federal No Surprises Act (Public Law 116-260, 45 CFR § 149.110): Out-of-network balance billing prohibited for emergency services at in-network facilities',
      'EMTALA (42 U.S.C. § 1395dd): Emergency stabilizing treatment cannot be subjected to prior authorization or out-of-network cost penalty',
      'Affordable Care Act 42 U.S.C. § 300gg-19a: Cost-sharing for emergency services must not exceed in-network cost-sharing'
    ],
    appealSuccessProbability: 'High',
    appealSuccessReasoning: 'Federal law strictly prohibits balance billing patients for ancillary or emergency services at participating facilities. The insurer and provider must negotiate through the Independent Dispute Resolution (IDR) process without holding the patient liable.',
    recommendedStrategy: 'Issue formal Notice of No Surprises Act Violation demanding immediate recalculation to in-network copay ($50) and complete removal of the $3,850 balance bill, with carbon copy to the Centers for Medicare & Medicaid Services (CMS) No Surprises Help Desk and the State Insurance Commissioner.',
    deadlineDaysRemaining: 48,
    evidenceChecklist: [
      {
        id: 'ev-1',
        title: 'Emergency Room Discharge Summary',
        description: 'Confirming admission through the emergency department for acute abdominal pain',
        isCrucial: true,
        isCollected: true,
      },
      {
        id: 'ev-2',
        title: 'Hospital In-Network Verification',
        description: 'Proof that Memorial Regional Hospital is a participating tier-1 facility under member plan',
        isCrucial: true,
        isCollected: true,
      },
      {
        id: 'ev-3',
        title: 'Itemized Billing Statement (CMS-1500 / UB-04)',
        description: 'Detailed charge codes showing CPT 00840 and facility place of service code 23 (ER)',
        isCrucial: true,
        isCollected: false,
      }
    ]
  },
  {
    status: 'analyzed',
    patientName: 'Marcus Vance',
    patientPolicyNumber: 'UHC-5502914-X',
    doctorName: 'Dr. Elena Rostova, MD (Orthopedic Spine Center)',
    insurerName: 'UnitedHealthcare',
    billedAmount: 2850.00,
    disputedAmount: 2450.00,
    potentialSavings: 2450.00,
    denialCategory: 'Medical Necessity',
    primaryReasonPlainEnglish: 'Your doctor ordered an MRI for severe lumbar radiculopathy, but the insurer claims you have not completed 6 weeks of conservative physical therapy first.',
    rawDenialText: `UNITEDHEALTHCARE CLINICAL DETERMINATION ADVICE
Claim #: CLM-9938210 | Member: Marcus Vance
Service Requested: CPT 72148 - MRI Lumbar Spine without contrast
Decision: ADVERSE DETERMINATION - NOT MEDICALLY NECESSARY
Reason: Utilization Management Clinical Guideline CG-RAD-04 indicates imaging for non-specific lower back pain requires minimum 6 consecutive weeks of documented conservative treatment (physical therapy / NSAIDs). Chart notes do not demonstrate completion of 6-week therapy trial prior to scan.`,
    identifiedCodes: [
      {
        code: 'CPT 72148',
        description: 'Magnetic resonance (e.g., MRI), lumbar spine; without contrast material',
        flaggedIssue: 'Pre-service / post-service denial citing lack of conservative therapy protocol'
      },
      {
        code: 'ICD-10 M54.16',
        description: 'Radiculopathy, lumbar region with sensory loss and foot drop red flags',
        flaggedIssue: 'Neurological motor deficit is an explicit exception to conservative therapy waiting periods'
      }
    ],
    legalViolationsOrBypasses: [
      'American College of Radiology (ACR) Appropriateness Criteria: Acute progressive neurological deficit (foot drop/radiculopathy) supersedes 6-week conservative trial',
      'ERISA § 503 (29 U.S.C. 1133) & 29 CFR 2560.503-1: Entitlement to full and fair review by an independent board-certified specialist',
      'ACA Internal Appeals Mandate 45 CFR § 147.136: Duty to consider clinical urgency and irreversible physical impairment'
    ],
    appealSuccessProbability: 'High',
    appealSuccessReasoning: 'Dr. Rostova documented progressive motor weakness and reflex diminution in the right leg (red flag symptoms). Clinical guidelines universally state that neurological compromise bypasses mandatory physical therapy trials.',
    recommendedStrategy: 'Submit an Expedited Level-1 Appeal incorporating Dr. Rostova’s clinical chart notes specifically highlighting the red-flag neurological deficit, citing ACR Guidelines, and demanding peer-to-peer physician re-evaluation.',
    deadlineDaysRemaining: 34,
    evidenceChecklist: [
      {
        id: 'ev-4',
        title: 'Physician Clinical Chart Notes',
        description: 'Highlighting physical exam findings: 3/5 motor strength in right anterior tibialis and absent Achilles reflex',
        isCrucial: true,
        isCollected: true,
      },
      {
        id: 'ev-5',
        title: 'Doctor Attestation of Neurological Risk',
        description: 'Attending physician letter declaring that delaying imaging poses risk of permanent nerve damage',
        isCrucial: true,
        isCollected: false,
      }
    ]
  },
  {
    status: 'analyzed',
    patientName: 'David Chen',
    patientPolicyNumber: 'AET-7718290-C',
    doctorName: 'Dr. Angela Miller, MD (Endocrinology Specialists)',
    insurerName: 'Aetna Health',
    billedAmount: 1420.00,
    disputedAmount: 1420.00,
    potentialSavings: 1420.00,
    denialCategory: 'Step Therapy Failure',
    primaryReasonPlainEnglish: 'Aetna denied coverage for your prescribed GLP-1/GIP receptor agonist, claiming you must fail older generic medications (Sulfonylureas) first.',
    rawDenialText: `AETNA PHARMACY MANAGEMENT DENIAL
Patient: David Chen | Rx: Mounjaro (Tirzepatide) 5mg subcutaneous injection
Prescriber: Dr. Angela Miller | NDC: 00002-1495-80
Status: DENIED - Step Therapy Exception Criteria Not Met.
Criteria requires prior therapeutic trial of Metformin AND at least one Sulfonylurea (Glipizide/Glimepiride) before step-2 agent approval. Patient records show intolerance to Metformin, but no trial of second-line sulfonylurea agent.`,
    identifiedCodes: [
      {
        code: 'NDC 00002-1495-80',
        description: 'Tirzepatide subcutaneous pen injector',
        flaggedIssue: 'Denied under step-therapy formulary lock'
      },
      {
        code: 'ICD-10 E11.65',
        description: 'Type 2 diabetes mellitus with hyperglycemia and documented cardiovascular risk',
        flaggedIssue: 'Sulfonylurea contraindicated due to severe hypoglycemia and cardiac comorbidities'
      }
    ],
    legalViolationsOrBypasses: [
      'State Step Therapy Protocol Reform Act (Standard Exception Criteria): Step therapy must be overridden if prerequisite drug is clinically contraindicated or likely to cause adverse reaction',
      'ADA Standards of Medical Care in Diabetes: Guidelines explicitly advise against sulfonylureas in patients with hypoglycemia unawareness and cardiac disease',
      'ERISA Section 502 / 503 Fiduciary Duty'
    ],
    appealSuccessProbability: 'High',
    appealSuccessReasoning: 'Patient has severe documented hypoglycemia and coronary artery disease; sulfonylureas are clinically contraindicated. Step therapy laws mandate that insurers grant an immediate exception when trial drugs are medically hazardous.',
    recommendedStrategy: 'File an Urgent Step Therapy Clinical Exception Request accompanied by Dr. Miller’s contraindication certificate, citing ADA 2026 Treatment Algorithms and State Step Therapy Override laws.',
    deadlineDaysRemaining: 21,
    evidenceChecklist: [
      {
        id: 'ev-6',
        title: 'Hypoglycemia Incident Medical Records',
        description: 'Prior medical history documenting adverse reaction and dangerously low blood glucose',
        isCrucial: true,
        isCollected: true,
      },
      {
        id: 'ev-7',
        title: 'Cardiology Consultation Summary',
        description: 'Cardiovascular assessment proving necessity of GLP-1/GIP cardioprotective benefit',
        isCrucial: true,
        isCollected: false,
      }
    ]
  }
];
