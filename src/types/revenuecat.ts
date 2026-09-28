export type RevenueCatPeriodUnit = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'ONE_TIME';

export interface RevenueCatProduct {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
  periodUnit?: RevenueCatPeriodUnit;
  periodNumberOfUnits?: number;
  trialPeriodDays?: number;
}

export interface RevenueCatPackage {
  identifier: string; // '$rc_monthly' | '$rc_annual' | '$rc_single_pass'
  packageType: 'MONTHLY' | 'ANNUAL' | 'LIFETIME' | 'CUSTOM';
  product: RevenueCatProduct;
}

export interface RevenueCatOffering {
  identifier: string;
  description: string;
  packages: RevenueCatPackage[];
  monthly?: RevenueCatPackage;
  annual?: RevenueCatPackage;
  lifetime?: RevenueCatPackage;
}

export interface RevenueCatEntitlement {
  identifier: string; // 'pro_access'
  isActive: boolean;
  willRenew: boolean;
  periodType: string;
  latestPurchaseDate: string;
  originalPurchaseDate: string;
  expirationDate: string | null;
  productIdentifier: string;
  isSandbox: boolean;
  ownershipType: 'PURCHASED' | 'FAMILY_SHARED';
  store: 'APP_STORE' | 'PLAY_STORE' | 'STRIPE' | 'RC_BILLING';
}

export interface RevenueCatCustomerInfo {
  originalAppUserId: string;
  entitlements: {
    active: Record<string, RevenueCatEntitlement>;
    all: Record<string, RevenueCatEntitlement>;
  };
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  latestExpirationDate: string | null;
  firstSeen: string;
  originalPurchaseDate: string | null;
  managementURL?: string;
}
