import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ProgressStepper } from './components/ProgressStepper';
import { Landing } from './components/screens/Landing';
import { UploadScreen } from './components/screens/Upload';
import { StoryInput } from './components/screens/StoryInput';
import { Analysis } from './components/screens/Analysis';
import { ListingScreen } from './components/screens/ListingScreen';
import { Pricing } from './components/screens/Pricing';
import { Multilingual } from './components/screens/Multilingual';
import { Marketing } from './components/screens/Marketing';
import { Dashboard } from './components/screens/Dashboard';
import {
  analyzeProductImage,
  computePricing,
  generateListing,
  generateMarketing,
  translateListing,
} from './services/aiService';
import { downloadListing } from './services/exportListing';
import { DEMO_ANALYSIS, DEMO_IMAGE_URL, DEMO_PRODUCT_NAME, DEMO_STORY } from './data/demoData';
import type { AppState, ArtisanStory, Language, ProductAnalysis, ProductListing } from './types';

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
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [listingVariant, setListingVariant] = useState(0);

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

  const toggleLanguage = (lang: Language) => {
    const has = state.selectedLanguages.includes(lang);
    patch({ selectedLanguages: has ? state.selectedLanguages.filter((l) => l !== lang) : [...state.selectedLanguages, lang] });
  };

  const loadDemo = () => {
    setState({
      ...INITIAL_STATE,
      screen: 3,
      imageDataUrl: DEMO_IMAGE_URL,
      imageFileName: 'demo-bamboo-basket.jpg',
      productNameHint: DEMO_PRODUCT_NAME,
      story: DEMO_STORY,
      isDemoMode: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startOver = () => setState(INITIAL_STATE);

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-30 border-b border-terracotta-100/60 bg-cream-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={startOver} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-terracotta-500 text-white">
              <Sparkles size={16} />
            </div>
            <span className="font-display text-lg font-bold text-ink-900">Karigar AI</span>
          </button>
          {state.isDemoMode && (
            <span className="rounded-full bg-ochre-100 px-3 py-1 text-xs font-bold text-ochre-700">Sample Demo Mode</span>
          )}
        </div>
        {state.screen >= 2 && state.screen <= 9 && <ProgressStepper current={state.screen} />}
      </header>

      <main>
        <AnimatePresence mode="wait">
          {state.screen === 1 && (
            <Landing key="landing" onStart={() => goto(2)} onTryDemo={loadDemo} />
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
                onToggleLanguage={toggleLanguage}
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
              <Dashboard state={state} onExport={() => downloadListing(state)} onStartOver={startOver} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-terracotta-100 py-6 text-center text-xs text-ink-700/40">
        Karigar AI — a hackathon concept. "You make the craft. We handle the digital world."
      </footer>
    </div>
  );
}
