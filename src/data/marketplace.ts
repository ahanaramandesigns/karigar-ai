import type { AppState, Language, MarketplaceProduct } from '../types';

// The "marketplace" is a shared shelf of every finished listing, so
// consumers can browse and buy what karigars have made with the AI tool.
//
// IMPORTANT — this is a frontend-only demo, per the project's brief (see
// README: "out of scope: payments, authentication, a full marketplace").
// There is no backend or database, so this store lives in the browser's
// localStorage. That means it reflects every product finished *on this
// device/browser* — it is not shared across different users' computers.
// A real multi-artisan marketplace would need a backend API and a database
// behind it; wiring that up is a natural next step, not something a
// static site can do on its own.

const STORAGE_KEY = 'karigar-ai:marketplace-products';

export function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function readAll(): MarketplaceProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MarketplaceProduct[]) : [];
  } catch {
    return []; // storage unavailable or corrupted — fail quiet, not broken
  }
}

function writeAll(products: MarketplaceProduct[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    /* storage may be unavailable (private browsing, quota) — ignore */
  }
}

export function loadMarketplaceProducts(): MarketplaceProduct[] {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

// Publishes (or re-publishes, if the artisan edits and revisits) one
// finished listing under a stable id so it shows up once, not duplicated.
export function publishListingToMarketplace(id: string, state: AppState): MarketplaceProduct | null {
  if (!state.listing || !state.imageDataUrl) return null;
  const existing = readAll();
  const priorCreatedAt = existing.find((p) => p.id === id)?.createdAt;
  const product: MarketplaceProduct = {
    id,
    imageDataUrl: state.imageDataUrl,
    title: state.listing.title,
    shortDescription: state.listing.shortDescription,
    detailedDescription: state.listing.detailedDescription,
    artisanStory: state.listing.artisanStory,
    category: state.listing.category,
    keywords: state.listing.keywords,
    price: state.finalPrice ?? state.pricing?.recommended ?? 0,
    createdAt: priorCreatedAt ?? Date.now(),
    translations: state.translations,
  };
  const next = existing.filter((p) => p.id !== id);
  next.push(product);
  writeAll(next);
  return product;
}

// Resolves what to actually show a shopper for a given product, in their
// chosen site language — the translated version if the artisan produced
// one for that language, otherwise the artisan's original-language text
// (never a fabricated translation). `wasTranslated` tells the UI whether to
// show the "not yet translated into this language" note.
export function resolveProductContent(product: MarketplaceProduct, lang: Language) {
  const translated = product.translations?.[lang];
  if (translated) {
    return {
      title: translated.title,
      shortDescription: translated.shortDescription,
      detailedDescription: translated.detailedDescription,
      artisanStory: translated.artisanStory,
      wasTranslated: true,
    };
  }
  return {
    title: product.title,
    shortDescription: product.shortDescription,
    detailedDescription: product.detailedDescription,
    artisanStory: product.artisanStory,
    wasTranslated: false,
  };
}
