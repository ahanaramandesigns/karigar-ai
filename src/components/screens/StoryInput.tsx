import { Mic, MicOff, Sparkles, BookHeart } from 'lucide-react';
import { Card, EyebrowTitle, FieldLabel, PrimaryButton, GhostButton, SpeakButton } from '../ui';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { SPEECH_LOCALES } from '../../types';
import type { ArtisanStory } from '../../types';

interface Props {
  story: ArtisanStory;
  onChange: (story: ArtisanStory) => void;
  onGenerate: () => void;
  onBack: () => void;
}

function QuestionBlock({
  label,
  field,
  placeholder,
  value,
  onUpdate,
  micLabel,
  listeningNote,
  lang,
}: {
  label: string;
  field: keyof ArtisanStory;
  placeholder: string;
  value: string;
  onUpdate: (field: keyof ArtisanStory, val: string) => void;
  micLabel: string;
  listeningNote: string;
  lang: string;
}) {
  const { isSupported, isListening, error, start, stop } = useVoiceInput((text) =>
    onUpdate(field, value ? `${value} ${text}` : text),
  );

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-1.5">
        <FieldLabel>{label}</FieldLabel>
        <SpeakButton text={label} lang={lang} className="-mt-2" />
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onUpdate(field, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-4 py-3 pr-14 text-base text-ink-900 outline-none transition-colors focus:border-terracotta-400"
        />
        {isSupported && (
          <button
            type="button"
            onClick={isListening ? stop : start}
            title={micLabel}
            aria-label={micLabel}
            className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-colors ${
              isListening ? 'animate-pulse-ring bg-terracotta-600' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
      </div>
      {isListening && <p className="mt-1.5 text-xs font-semibold text-teal-700">{listeningNote}</p>}
      {error && <p className="mt-1.5 text-xs font-semibold text-terracotta-600">{error}</p>}
    </div>
  );
}

export function StoryInput({ story, onChange, onGenerate, onBack }: Props) {
  const t = useT();
  const update = (field: keyof ArtisanStory, val: string) => onChange({ ...story, [field]: val });
  const canContinue = story.materials.trim() && story.timeToMake.trim();
  const uiLang = useUILanguage();
  const speechLang = SPEECH_LOCALES[uiLang]; // the question labels are in the UI language, so read them back in it too

  return (
    <div>
      <EyebrowTitle
        eyebrow={t('nav.stepOf', { n: 2, total: 8 })}
        title={t('story.title')}
        subtitle={t('story.subtitle')}
        icon={<BookHeart size={14} />}
      />

      <Card className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          <Mic size={16} className="shrink-0" />
          {t('story.micBanner')}
        </div>

        <QuestionBlock
          label={t('story.q1Label')}
          field="materials"
          placeholder={t('story.q1Placeholder')}
          value={story.materials}
          onUpdate={update}
          micLabel={t('story.micAriaLabel')}
          listeningNote={t('story.listeningNote')}
          lang={speechLang}
        />
        <QuestionBlock
          label={t('story.q2Label')}
          field="timeToMake"
          placeholder={t('story.q2Placeholder')}
          value={story.timeToMake}
          onUpdate={update}
          micLabel={t('story.micAriaLabel')}
          listeningNote={t('story.listeningNote')}
          lang={speechLang}
        />
        <QuestionBlock
          label={t('story.q3Label')}
          field="traditionStory"
          placeholder={t('story.q3Placeholder')}
          value={story.traditionStory}
          onUpdate={update}
          micLabel={t('story.micAriaLabel')}
          listeningNote={t('story.listeningNote')}
          lang={speechLang}
        />
        <QuestionBlock
          label={t('story.q4Label')}
          field="origin"
          placeholder={t('story.q4Placeholder')}
          value={story.origin}
          onUpdate={update}
          micLabel={t('story.micAriaLabel')}
          listeningNote={t('story.listeningNote')}
          lang={speechLang}
        />

        <p className="mt-2 text-xs text-ink-700/50">{t('story.footerNote')}</p>

        <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          <GhostButton onClick={onBack}>{t('common.back')}</GhostButton>
          <PrimaryButton onClick={onGenerate} disabled={!canContinue} className="w-full sm:w-auto">
            <Sparkles size={18} />
            {t('story.generateBtn')}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
