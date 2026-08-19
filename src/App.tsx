import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Ear, EarOff, Sparkles } from 'lucide-react';
import { ProgressStepper } from './components/ProgressStepper';
import { ReadOnHover } from './components/ReadOnHover';
import { I18nProvider, useT } from './i18n/I18nContext';
import { Landing } from './components/screens/Landing';
import { UploadScreen } from './components/screens/Upload';
import { StoryInput } from './components/screens/StoryInput';
import { Analysis } from './components/screens/Analysis';
import { ListingScreen } from './components/screens/ListingScreen';
import { Pricing } from './components/screens/Pricing';
import { Multilingual } from './components/screens/Multilingual';
import { Marketing } from './components/screens/Marketing';
import { Dashboard } from './components/screens/Dashboard';
import { Marketplace } from './components/screens/Marketplace';
import { ProductDetail } from './components/screens/ProductDetail';
import { Checkout } from './components/screens/Checkout';
import { OrderConfirmation } from './components/screens/OrderConfirmation';
import {
  analyzeProductImage,
  computePricing,
  generateListing,
  generateMarketing,
  translateListing,
} from './services/aiService';
import { downloadListing } from './services/exportListing';
import { loadMarketplaceProducts, makeId, publishListingToMarketplace } from './data/marketplace';
import { DEMO_ANALYSIS, DEMO_IMAGE_URL, DEMO_PRODUCT_NAME, DEMO_STORY } from './data/demoData';
import type { AppState, ArtisanStory, Language, Order, ProductAnalysis, ProductListing } from './types';
import { SPEECH_LOCALES } from './types';

const EMPTY_STORY: ArtisanStory = { materials: '', timeToMake: '', traditionStory: '', origin: '' };

const INITIAL_STATE: AppState = {
  screen: 1,
  imageDataUrl: null,
  imageFileName: null,
  productNameHint: '',
  story: EMPTY_STORY,
  analysis: null,
  listing: null,
  pricingInputs: { materialCost: 300, hoursToMake: 6, hourlyRate: 80, desiredMarginPercent: 40 },
  pricing: null,
  finalPrice: null,
  selectedLanguages: ['en', 'hi'],
  translations: {},
  marketing: null,
  isDemoMode: false,
  marketplaceId: null,
  uiLanguage: 'en',
};

function readOnHoverStorageGet(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('karigar-ai:read-on-hover') === 'true';
  } catch {
    return false;
  }
}

