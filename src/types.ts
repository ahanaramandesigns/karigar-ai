// Core domain types for Karigar AI

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'ml' | 'mr' | 'es' | 'zh';

export const LANGUAGE_LABELS: Record<Language, { name: string; native: string; flag: string }> = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ta: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  ml: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  mr: { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  zh: { name: 'Mandarin', native: '中文', flag: '🇨🇳' },
};

// BCP-47 locale tags used to pick a text-to-speech voice (Web Speech
// SpeechSynthesis) matching each listing language — see useTextToSpeech.
export const SPEECH_LOCALES: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  es: 'es-ES',
  zh: 'zh-CN',
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
