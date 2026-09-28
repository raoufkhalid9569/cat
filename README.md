# ClaimClarity — Patient Medical Bill & Health Insurance Denial Appeal Copilot
*RevenueCat Shipaton 2026 Hackathon Official Submission*

---

## 1. Executive Summary & Problem-Market Fit

In the United States, private and employer health plans deny over **200 million medical claims** every year. Shockingly, **86% of patients never appeal** because denial notices and Explanations of Benefits (EOBs) are intentionally written in impenetrable legalese with obscure CPT, HCPCS, and ICD-10 medical billing codes.

Yet according to federal government and Kaiser Family Foundation studies, **over 52% of formal patient appeals succeed in overturning the denial or significantly reducing the bill**.

**ClaimClarity** empowers patients and families to overturn unfair denials, fight out-of-network balance bills under the **Federal No Surprises Act**, and demand enforcement under **ERISA § 503** and the **Affordable Care Act (45 CFR § 147.136)**.

---

## 2. RevenueCat Monetization & Subscription Strategy

ClaimClarity uses RevenueCat as its single source of truth for in-app and web subscription entitlements.

### Free Tier vs. ClaimClarity Pro

| Feature | Free Tier | ClaimClarity Pro |
| :--- | :---: | :---: |
| **Denial Code OCR & Plain-English Translation** | 1 Active Case | Unlimited Cases |
| **Statutory Violation Audit (No Surprises Act / ACA)** | Basic Summary | Deep Legal Citations |
| **Attorney-Grade Appeal Letter Generation** | Locked (Preview) | Full Customizable Packet |
| **Physician Attestation & Clinical Directives** | General Tips | Formatted MD Directives |
| **Interactive Insurer Phone Negotiation Script** | Standard Questions | Full Objection Rebuttals |
| **Certified Mail & Fax Submission Instructions** | Locked | Full USPS / Fax Templates |
| **30/60-Day Legal Deadline Countdown Tracker** | Included | Included |
| **PDF & Formal Print Export** | Locked | 1-Tap PDF / Print Export |

### RevenueCat Offerings & Products

- **`$rc_monthly`**: `$9.99/month` with a **7-day free trial**. For patients facing an urgent individual claim or short-term medical incident.
- **`$rc_annual`**: `$59.99/year` (`$4.99/month`, **50% savings**) with a **14-day free trial** ("Best Value"). For families, chronic illness patients, and independent contractors who need year-round protection against healthcare billing disputes.
- **`$rc_single_pass`**: `$19.99 one-time` for single emergency high-value appeal packet unlock.

### RevenueCat SDK Architecture

- **`Purchases.configure()`**: Initializes with device ID or authenticated user ID.
- **`Purchases.getOfferings()`**: Dynamically loads current packages from `/api/revenuecat/offerings`.
- **`Purchases.purchasePackage()`**: Executes purchase, registers active `pro_access` entitlement, and updates CustomerInfo.
- **`Purchases.restorePurchases()`**: Re-checks prior App Store, Google Play, or Stripe transactions.
- **`RevenueCatDebugSheet`**: A dedicated judge/developer console built right into the app to inspect CustomerInfo, toggle Pro/Free states in 1 click, and test sandbox purchase error handling.

---

## 3. Core Workflow

```
[USER INPUT]
  Upload denial letter / EOB photo or select pre-packaged high-value test case.
       ↓
[PROCESSING]
  Server-side Gemini 3.8 Flash extracts CPT/ICD codes and audits against
  Federal No Surprises Act, ERISA § 503, and clinical guidelines.
       ↓
[USEFUL RESULT]
  Plain-English diagnostic report + 85% overturn probability score +
  evidence checklist.
       ↓
[USER ACTION]
  User taps "Generate Formal Legal Appeal Packet" → RevenueCat Paywall unlocks
  comprehensive attorney-grade statutory packet.
       ↓
[SAVED / TRACKED RESULT]
  Appeal packet generated with Certified Mail & Fax headers. User marks
  "Submitted" to start the 30-day statutory insurer response countdown.
```

---

## 4. Technical Architecture

- **Frontend**: React 19 + TypeScript, Tailwind CSS v4, Lucide React icons, Plus Jakarta Sans typography.
- **Device Emulation**: Dual-mode viewport (Responsive Full-Screen or iPhone 16 Pro device frame with Dynamic Island).
- **Backend**: Full-stack Express server (`server.ts`) hosting REST endpoints and mounting Vite dev middleware.
- **AI Engine**: Server-side `@google/genai` with model `gemini-3.8-flash` (strictly kept server-side; API key never exposed to client).
- **Persistence**: LocalStorage with automatic schema recovery and demo case re-seeding.
- **RevenueCat Integration**: Native wrapper matching the official RevenueCat Web & Mobile Purchases SDK specifications.

---

## 5. Environment Variables & Secrets

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Required for AI Medical Bill Analysis & Appeal Generation
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional: Live RevenueCat Public API Key (appl_... or goog_...)
# If omitted, ClaimClarity operates with the built-in RevenueCat Sandbox engine
REVENUECAT_PUBLIC_API_KEY="appl_xxxxxxxxxxxxxx"
```

---

## 6. How to Run & Test

### Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack server on port 3000
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm run start
```

### 60-Second Demo Script for Hackathon Judges

1. **Launch App**: View Onboarding explaining that 52% of appeals overturn denials. Tap **"Test Live Demo"**.
2. **Dashboard**: Notice the `$8,550` disputed claims counter and urgent **34-day countdown** alert.
3. **Analyze Claim**: Tap **"New Appeal"** → Select the **No Surprises Act ER Trauma** case ($4,280 bill).
4. **Diagnosis**: Tap **"Run AI Denial Audit"**. Watch the live medical code parser flag **CPT 00840** and **Public Law 116-260 violation**.
5. **Paywall / RevenueCat**: Tap **"Unlock Formal Legal Appeal Packet (Pro)"**.
   - Notice the RevenueCat Paywall with 7-day free trial on Monthly and 50% discount on Annual.
   - Tap **"Start 7-Day Free Trial"** → simulated RevenueCat purchase executes instantly with confetti.
6. **Appeal Letter**: View the generated, citation-heavy appeal letter complete with certified mail headers, doctor attestation checklist, and fax instructions.
7. **Negotiation Script**: Tap **"Negotiate"** in bottom navigation to see the word-for-word phone rebuttal flashcards.
8. **RC Dev Inspector**: Tap **"RC Dev"** in the top bar to inspect active entitlement state or switch back to Free tier.
