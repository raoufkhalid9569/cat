import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client setup per gemini-api skill instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Mock/Standard RevenueCat Offerings
const REVENUECAT_OFFERINGS = {
  current: {
    identifier: 'default',
    description: 'ClaimClarity Patient Advocate Offerings',
    packages: [
      {
        identifier: '$rc_monthly',
        packageType: 'MONTHLY',
        product: {
          identifier: 'rc_claimclarity_pro_monthly',
          title: 'ClaimClarity Pro Monthly',
          description: 'Unlimited medical bill appeals, legal citations, and phone negotiation scripts',
          priceString: '$9.99',
          price: 9.99,
          currencyCode: 'USD',
          periodUnit: 'MONTH',
          periodNumberOfUnits: 1,
          trialPeriodDays: 7,
        },
      },
      {
        identifier: '$rc_annual',
        packageType: 'ANNUAL',
        product: {
          identifier: 'rc_claimclarity_pro_annual',
          title: 'ClaimClarity Pro Annual',
          description: 'Full year of coverage for you and your family. Save 50% vs monthly.',
          priceString: '$59.99',
          price: 59.99,
          currencyCode: 'USD',
          periodUnit: 'YEAR',
          periodNumberOfUnits: 1,
          trialPeriodDays: 14,
        },
      },
      {
        identifier: '$rc_single_pass',
        packageType: 'LIFETIME',
        product: {
          identifier: 'rc_emergency_appeal_pass',
          title: 'Single Appeal Lifeline Pass',
          description: 'One-time unlock for a high-value emergency appeal packet',
          priceString: '$19.99',
          price: 19.99,
          currencyCode: 'USD',
          periodUnit: 'ONE_TIME',
          periodNumberOfUnits: 1,
        },
      },
    ],
  },
};

// In-memory customer state store for RevenueCat customer info
const customerDatabase = new Map<string, any>();

function getOrCreateCustomerInfo(appUserId: string) {
  if (!customerDatabase.has(appUserId)) {
    customerDatabase.set(appUserId, {
      originalAppUserId: appUserId,
      entitlements: {
        active: {},
        all: {},
      },
      activeSubscriptions: [],
      allPurchasedProductIdentifiers: [],
      latestExpirationDate: null,
      firstSeen: new Date().toISOString(),
      originalPurchaseDate: null,
      managementURL: 'https://billing.revenuecat.com/manage',
    });
  }
  return customerDatabase.get(appUserId);
}

// ---------------- REVENUECAT API ROUTES ----------------

// Get Offerings
app.get('/api/revenuecat/offerings', (_req, res) => {
  res.json({
    offerings: REVENUECAT_OFFERINGS,
    currentOfferingId: 'default',
  });
});

// Get Customer Info
app.get('/api/revenuecat/customer/:appUserId', (req, res) => {
  const { appUserId } = req.params;
  const customerInfo = getOrCreateCustomerInfo(appUserId || 'anonymous_user');
  res.json(customerInfo);
});

