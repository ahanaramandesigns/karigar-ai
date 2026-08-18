// Core domain types for Karigar AI

export type Language = 'en' | 'hi' | 'kn' | 'es' | 'fr';

export const LANGUAGE_LABELS: Record<Language, { name: string; native: string; flag: string }> = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
};

export interface ArtisanStory {
  materials: string;
  timeToMake: string;
  traditionStory: string;
  origin: string;
  productNameHint?: string;
}

export interface AIAnalysisField<T> {
  value: T;
  confidence: 'estimated' | 'likely' | 'uncertain';
  editable: true;
}

export interface ProductAnalysis {
  category: string;
  visibleMaterials: string[];
  craftType: string;
  colors: string[];
  style: string;
  notes: string;
}

export interface ProductListing {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  artisanStory: string;
  materials: string;
  productionTime: string;
  category: string;
  keywords: string[];
}

export interface PricingInputs {
  materialCost: number;
  hoursToMake: number;
  hourlyRate: number;
  desiredMarginPercent: number;
}

export interface PricingResult {
  low: number;
  high: number;
  recommended: number;
  explanation: string[];
}

export interface TranslatedListing {
  language: Language;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  artisanStory: string;
  keywords: string[];
}

export interface MarketingAssets {
  instagramCaption: string;
  whatsappMessage: string;
  seoKeywords: string[];
  targetSegment: string;
  tagline: string;
}

export interface AppState {
  screen: number;
  imageDataUrl: string | null;
  imageFileName: string | null;
  productNameHint: string;
  story: ArtisanStory;
  analysis: ProductAnalysis | null;
  listing: ProductListing | null;
  pricingInputs: PricingInputs;
  pricing: PricingResult | null;
  finalPrice: number | null;
  selectedLanguages: Language[];
  translations: Partial<Record<Language, TranslatedListing>>;
  marketing: MarketingAssets | null;
  isDemoMode: boolean;
}
