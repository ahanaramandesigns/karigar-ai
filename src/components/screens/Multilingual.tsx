import { useState } from 'react';
import { Globe2, Loader2, Sparkles } from 'lucide-react';
import { Card, CopyButton, EyebrowTitle, GhostButton, PrimaryButton, SpeakButton } from '../ui';
import { useT } from '../../i18n/I18nContext';
import { LANGUAGE_LABELS, SPEECH_LOCALES, type Language, type TranslatedListing } from '../../types';

interface Props {
  selectedLanguages: Language[];
  translations: Partial<Record<Language, TranslatedListing>>;
  isLoading: boolean;
  onTranslate: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Multilingual({ selectedLanguages, translations, isLoading, onTranslate, onContinue, onBack }: Props) {
  const t = useT();
  const available = (Object.keys(translations) as Language[]).filter((l) => translations[l]);
  const [activeTab, setActiveTab] = useState<Language | null>(available[0] ?? null);
  const active = activeTab && translations[activeTab] ? translations[activeTab] : available.length ? translations[available[0]] : null;

  return (
    <div>
      <EyebrowTitle
        eyebrow={t('nav.stepOf', { n: 6, total: 8 })}
        title={t('multilingual.title')}
        subtitle={t('multilingual.subtitle')}
        icon={<Globe2 size={14} />}
      />

      <Card className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-700/50">{t('multilingual.chosenLabel')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedLanguages.map((lang) => (
              <span
                key={lang}
                className="flex items-center gap-1.5 rounded-2xl border-2 border-terracotta-400 bg-terracotta-50 px-3 py-1.5 text-sm font-semibold text-terracotta-700"
              >
                <span className="text-lg">{LANGUAGE_LABELS[lang].flag}</span>
                {LANGUAGE_LABELS[lang].name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 text-center">
          <PrimaryButton onClick={onTranslate} disabled={isLoading || selectedLanguages.length === 0}>
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Globe2 size={18} />}
            {isLoading ? t('multilingual.translatingBtn') : t('multilingual.translateBtn', { n: selectedLanguages.length })}
          </PrimaryButton>
        </div>

        {available.length > 0 && (
          <div>
            <div className="mb-4 flex flex-wrap gap-2 border-b border-cream-300 pb-3">
              {available.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                    (activeTab ?? available[0]) === lang ? 'bg-teal-600 text-white' : 'bg-cream-200 text-ink-700/60 hover:bg-cream-300'
                  }`}
                >
                  {LANGUAGE_LABELS[lang].flag} {LANGUAGE_LABELS[lang].name}
                </button>
              ))}
            </div>

            {active && (
              <div className="space-y-4 rounded-2xl bg-cream-100 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-display text-lg font-semibold text-ink-900">{active.title}</h4>
                  <div className="flex shrink-0 items-center gap-1">
                    <SpeakButton text={active.title} lang={SPEECH_LOCALES[active.language]} />
                    <CopyButton text={active.title} />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-ink-800">{active.shortDescription}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    <SpeakButton text={active.shortDescription} lang={SPEECH_LOCALES[active.language]} />
                    <CopyButton text={active.shortDescription} />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-ink-700/80">{active.detailedDescription}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    <SpeakButton text={active.detailedDescription} lang={SPEECH_LOCALES[active.language]} />
                    <CopyButton text={active.detailedDescription} />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50/60 p-3">
                  <p className="text-sm italic text-teal-900">{active.artisanStory}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    <SpeakButton text={active.artisanStory} lang={SPEECH_LOCALES[active.language]} />
                    <CopyButton text={active.artisanStory} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="mx-auto mt-8 flex max-w-3xl flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <GhostButton onClick={onBack}>{t('common.back')}</GhostButton>
        <PrimaryButton onClick={onContinue} disabled={available.length === 0} className="w-full sm:w-auto">
          <Sparkles size={18} />
          {t('multilingual.continueBtn')}
        </PrimaryButton>
      </div>
    </div>
  );
}
