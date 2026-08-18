import { Camera, Loader2, MessageCircle, Search, Sparkles, Tag, Target } from 'lucide-react';
import { Card, CopyButton, EyebrowTitle, GhostButton, PrimaryButton, SpeakButton } from '../ui';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { SPEECH_LOCALES } from '../../types';
import type { MarketingAssets } from '../../types';

interface Props {
  isLoading: boolean;
  marketing: MarketingAssets | null;
  onChange: (m: MarketingAssets) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Marketing({ isLoading, marketing, onChange, onContinue, onBack }: Props) {
  const t = useT();
  const lang = SPEECH_LOCALES[useUILanguage()];

  if (isLoading || !marketing) {
    return (
      <div>
        <EyebrowTitle eyebrow={t('nav.stepOf', { n: 7, total: 8 })} title={t('marketing.loadingTitle')} icon={<Sparkles size={14} />} />
        <Card className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 py-16 text-center" role="status" aria-live="polite">
          <Loader2 className="animate-spin text-terracotta-500" size={36} />
          <p className="font-semibold text-ink-800">{t('marketing.loadingText')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <EyebrowTitle
        eyebrow={t('nav.stepOf', { n: 7, total: 8 })}
        title={t('marketing.title')}
        subtitle={t('marketing.subtitle')}
        icon={<Sparkles size={14} />}
      />

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <Camera size={16} className="text-terracotta-500" /> {t('marketing.instagramLabel')}
            </div>
            <div className="flex items-center gap-1">
              <SpeakButton text={marketing.instagramCaption} lang={lang} />
              <CopyButton text={marketing.instagramCaption} />
            </div>
          </div>
          <textarea
            value={marketing.instagramCaption}
            onChange={(e) => onChange({ ...marketing, instagramCaption: e.target.value })}
            rows={6}
            className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
          />
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <MessageCircle size={16} className="text-teal-600" /> {t('marketing.whatsappLabel')}
            </div>
            <div className="flex items-center gap-1">
              <SpeakButton text={marketing.whatsappMessage} lang={lang} />
              <CopyButton text={marketing.whatsappMessage} />
            </div>
          </div>
          <textarea
            value={marketing.whatsappMessage}
            onChange={(e) => onChange({ ...marketing, whatsappMessage: e.target.value })}
            rows={6}
            className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-teal-400"
          />
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900">
            <Search size={16} className="text-ochre-600" /> {t('marketing.keywordsLabel')}
          </div>
          <div className="flex flex-wrap gap-2">
            {marketing.seoKeywords.map((k) => (
              <span key={k} className="rounded-full bg-ochre-50 px-3 py-1 text-xs font-semibold text-ochre-800">
                {k}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <Target size={16} className="text-terracotta-500" /> {t('marketing.targetLabel')}
            </div>
            <SpeakButton text={marketing.targetSegment} lang={lang} />
          </div>
          <p className="text-sm text-ink-700/80">{marketing.targetSegment}</p>
        </Card>

        <Card className="sm:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <Tag size={16} className="text-terracotta-500" /> {t('marketing.taglineLabel')}
            </div>
            <div className="flex items-center gap-1">
              <SpeakButton text={marketing.tagline} lang={lang} />
              <CopyButton text={marketing.tagline} />
            </div>
          </div>
          <input
            value={marketing.tagline}
            onChange={(e) => onChange({ ...marketing, tagline: e.target.value })}
            className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 font-display text-base font-semibold text-ink-900 outline-none focus:border-terracotta-400"
          />
        </Card>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <GhostButton onClick={onBack}>{t('common.back')}</GhostButton>
        <PrimaryButton onClick={onContinue} className="w-full sm:w-auto">
          <Sparkles size={18} />
          {t('marketing.continueBtn')}
        </PrimaryButton>
      </div>
    </div>
  );
}
