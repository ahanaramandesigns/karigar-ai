import { CheckCircle2, Download, Globe2, RotateCcw, ShoppingBag, Store } from 'lucide-react';
import { Card, EyebrowTitle, PrimaryButton, SecondaryButton, SpeakButton } from '../ui';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { LANGUAGE_LABELS, SPEECH_LOCALES } from '../../types';
import type { AppState } from '../../types';

interface Props {
  state: AppState;
  onExport: () => void;
  onStartOver: () => void;
  onGoToMarketplace: () => void;
}

export function Dashboard({ state, onExport, onStartOver, onGoToMarketplace }: Props) {
  const t = useT();
  const lang = SPEECH_LOCALES[useUILanguage()];
  const { imageDataUrl, listing, pricing, finalPrice, translations, marketing, selectedLanguages } = state;
  const price = finalPrice ?? pricing?.recommended;

  return (
    <div>
      <EyebrowTitle
        eyebrow={t('nav.stepComplete', { n: 8, total: 8 })}
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        icon={<CheckCircle2 size={14} />}
      />

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          {imageDataUrl && (
            <Card className="p-3">
              <img src={imageDataUrl} alt={listing?.title} className="aspect-square w-full rounded-2xl object-cover" />
            </Card>
          )}
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{t('dashboard.startingPriceLabel')}</p>
              {price != null && <SpeakButton text={`${t('dashboard.startingPriceLabel')}: ${price}`} lang={lang} />}
            </div>
            <p className="font-display text-3xl font-semibold text-terracotta-600">
              {price ? `₹${price.toLocaleString('en-IN')}` : '—'}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedLanguages.map((l) => (
                <span key={l} className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">
                  {LANGUAGE_LABELS[l].flag} {LANGUAGE_LABELS[l].name}
                </span>
              ))}
            </div>
          </Card>
          <PrimaryButton onClick={onExport} className="w-full">
            <Download size={18} />
            {t('dashboard.downloadBtn')}
          </PrimaryButton>
          <SecondaryButton onClick={onStartOver} className="w-full">
            <RotateCcw size={16} />
            {t('dashboard.startNewBtn')}
          </SecondaryButton>
          <SecondaryButton onClick={onGoToMarketplace} className="w-full">
            <Store size={16} />
            {t('dashboard.marketplaceBtn')}
          </SecondaryButton>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-ink-900">{listing?.title}</h3>
              <SpeakButton
                text={[listing?.title, listing?.shortDescription, listing?.detailedDescription, listing?.artisanStory]
                  .filter(Boolean)
                  .join('. ')}
                lang={lang}
              />
            </div>
            <p className="mt-2 text-sm text-ink-700/80">{listing?.shortDescription}</p>
            <p className="mt-3 text-sm text-ink-700/70">{listing?.detailedDescription}</p>
            <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50/50 p-3 text-sm italic text-teal-900">
              {listing?.artisanStory}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {listing?.keywords.map((k) => (
                <span key={k} className="rounded-full bg-cream-200 px-2.5 py-1 text-[11px] font-semibold text-ink-700/70">
                  #{k.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </Card>

          {marketing && (
            <Card>
              <h4 className="mb-2 font-display text-base font-semibold text-ink-900">{t('dashboard.marketingTaglineLabel')}</h4>
              <p className="text-sm font-semibold text-terracotta-600">{marketing.tagline}</p>
            </Card>
          )}

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-800">
              <Globe2 size={16} /> {t('dashboard.exportHeading')}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { name: 'Etsy', icon: Store },
                { name: 'Amazon Karigar', icon: ShoppingBag },
                { name: 'ONDC', icon: Globe2 },
              ].map(({ name, icon: Icon }) => (
                <div key={name} className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-700/20 bg-cream-100 p-5 text-center">
                  <Icon className="text-ink-700/50" size={22} />
                  <span className="text-sm font-bold text-ink-800">{name}</span>
                  <span className="rounded-full bg-cream-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-700/60">
                    {t('dashboard.futureIntegration')}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-ink-700/40">{t('dashboard.exportNote')}</p>
          </div>

          {Object.keys(translations).length > 0 && (
            <p className="text-center text-sm font-semibold text-ink-900">{t('dashboard.celebration')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
