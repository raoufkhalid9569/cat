import { Claim } from '../types/claim';
import { SAMPLE_CLAIMS } from '../data/sampleClaims';

const STORAGE_KEY_CLAIMS = 'claimclarity_saved_claims';
const STORAGE_KEY_ONBOARDING = 'claimclarity_onboarding_completed';

export function initializeClaims(): Claim[] {
  const cached = localStorage.getItem(STORAGE_KEY_CLAIMS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fall through to initial seed
    }
  }

  // Seed with sample claims
  const initialClaims: Claim[] = SAMPLE_CLAIMS.map((sample, idx) => {
    const createdDate = new Date(Date.now() - (idx * 3 + 2) * 86400000);
    const deadlineDate = new Date(createdDate.getTime() + sample.deadlineDaysRemaining * 86400000);
    return {
      ...sample,
      id: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString(),
      deadlineDate: deadlineDate.toISOString(),
    };
  });

  localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(initialClaims));
  return initialClaims;
}

export function getSavedClaims(): Claim[] {
  return initializeClaims();
}

export function saveClaim(claim: Claim): Claim[] {
  const current = getSavedClaims();
  const index = current.findIndex((c) => c.id === claim.id);
  let updated: Claim[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...claim, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...claim, updatedAt: new Date().toISOString() }, ...current];
  }

  localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(updated));
  return updated;
}

export function deleteClaim(id: string): Claim[] {
  const current = getSavedClaims();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(updated));
  return updated;
}

export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(STORAGE_KEY_ONBOARDING) === 'true';
}

export function setOnboardingCompleted(completed: boolean): void {
  localStorage.setItem(STORAGE_KEY_ONBOARDING, completed ? 'true' : 'false');
}

export function resetDemoData(): Claim[] {
  localStorage.removeItem(STORAGE_KEY_CLAIMS);
  return initializeClaims();
}