function readOnHoverStorageSet(value: boolean) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('karigar-ai:read-on-hover', String(value));
  } catch {
    /* storage may be unavailable — ignore */
  }
}

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [readOnHover, setReadOnHover] = useState(() => readOnHoverStorageGet());
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [listingVariant, setListingVariant] = useState(0);

  const [marketplaceProducts, setMarketplaceProducts] = useState(() => loadMarketplaceProducts());
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const patch = (p: Partial<AppState>) => setState((s) => ({ ...s, ...p }));
  const goto = (screen: number) => {
    patch({ screen });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const runAnalysis = async (opts?: { productNameHint?: string; imageDataUrl?: string | null }) => {
    goto(4);
    setAnalysisLoading(true);
    try {
      const result = await analyzeProductImage({
        imageDataUrl: opts?.imageDataUrl ?? state.imageDataUrl,
        productNameHint: opts?.productNameHint ?? state.productNameHint,
      });
      patch({ analysis: result });
    } catch {
      patch({ analysis: DEMO_ANALYSIS });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const runGenerateListing = async (variant = 0) => {
    goto(5);
    setListingLoading(true);
    try {
      const result = await generateListing({
        analysis: state.analysis as ProductAnalysis,
        story: state.story,
        productNameHint: state.productNameHint,
        variant,
      });
      patch({ listing: result });
    } finally {
      setListingLoading(false);
    }
  };

  const runPricing = () => {
    const result = computePricing(state.pricingInputs);
    patch({ pricing: result, finalPrice: result.recommended });
    goto(6);
  };

  const runTranslate = async () => {
    setTranslateLoading(true);
    try {
      const entries = await Promise.all(
        state.selectedLanguages.map((lang) =>
          translateListing({ language: lang, productNameHint: state.productNameHint, listing: state.listing as ProductListing }),
        ),
      );
      const translations = { ...state.translations };
      entries.forEach((t) => {
        translations[t.language] = t;
      });
      patch({ translations });
    } finally {
      setTranslateLoading(false);
    }
  };

  const runMarketing = async () => {
    goto(8);
    setMarketingLoading(true);
    try {
      const result = await generateMarketing({ listing: state.listing as ProductListing, finalPrice: state.finalPrice });
      patch({ marketing: result });
    } finally {
      setMarketingLoading(false);
    }
  };

  // Keeps <html lang> in sync with the chosen UI language — helps real
  // screen readers pick the right voice/pronunciation rules, on top of our
  // own Web Speech read-aloud features.
  useEffect(() => {
    document.documentElement.lang = SPEECH_LOCALES[state.uiLanguage].split('-')[0];
  }, [state.uiLanguage]);

  const toggleReadOnHover = () => {
    setReadOnHover((v) => {
      readOnHoverStorageSet(!v);
      return !v;
    });
  };

  const loadDemo = () => {
    setState((s) => ({
      ...INITIAL_STATE,
      screen: 3,
      imageDataUrl: DEMO_IMAGE_URL,
      imageFileName: 'demo-bamboo-basket.svg',
      productNameHint: DEMO_PRODUCT_NAME,
      story: DEMO_STORY,
      isDemoMode: true,
      // Keep whatever language(s) were already chosen on the home page.
      selectedLanguages: s.selectedLanguages,
      uiLanguage: s.uiLanguage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resets the wizard but deliberately keeps the chosen UI language(s) —
  // language is a site-wide preference, not something tied to one listing.
  const startOver = () => setState((s) => ({ ...INITIAL_STATE, selectedLanguages: s.selectedLanguages, uiLanguage: s.uiLanguage }));

  // Turning a language ON switches the site to it immediately (that's the
  // clearer intent — "I picked Marathi" should show Marathi right away,
  // regardless of where it lands in the array). Turning one OFF keeps the
  // current UI language if it's still selected, otherwise falls back to
  // whatever's left.
  const chooseLanguages = (langs: Language[], justSelected?: Language) => {
    setState((s) => ({
      ...s,
      selectedLanguages: langs,
      uiLanguage: justSelected ?? (langs.includes(s.uiLanguage) ? s.uiLanguage : (langs[0] ?? 'en')),
    }));
  };

  // Publish the finished listing to the shared marketplace as soon as the
  // artisan reaches the Dashboard. Reuses the same marketplaceId on repeat
  // visits so it updates in place rather than creating duplicates.
  useEffect(() => {
    if (state.screen !== 9 || !state.listing || !state.imageDataUrl) return;
    const id = state.marketplaceId ?? makeId();
    if (!state.marketplaceId) patch({ marketplaceId: id });
    publishListingToMarketplace(id, state);
    setMarketplaceProducts(loadMarketplaceProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen]);

  const goToMarketplace = () => {
    setMarketplaceProducts(loadMarketplaceProducts());
    setViewingProductId(null);
    goto(10);
  };

  const viewProduct = (id: string) => {
    setViewingProductId(id);
    goto(11);
  };

  const buyNow = (quantity: number) => {
    setCheckoutQuantity(quantity);
    goto(12);
  };

  const viewingProduct = marketplaceProducts.find((p) => p.id === viewingProductId) ?? null;

  const placeOrder = (details: { shippingName: string; paymentMethod: 'card' | 'upi' | 'cod' }) => {
    if (!viewingProduct) return;
    const subtotal = viewingProduct.price * checkoutQuantity;
    const shipping = subtotal >= 999 ? 0 : 49;
    const order: Order = {
      id: makeId().slice(0, 8).toUpperCase(),
      product: viewingProduct,
      quantity: checkoutQuantity,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod: details.paymentMethod,
      shippingName: details.shippingName,
      createdAt: Date.now(),
    };
    setLastOrder(order);
    goto(13);
  };

  return (
    <I18nProvider language={state.uiLanguage}>
      <div className="min-h-screen">
        <SkipLink />
        <ReadOnHover enabled={readOnHover} lang={SPEECH_LOCALES[state.uiLanguage]} />
        <Header
          isDemoMode={state.isDemoMode}
          screen={state.screen}
          onLogoClick={startOver}
          readOnHover={readOnHover}
          onToggleReadOnHover={toggleReadOnHover}
        />

      <main id="main-content">
        <AnimatePresence mode="wait">
          {state.screen === 1 && (
            <Landing
              key="landing"
              onStart={() => goto(2)}
              onTryDemo={loadDemo}
              onGoToMarketplace={goToMarketplace}
              selectedLanguages={state.selectedLanguages}
              uiLanguage={state.uiLanguage}
              onChooseLanguages={chooseLanguages}
              readOnHover={readOnHover}
              onToggleReadOnHover={toggleReadOnHover}
            />
          )}

          {state.screen === 2 && (
            <div key="upload" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <UploadScreen
                imageDataUrl={state.imageDataUrl}
                productNameHint={state.productNameHint}
                onImageChange={(dataUrl, fileName) => patch({ imageDataUrl: dataUrl, imageFileName: fileName })}
                onProductNameChange={(name) => patch({ productNameHint: name })}
                onAnalyze={() => goto(3)}
                onBack={() => goto(1)}
              />
            </div>
          )}

          {state.screen === 3 && (
            <div key="story" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <StoryInput
                story={state.story}
                onChange={(story) => patch({ story })}
                onGenerate={() => runAnalysis()}
                onBack={() => goto(2)}
              />
            </div>
          )}

          {state.screen === 4 && (
            <div key="analysis" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <Analysis
                imageDataUrl={state.imageDataUrl}
                isLoading={analysisLoading}
                analysis={state.analysis}
                onChange={(analysis) => patch({ analysis })}
                onContinue={() => runGenerateListing(0)}
                onBack={() => goto(3)}
              />
            </div>
          )}

          {state.screen === 5 && (
            <div key="listing" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <ListingScreen
                isLoading={listingLoading}
                listing={state.listing}
                onChange={(listing) => patch({ listing })}
                onRegenerate={() => {
                  const nextVariant = listingVariant + 1;
                  setListingVariant(nextVariant);
                  runGenerateListing(nextVariant);
                }}
                onContinue={runPricing}
                onBack={() => goto(4)}
              />
            </div>
          )}

          {state.screen === 6 && (
            <div key="pricing" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <Pricing
                inputs={state.pricingInputs}
                onInputsChange={(pricingInputs) => {
                  const result = computePricing(pricingInputs);
                  patch({ pricingInputs, pricing: result, finalPrice: result.recommended });
                }}
                pricing={state.pricing}
                finalPrice={state.finalPrice}
                onFinalPriceChange={(finalPrice) => patch({ finalPrice })}
                onContinue={() => goto(7)}
                onBack={() => goto(5)}
              />
            </div>
          )}

          {state.screen === 7 && (
            <div key="multilingual" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <Multilingual
                selectedLanguages={state.selectedLanguages}
                translations={state.translations}
                isLoading={translateLoading}
                onTranslate={runTranslate}
                onContinue={runMarketing}
                onBack={() => goto(6)}
              />
            </div>
          )}

          {state.screen === 8 && (
            <div key="marketing" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <Marketing
                isLoading={marketingLoading}
                marketing={state.marketing}
                onChange={(marketing) => patch({ marketing })}
                onContinue={() => goto(9)}
                onBack={() => goto(7)}
              />
            </div>
          )}

          {state.screen === 9 && (
            <div key="dashboard" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <Dashboard
                state={state}
                onExport={() => downloadListing(state)}
                onStartOver={startOver}
                onGoToMarketplace={goToMarketplace}
              />
            </div>
          )}

          {state.screen === 10 && (
            <div key="marketplace" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
              <Marketplace products={marketplaceProducts} onSelect={viewProduct} onBack={() => goto(state.listing ? 9 : 1)} />
            </div>
          )}

          {state.screen === 11 && viewingProduct && (
            <div key="product-detail" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <ProductDetail product={viewingProduct} onBuyNow={buyNow} onBack={() => goto(10)} />
            </div>
          )}

          {state.screen === 12 && viewingProduct && (
            <div key="checkout" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <Checkout
                product={viewingProduct}
                quantity={checkoutQuantity}
                onPlaceOrder={placeOrder}
                onBack={() => goto(11)}
              />
            </div>
          )}

          {state.screen === 13 && lastOrder && (
            <div key="order-confirmation" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
              <OrderConfirmation
                order={lastOrder}
                onContinueShopping={goToMarketplace}
                onBackToHome={startOver}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

        <Footer />
      </div>
    </I18nProvider>
  );
}

function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-terracotta-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
    >
      {t('skip.toContent')}
    </a>
  );
}

function Header({
  isDemoMode,
  screen,
  onLogoClick,
  readOnHover,
  onToggleReadOnHover,
}: {
  isDemoMode: boolean;
  screen: number;
  onLogoClick: () => void;
  readOnHover: boolean;
  onToggleReadOnHover: () => void;
}) {
  const t = useT();
  return (
    <header className="sticky top-0 z-30 border-b border-terracotta-100/60 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button onClick={onLogoClick} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-terracotta-500 text-white">
            <Sparkles size={16} />
          </div>
          <span className="font-display text-lg font-bold text-ink-900">Karvaan AI</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleReadOnHover}
            aria-pressed={readOnHover}
            title={t(readOnHover ? 'a11y.readOnHoverOn' : 'a11y.readOnHoverOff')}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              readOnHover
                ? 'border-teal-600 bg-teal-600 text-white'
                : 'border-teal-200 bg-white text-teal-700 hover:bg-teal-50'
            }`}
          >
            {readOnHover ? <Ear size={14} /> : <EarOff size={14} />}
            <span className="hidden sm:inline">{t(readOnHover ? 'a11y.readOnHoverOn' : 'a11y.readOnHoverOff')}</span>
          </button>
          {isDemoMode && (
            <span className="rounded-full bg-ochre-100 px-3 py-1 text-xs font-bold text-ochre-700">{t('header.demoMode')}</span>
          )}
        </div>
      </div>
      {screen >= 2 && screen <= 9 && <ProgressStepper current={screen} />}
    </header>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-terracotta-100 py-6 text-center text-xs text-ink-700/40">
      {t('footer.tagline')}
    </footer>
  );
}
