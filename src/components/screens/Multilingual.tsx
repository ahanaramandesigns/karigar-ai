import { useState } from 'react';
import { Globe2, Loader2, Sparkles } from 'lucide-react';
import { Card, CopyButton, EyebrowTitle, GhostButton, PrimaryButton, SpeakButton } from '../ui';
import { LANGUAGE_LABELS, SPEECH_LOCALES, type Language, type TranslatedListing } from '../../types';

interface Props {
  selectedLanguages: Language[];
  onToggleLanguage: (lang: Language) => void;
  translations: Partial<Record<Language, TranslatedListing>>;
  isLoading: boolean;
  onTranslate: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Multilingual({ selectedLanguages, onToggleLanguage, translations, isLoading, onTranslate, onContinue, onBack }: Props) {
  const available = (Object.keys(translations) as Language[]).filter((l) => translations[l]);
  const [activeTab, setActiveTab] = useState<Language | null>(available[0] ?? null);
  const active = activeTab && translations[activeTab] ? translations[activeTab] : available.length ? translations[available[0]] : null;

  return (
    <div>
      <EyebrowTitle
        eyebrow="Step 6 of 8"
        title="Reach Customers in Their Language"
        subtitle="Choose the languages you want your listing translated into."
        icon={<Globe2 size={14} />}
      />

      <Card className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => {
            const info = LANGUAGE_LABELS[lang];
            const selected = selectedLanguages.includes(lang);
            return (
              <button
                key={lang}
                onClick={() => onToggleLanguage(lang)}
                className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  selected ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-700' : 'border-cream-300 bg-white text-ink-700/70 hover:border-terracotta-200'
                }`}
              >
                <span className="text-lg">{info.flag}</span>
                {info.name}
                <span className="text-xs text-ink-700/40">({info.native})</span>
              </button>
            );
          })}
        </div>

        <div className="mb-6 text-center">
          <PrimaryButton onClick={onTranslate} disabled={isLoading || selectedLanguages.length === 0}>
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Globe2 size={18} />}
            {isLoading ? 'Translating...' : `Translate to ${selectedLanguages.length || ''} language${selectedLanguages.length === 1 ? '' : 's'}`}
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
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <PrimaryButton onClick={onContinue} disabled={available.length === 0} className="w-full sm:w-auto">
          <Sparkles size={18} />
          Continue to Marketing
        </PrimaryButton>
      </div>
    </div>
  );
}