// Process Purchase (handles RevenueCat web billing / mock / live sync)
app.post('/api/revenuecat/purchase', (req, res) => {
  const { appUserId, packageIdentifier, productIdentifier } = req.body;
  const customerInfo = getOrCreateCustomerInfo(appUserId || 'anonymous_user');

  const expiry = new Date();
  if (packageIdentifier === '$rc_annual') {
    expiry.setFullYear(expiry.getFullYear() + 1);
  } else if (packageIdentifier === '$rc_monthly') {
    expiry.setMonth(expiry.getMonth() + 1);
  } else {
    // Lifetime / Single pass (valid for 5 years)
    expiry.setFullYear(expiry.getFullYear() + 5);
  }

  const entitlement = {
    identifier: 'pro_access',
    isActive: true,
    willRenew: packageIdentifier !== '$rc_single_pass',
    periodType: packageIdentifier === '$rc_annual' ? 'ANNUAL' : packageIdentifier === '$rc_monthly' ? 'MONTHLY' : 'ONE_TIME',
    latestPurchaseDate: new Date().toISOString(),
    originalPurchaseDate: new Date().toISOString(),
    expirationDate: expiry.toISOString(),
    productIdentifier: productIdentifier || 'rc_claimclarity_pro_monthly',
    isSandbox: true,
    ownershipType: 'PURCHASED',
    store: 'APP_STORE',
  };

  customerInfo.entitlements.active['pro_access'] = entitlement;
  customerInfo.entitlements.all['pro_access'] = entitlement;
  customerInfo.activeSubscriptions.push(productIdentifier || 'rc_claimclarity_pro_monthly');
  customerInfo.allPurchasedProductIdentifiers.push(productIdentifier || 'rc_claimclarity_pro_monthly');
  customerInfo.latestExpirationDate = expiry.toISOString();
  customerInfo.originalPurchaseDate = new Date().toISOString();

  res.json({
    success: true,
    customerInfo,
  });
});

// Restore Purchases
app.post('/api/revenuecat/restore', (req, res) => {
  const { appUserId } = req.body;
  const customerInfo = getOrCreateCustomerInfo(appUserId || 'anonymous_user');

  // If customer had an entitlement in our DB, return it; otherwise grant active if they have recorded transactions
  const hasEntitlement = Object.keys(customerInfo.entitlements.active).length > 0;

  res.json({
    success: true,
    hasEntitlement,
    customerInfo,
    message: hasEntitlement ? 'Prior subscription restored successfully.' : 'No active subscriptions found for this account.',
  });
});

// RevenueCat Webhook simulator / receiver
app.post('/api/revenuecat/webhook', (req, res) => {
  const event = req.body;
  console.log('[RevenueCat Webhook Received]:', event?.type || 'Generic Event');
  res.json({ received: true });
});

// ---------------- AI BILL & DENIAL ANALYSIS (Server-Side Gemini) ----------------

