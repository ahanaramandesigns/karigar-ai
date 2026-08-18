import { ScanEye, Sparkles, Loader2 } from 'lucide-react';
import { Card, ConfidenceBadge, EyebrowTitle, FieldLabel, GhostButton, PrimaryButton, SpeakButton } from '../ui';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { SPEECH_LOCALES } from '../../types';
import type { ProductAnalysis } from '../../types';

interface Props {
  imageDataUrl: string | null;
  isLoading: boolean;
  analysis: ProductAnalysis | null;
  onChange: (a: ProductAnalysis) => void;
  onContinue: () => void;
  onBack: () => void;
}

function EditableList({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <textarea
      value={values.join(', ')}
      onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
      rows={2}
      className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-terracotta-400"
    />
  );
}

export function Analysis({ imageDataUrl, isLoading, analysis, onChange, onContinue, onBack }: Props) {
  const t = useT();
  const lang = SPEECH_LOCALES[useUILanguage()];

  return (
    <div>
      <EyebrowTitle
        eyebrow={t('nav.stepOf', { n: 3, total: 8 })}
        title={t('analysis.title')}
        subtitle={t('analysis.subtitle')}
        icon={<ScanEye size={14} />}
      />

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-[220px_1fr]">
        {imageDataUrl && (
          <div className="mx-auto w-full max-w-[220px]">
            <img src={imageDataUrl} alt="Product" className="aspect-square w-full rounded-2xl object-cover shadow-md" />
          </div>
        )}

        <Card>
          {isLoading || !analysis ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center" role="status" aria-live="polite">
              <Loader2 className="animate-spin text-terracotta-500" size={36} />
              <p className="font-semibold text-ink-800">{t('analysis.loadingTitle')}</p>
              <p className="text-sm text-ink-700/60">{t('analysis.loadingSub')}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FieldLabel>{t('analysis.categoryLabel')}</FieldLabel>
                    <SpeakButton text={`${t('analysis.categoryLabel')}: ${analysis.category}`} lang={lang} className="-mt-2" />
                  </div>
                  <ConfidenceBadge level="estimated" />
                </div>
                <input
                  value={analysis.category}
                  onChange={(e) => onChange({ ...analysis, category: e.target.value })}
                  className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <FieldLabel>{t('analysis.craftTypeLabel')}</FieldLabel>
                  <ConfidenceBadge level="likely" />
                </div>
                <input
                  value={analysis.craftType}
                  onChange={(e) => onChange({ ...analysis, craftType: e.target.value })}
                  className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <FieldLabel>{t('analysis.materialsLabel')}</FieldLabel>
                  <ConfidenceBadge level="uncertain" />
                </div>
                <EditableList values={analysis.visibleMaterials} onChange={(v) => onChange({ ...analysis, visibleMaterials: v })} />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <FieldLabel>{t('analysis.colorsLabel')}</FieldLabel>
                  <ConfidenceBadge level="likely" />
                </div>
                <EditableList values={analysis.colors} onChange={(v) => onChange({ ...analysis, colors: v })} />
              </div>

              <div>
                <FieldLabel>{t('analysis.styleLabel')}</FieldLabel>
                <input
                  value={analysis.style}
                  onChange={(e) => onChange({ ...analysis, style: e.target.value })}
                  className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
                />
              </div>

              <div className="flex items-start justify-between gap-2 rounded-xl bg-ochre-50 px-4 py-3">
                <p className="text-xs text-ochre-800">
                  <strong>{t('analysis.noteLabel')}</strong> {analysis.notes}
                </p>
                <SpeakButton text={analysis.notes} lang={lang} />
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <GhostButton onClick={onBack}>{t('common.back')}</GhostButton>
        <PrimaryButton onClick={onContinue} disabled={isLoading || !analysis} className="w-full sm:w-auto">
          <Sparkles size={18} />
          {t('analysis.continueBtn')}
        </PrimaryButton>
      </div>
    </div>
  );
}
