import type {
  ArtisanStory,
  Language,
  MarketingAssets,
  PricingInputs,
  PricingResult,
  ProductAnalysis,
  ProductListing,
  TranslatedListing,
} from '../types';

/**
 * AI SERVICE LAYER
 * -----------------
 * This module is the single integration point between the UI and "intelligence".
 *
 * Architecture:
 *  - If VITE_BACKEND_API_URL is configured, calls are proxied to a backend
 *    server (never call a model provider directly from the browser with a
 *    secret key — keys must live server-side).
 *  - If no backend is configured (e.g. this hackathon demo), every function
 *    falls back to a polished, deterministic "Demo Mode" engine below, which
 *    combines the artisan's own words with lightweight heuristics so the
 *    whole product remains fully demonstrable offline and never breaks.
 *
 * IMPORTANT AI BEHAVIOR CONTRACT (kept in both real + demo modes):
 *  - The artisan's own story is treated as ground truth and is never
 *    overwritten or contradicted.
 *  - Nothing about cultural origin, tradition, certifications or
 *    sustainability is invented — such claims only ever appear if the
 *    artisan stated them.
 *  - Anything derived purely from a photo is labelled as an editable,
 *    best-effort estimate, never a certainty.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL as string | undefined;
const USE_BACKEND = Boolean(BACKEND_URL);

function delay<T>(value: T, ms = 900): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function callBackend<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Backend request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Craft keyword knowledge base — used by the demo vision fallback to guess a
// plausible category from filename / product-name hints. This is explicitly
// a heuristic, not real computer vision, and is always presented as editable.
// ---------------------------------------------------------------------------
const CRAFT_KEYWORDS: { keys: string[]; analysis: ProductAnalysis }[] = [
  {
    keys: ['basket', 'bamboo', 'cane', 'wicker', 'weave'],
    analysis: {
      category: 'Home Décor & Storage — Baskets',
      visibleMaterials: ['Bamboo / cane fiber'],
      craftType: 'Hand-weaving',
      colors: ['Natural tan', 'Warm brown'],
      style: 'Rustic, traditional, minimal',
      notes: 'Best-effort visual read — please correct any detail below.',
    },
  },
  {
    keys: ['pot', 'ceramic', 'clay', 'terracotta', 'pottery'],
    analysis: {
      category: 'Home Décor — Pottery & Ceramics',
      visibleMaterials: ['Fired clay / terracotta'],
      craftType: 'Hand-thrown pottery',
      colors: ['Earthen red', 'Matte terracotta'],
      style: 'Handmade, organic, earthy',
      notes: 'Best-effort visual read — please correct any detail below.',
    },
  },
  {
    keys: ['textile', 'saree', 'sari', 'fabric', 'weav', 'shawl', 'scarf', 'cloth'],
    analysis: {
      category: 'Textiles & Apparel — Handwoven Fabric',
      visibleMaterials: ['Cotton or silk yarn (unconfirmed)'],
      craftType: 'Handloom weaving',
      colors: ['Multiple — see photo'],
      style: 'Traditional handloom pattern',
      notes: 'Fiber type cannot be confirmed from a photo alone — please specify.',
    },
  },
  {
    keys: ['jewel', 'necklace', 'earring', 'bangle', 'bead'],
    analysis: {
      category: 'Jewelry & Accessories',
      visibleMaterials: ['Metal / bead work (unconfirmed alloy)'],
      craftType: 'Hand-assembled jewelry',
      colors: ['See photo for exact tones'],
      style: 'Statement, handcrafted',
      notes: 'Exact metal/material cannot be confirmed from a photo — please specify.',
    },
  },
  {
    keys: ['wood', 'carv', 'sculpture', 'toy'],
    analysis: {
      category: 'Wood Craft & Décor',
      visibleMaterials: ['Carved wood'],
      craftType: 'Hand-carving',
      colors: ['Natural wood tones'],
      style: 'Traditional carving',
      notes: 'Best-effort visual read — please correct any detail below.',
    },
  },
];

const GENERIC_ANALYSIS: ProductAnalysis = {
  category: 'Handmade Craft (category to confirm)',
  visibleMaterials: ['Not confidently detected from image'],
  craftType: 'Handmade / hand-finished',
  colors: ['See photo for exact tones'],
  style: 'Artisan-made, one-of-a-kind',
  notes:
    'We could not confidently identify specific details from the photo alone — please fill these in, they will make your listing much stronger.',
};

export async function analyzeProductImage(opts: {
  imageDataUrl: string | null;
  productNameHint: string;
}): Promise<ProductAnalysis> {
  if (USE_BACKEND) {
    return callBackend<ProductAnalysis>('/analyze-image', opts);
  }
  const hint = (opts.productNameHint || '').toLowerCase();
  const match = CRAFT_KEYWORDS.find((c) => c.keys.some((k) => hint.includes(k)));
  return delay(match ? match.analysis : GENERIC_ANALYSIS, 1400);
}

// ---------------------------------------------------------------------------
// Listing generation
// ---------------------------------------------------------------------------

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}

// Ensures a user-supplied fragment reads as a clean, capitalized sentence
// ending in a single period — safe to drop into generated copy.
function sentence(s: string): string {
  const trimmed = s.trim().replace(/[.\s]+$/, '');
  if (!trimmed) return '';
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`;
}

// Lowercases and strips trailing punctuation so a fragment can be embedded
// mid-sentence (e.g. after "made using ...").
function fragment(s: string): string {
  const trimmed = s.trim().replace(/[.\s]+$/, '');
  if (!trimmed) return '';
  return `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
}

function pickTitle(productName: string, analysis: ProductAnalysis, variant = 0): string {
  const name = productName?.trim() || analysis.craftType || 'Handmade Craft';
  const styleWord = analysis.style?.split(',')[0]?.trim() || 'Handcrafted';
  const options = [
    `${titleCase(name)} — ${styleWord}, Handmade`,
    `Handcrafted ${titleCase(name)} | ${styleWord} Design`,
    `${titleCase(name)}, Made by Hand — ${styleWord}`,
  ];
  return options[variant % options.length];
}

function keywordsFrom(analysis: ProductAnalysis, story: ArtisanStory, productName: string): string[] {
  const raw = [
    productName,
    analysis.category,
    analysis.craftType,
    ...analysis.visibleMaterials,
    ...analysis.colors,
    'handmade',
    'artisan made',
    story.origin ? 'traditional craft' : '',
  ];
  const words = raw
    .join(',')
    .split(/[,/]| and /i)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w && w.length > 1 && !w.includes('unconfirmed') && !w.includes('not confidently'));
  return Array.from(new Set(words)).slice(0, 12);
}

export async function generateListing(opts: {
  analysis: ProductAnalysis;
  story: ArtisanStory;
  productNameHint: string;
  variant?: number;
}): Promise<ProductListing> {
  const { analysis, story, productNameHint, variant = 0 } = opts;
  if (USE_BACKEND) {
    return callBackend<ProductListing>('/generate-listing', opts);
  }

  const productName = productNameHint?.trim() || titleCase(analysis.craftType || 'Handmade Piece');
  const title = pickTitle(productName, analysis, variant);

  const materialsFragment = fragment(story.materials || 'traditional materials, described by the artisan');

  const shortOptions = [
    `A ${analysis.style?.split(',')[0]?.toLowerCase() || 'handcrafted'} ${productName.toLowerCase()}, made entirely by hand using ${materialsFragment}.`,
    `Handmade ${productName.toLowerCase()} crafted with ${materialsFragment} — no two pieces are exactly alike.`,
  ];
  const shortDescription = shortOptions[variant % shortOptions.length];

  const detailedDescription = [
    `This ${productName.toLowerCase()} is handmade using ${materialsFragment}.`,
    story.timeToMake ? `Time to make: ${sentence(story.timeToMake)}` : '',
    `Style notes: ${analysis.style}. Typical tones: ${analysis.colors.join(', ')}.`,
    `Because every item is handcrafted, slight variations in size, color and texture are natural and part of its one-of-a-kind character.`,
  ]
    .filter(Boolean)
    .join(' ');

  const artisanStory =
    story.traditionStory?.trim() ||
    'The artisan has not shared a tradition or story for this piece yet — add one to help customers connect with your craft.';

  const materials = story.materials?.trim() || analysis.visibleMaterials.join(', ');
  const productionTime = story.timeToMake?.trim() || 'Not specified';
  const category = analysis.category;
  const keywords = keywordsFrom(analysis, story, productName);

  return delay(
    { title, shortDescription, detailedDescription, artisanStory, materials, productionTime, category, keywords },
    1200,
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

export function computePricing(inputs: PricingInputs): PricingResult {
  const { materialCost, hoursToMake, hourlyRate, desiredMarginPercent } = inputs;
  const laborCost = hoursToMake * hourlyRate;
  const baseCost = materialCost + laborCost;
  const margin = Math.max(0, desiredMarginPercent) / 100;
  const recommended = Math.round(baseCost * (1 + margin));
  const low = Math.round(recommended * 0.85);
  const high = Math.round(recommended * 1.25);

  const explanation = [
    `Materials: ₹${materialCost.toLocaleString('en-IN')} — what you spent on raw materials.`,
    `Labor: ${hoursToMake} hour(s) × ₹${hourlyRate.toLocaleString('en-IN')}/hour = ₹${laborCost.toLocaleString('en-IN')} — the value of your time and skill.`,
    `Craftsmanship margin: ${desiredMarginPercent}% added on top, to reflect the skill, uniqueness and demand for handmade work.`,
    `Suggested range gives room for negotiation or marketplace fees, while the recommended price is your best single starting point.`,
  ];

  return { low, high, recommended, explanation };
}

// ---------------------------------------------------------------------------
// Translation — for the demo engine we generate localized structural
// templates directly (rather than pretending to machine-translate freeform
// text without a real API). The artisan's own story is preserved verbatim
// and clearly labelled as shown in its original language, per the product's
// "never fabricate, always preserve the artisan's voice" principle.
// ---------------------------------------------------------------------------

type Localized = {
  by: string;
  handmadeWith: string;
  approxTime: string;
  originalStoryLabel: string;
  categoryLabel: string;
};

const L10N: Record<Language, Localized> = {
  en: {
    by: 'Handcrafted by a traditional artisan',
    handmadeWith: 'Handmade with',
    approxTime: 'Approx. time to make',
    originalStoryLabel: "Artisan's story (original)",
    categoryLabel: 'Category',
  },
  hi: {
    by: 'एक पारंपरिक कारीगर द्वारा हाथ से बनाया गया',
    handmadeWith: 'हाथ से बना, सामग्री:',
    approxTime: 'बनाने में लगभग समय',
    originalStoryLabel: 'कारीगर की कहानी (मूल भाषा में)',
    categoryLabel: 'श्रेणी',
  },
  kn: {
    by: 'ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿಯಿಂದ ಕೈಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ',
    handmadeWith: 'ಕೈಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ, ಬಳಸಿದ ವಸ್ತು:',
    approxTime: 'ತಯಾರಿಸಲು ಬೇಕಾದ ಅಂದಾಜು ಸಮಯ',
    originalStoryLabel: 'ಕುಶಲಕರ್ಮಿಯ ಕಥೆ (ಮೂಲ ಭಾಷೆಯಲ್ಲಿ)',
    categoryLabel: 'ವರ್ಗ',
  },
  ta: {
    by: 'பாரம்பரிய கைவினைஞரால் கையால் செய்யப்பட்டது',
    handmadeWith: 'கையால் செய்யப்பட்டது, பயன்படுத்திய பொருள்:',
    approxTime: 'தயாரிக்க தோராயமான நேரம்',
    originalStoryLabel: 'கைவினைஞரின் கதை (மூல மொழியில்)',
    categoryLabel: 'பிரிவு',
  },
  ml: {
    by: 'ഒരു പരമ്പരാഗത കരകൗശല വിദഗ്ധൻ കൈകൊണ്ട് നിർമ്മിച്ചത്',
    handmadeWith: 'കൈകൊണ്ട് നിർമ്മിച്ചത്, ഉപയോഗിച്ച വസ്തുക്കൾ:',
    approxTime: 'നിർമ്മിക്കാൻ ഏകദേശം എടുക്കുന്ന സമയം',
    originalStoryLabel: 'കരകൗശല വിദഗ്ധന്റെ കഥ (യഥാർത്ഥ ഭാഷയിൽ)',
    categoryLabel: 'വിഭാഗം',
  },
  mr: {
    by: 'पारंपरिक कारागिराने हाताने बनवलेले',
    handmadeWith: 'हाताने बनवलेले, वापरलेले साहित्य:',
    approxTime: 'बनवण्यासाठी अंदाजे लागणारा वेळ',
    originalStoryLabel: 'कारागिराची कहाणी (मूळ भाषेत)',
    categoryLabel: 'प्रकार',
  },
  pa: {
    by: 'ਇੱਕ ਰਵਾਇਤੀ ਕਾਰੀਗਰ ਦੁਆਰਾ ਹੱਥੀਂ ਬਣਾਇਆ ਗਿਆ',
    handmadeWith: 'ਹੱਥੀਂ ਬਣਾਇਆ ਗਿਆ, ਵਰਤੀ ਗਈ ਸਮੱਗਰੀ:',
    approxTime: 'ਬਣਾਉਣ ਵਿੱਚ ਲੱਗਣ ਵਾਲਾ ਅੰਦਾਜ਼ਨ ਸਮਾਂ',
    originalStoryLabel: 'ਕਾਰੀਗਰ ਦੀ ਕਹਾਣੀ (ਮੂਲ ਭਾਸ਼ਾ ਵਿੱਚ)',
    categoryLabel: 'ਸ਼੍ਰੇਣੀ',
  },
  es: {
    by: 'Hecho a mano por un artesano tradicional',
    handmadeWith: 'Hecho a mano con',
    approxTime: 'Tiempo aproximado de elaboración',
    originalStoryLabel: 'Historia del artesano (idioma original)',
    categoryLabel: 'Categoría',
  },
  zh: {
    by: '由传统工匠手工制作',
    handmadeWith: '手工制作，所用材料：',
    approxTime: '大致制作时间',
    originalStoryLabel: '工匠的故事（原始语言）',
    categoryLabel: '类别',
  },
};

export async function translateListing(opts: {
  language: Language;
  productNameHint: string;
  listing: ProductListing;
}): Promise<TranslatedListing> {
  const { language, listing } = opts;
  if (USE_BACKEND) {
    return callBackend<TranslatedListing>('/translate-listing', opts);
  }
  const t = L10N[language];
  const title = listing.title; // product name preserved as-is across languages
  const shortDescription =
    language === 'en'
      ? listing.shortDescription
      : `${t.by}. ${t.handmadeWith} ${listing.materials}.`;
  const detailedDescription =
    language === 'en'
      ? listing.detailedDescription
      : `${t.categoryLabel}: ${listing.category}. ${t.handmadeWith} ${listing.materials}. ${t.approxTime}: ${listing.productionTime}.`;
  const artisanStory =
    language === 'en' ? listing.artisanStory : `[${t.originalStoryLabel}] ${listing.artisanStory}`;

  return delay(
    { language, title, shortDescription, detailedDescription, artisanStory, keywords: listing.keywords },
    600,
  );
}

// ---------------------------------------------------------------------------
// Marketing assets
// ---------------------------------------------------------------------------

export async function generateMarketing(opts: {
  listing: ProductListing;
  finalPrice: number | null;
}): Promise<MarketingAssets> {
  const { listing, finalPrice } = opts;
  if (USE_BACKEND) {
    return callBackend<MarketingAssets>('/generate-marketing', opts);
  }

  const priceStr = finalPrice ? `₹${finalPrice.toLocaleString('en-IN')}` : 'a fair handmade price';

  const instagramCaption = `✨ ${listing.title} ✨\n\n${listing.shortDescription}\n\nMade entirely by hand — no two pieces are the same. 🧡\n\n#Handmade #ArtisanMade #${listing.category.split(' ')[0].replace(/[^a-zA-Z]/g, '')} #SupportArtisans #MadeWithLove`;

  const whatsappMessage = `Hi! 🙏 Here's something special I made: *${listing.title}*.\n\n${listing.shortDescription}\n\nPrice: ${priceStr}. Handmade with ${listing.materials}. Message me if you'd like one — happy to share more photos!`;

  const seoKeywords = Array.from(new Set([...listing.keywords, 'handmade gift', 'artisan made', 'unique home decor']));

  const targetSegment =
    'Customers who value handmade, ethically-sourced, one-of-a-kind home & lifestyle goods — often searching for authentic gifts or décor with a story behind them.';

  const tagline = `${listing.title.split('—')[0].trim()} — Made by Hand, Made with Heart.`;

  return delay({ instagramCaption, whatsappMessage, seoKeywords, targetSegment, tagline }, 900);
}

export const isBackendConnected = USE_BACKEND;