app.post('/api/analyze-denial', async (req, res) => {
  try {
    const { denialText, denialReason, billedAmount, insurerName, patientNotes } = req.body;

    const prompt = `You are a certified healthcare billing advocate, medical coder, and patient rights legal specialist in the United States.
Analyze this health insurance claim denial / Explanation of Benefits (EOB) / surprise bill.

Input details:
- Insurer Name: ${insurerName || 'Unknown Insurer'}
- Billed Amount: $${billedAmount || 'Unknown'}
- Stated Denial Reason / Category: ${denialReason || 'General Medical Necessity Denial'}
- Denial Notice / Patient Narrative:
${denialText || 'No text provided'}
- Additional Patient Context:
${patientNotes || 'None'}

Return ONLY a valid JSON object matching this exact schema:
{
  "claimId": "string (e.g. CLM-84920)",
  "insurerName": "string",
  "disputedAmount": number,
  "denialCategory": "No Surprises Act Violation" | "Medical Necessity" | "Lack of Prior Authorization" | "Coding / Unbundling Inaccuracy" | "Step Therapy Failure" | "Out-of-Network Balance Bill" | "Experimental / Investigational",
  "primaryReasonPlainEnglish": "string (1-2 clear sentences explaining exactly why the insurance company rejected this in simple language)",
  "identifiedCodes": [
    {
      "code": "string (CPT/HCPCS/ICD-10 code)",
      "description": "string",
      "flaggedIssue": "string"
    }
  ],
  "legalViolationsOrBypasses": [
    "string (e.g. Federal No Surprises Act 45 CFR 149, ERISA Section 503, ACA Internal Claims Appeal Rules 45 CFR 147.136, Clinical Practice Guidelines)"
  ],
  "appealSuccessProbability": "High" | "Medium" | "Fair",
  "appealSuccessReasoning": "string (Why this case has strong precedent to be overturned on appeal)",
  "recommendedStrategy": "string (1 paragraph overview of the winning appeal tactic)",
  "deadlineDaysRemaining": number (estimated statutory deadline, e.g. 45 or 60 or 180),
  "evidenceChecklist": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "isCrucial": boolean
    }
  ],
  "potentialSavings": number
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing denial:', error);
    // Provide a resilient fallback response if API key fails or network times out
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze denial letter',
    });
  }
});

// Draft Formal Appeal Packet
app.post('/api/generate-appeal', async (req, res) => {
  try {
    const { claimData, patientName, patientPolicyNumber, doctorName, isProUser } = req.body;

    const prompt = `You are a medical billing attorney and healthcare appeal strategist drafting a formal, aggressive, and highly professional appeal letter to an insurance company.

Claim Details:
- Patient Name: ${patientName || 'Jane Doe'}
- Policy/Member ID: ${patientPolicyNumber || 'MEM-9382103'}
- Attending Physician: ${doctorName || 'Dr. Robert Mitchell, MD'}
- Insurer: ${claimData.insurerName}
- Disputed Amount: $${claimData.disputedAmount}
- Denial Category: ${claimData.denialCategory}
- Stated Reason: ${claimData.primaryReasonPlainEnglish}
- Codes Involved: ${JSON.stringify(claimData.identifiedCodes || [])}
- User is Pro Tier: ${isProUser}

Requirements:
- Structure the formal letter with Date, Certified Mail / Urgent Appeal Header, Re: Patient ID, Claim ID, Policy ID.
- Section 1: Statement of Appeal & Urgent Reversal Demand.
- Section 2: Clinical Summary & Medical Necessity Justification.
- Section 3: Statutory & Legal Framework (${isProUser ? 'Include deep citations of ERISA § 503 [29 U.S.C. 1133], 29 CFR 2560.503-1, ACA 45 CFR 147.136, or No Surprises Act 45 CFR § 149.110 with explicit legal liability warnings and State Insurance Commissioner complaint notice' : 'Brief legal summary'}).
- Section 4: Mandatory Documents Enclosed Checklist.
- Section 5: Statutory Resolution Timeline Demand (e.g. 30 days for post-service, 72 hours for urgent).

Return ONLY a valid JSON object:
{
  "letterSubject": "string",
  "fullLetterText": "string (formatted with proper paragraphs and indentation)",
  "legalCitations": [
    {
      "statute": "string",
      "summary": "string",
      "impact": "string"
    }
  ],
  "doctorAttestationInstructions": "string (exact bullet points of what the doctor must confirm in their supporting note)",
  "submissionInstructions": {
    "mailOption": "string (where to send certified mail with return receipt)",
    "faxOption": "string (expedited fax submission guideline)",
    "portalOption": "string"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating appeal:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate appeal letter',
    });
  }
});

// Generate Phone Call Script
app.post('/api/call-script', async (req, res) => {
  try {
    const { claimData } = req.body;

    const prompt = `You are a consumer advocacy expert. Provide an exact, word-for-word phone negotiation script for a patient calling their health insurer's customer service representative regarding this denied claim:
Claim Category: ${claimData.denialCategory}
Stated Reason: ${claimData.primaryReasonPlainEnglish}
Disputed Amount: $${claimData.disputedAmount}

Return ONLY a valid JSON object:
{
  "initialGreeting": "string (polite but firm, asking for reference number)",
  "criticalQuestionsToAsk": [
    "string (question 1)",
    "string (question 2)",
    "string (question 3)"
  ],
  "objectionsAndRebuttals": [
    {
      "agentPushback": "string",
      "exactPatientRebuttal": "string"
    }
  ],
  "keyLegalKeywords": ["string", "string"],
  "closingDemand": "string (request supervisor and written confirmation)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating phone script:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate phone script',
    });
  }
});

// In production, serve Vite static build; in development, mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClaimClarity server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
