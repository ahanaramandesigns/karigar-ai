import { ScanEye, Sparkles, Loader2 } from 'lucide-react';
import { Card, ConfidenceBadge, EyebrowTitle, FieldLabel, GhostButton, PrimaryButton, SpeakButton } from '../ui';
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
  return (
    <div>
      <EyebrowTitle
        eyebrow="Step 3 of 8"
        title="AI Product Analysis"
        subtitle="Here's what we noticed in your photo. Everything below is editable — please correct anything we got wrong."
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
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <Loader2 className="animate-spin text-terracotta-500" size={36} />
              <p className="font-semibold text-ink-800">Looking closely at your photo...</p>
              <p className="text-sm text-ink-700/60">This usually takes a few seconds.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FieldLabel>Category</FieldLabel>
                    <SpeakButton text={`Category: ${analysis.category}`} className="-mt-2" />
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
                  <FieldLabel>Craft type</FieldLabel>
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
                  <FieldLabel>Visible materials</FieldLabel>
                  <ConfidenceBadge level="uncertain" />
                </div>
                <EditableList values={analysis.visibleMaterials} onChange={(v) => onChange({ ...analysis, visibleMaterials: v })} />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <FieldLabel>Colors</FieldLabel>
                  <ConfidenceBadge level="likely" />
                </div>
                <EditableList values={analysis.colors} onChange={(v) => onChange({ ...analysis, colors: v })} />
              </div>

              <div>
                <FieldLabel>Style</FieldLabel>
                <input
                  value={analysis.style}
                  onChange={(e) => onChange({ ...analysis, style: e.target.value })}
                  className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
                />
              </div>

              <div className="flex items-start justify-between gap-2 rounded-xl bg-ochre-50 px-4 py-3">
                <p className="text-xs text-ochre-800">
                  <strong>Note:</strong> {analysis.notes}
                </p>
                <SpeakButton text={analysis.notes} />
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <PrimaryButton onClick={onContinue} disabled={isLoading || !analysis} className="w-full sm:w-auto">
          <Sparkles size={18} />
          Looks Good — Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
