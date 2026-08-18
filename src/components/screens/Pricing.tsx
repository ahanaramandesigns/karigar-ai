import { IndianRupee, Sparkles } from 'lucide-react';
import { Card, EyebrowTitle, FieldLabel, GhostButton, PrimaryButton, SpeakButton } from '../ui';
import type { PricingInputs, PricingResult } from '../../types';

interface Props {
  inputs: PricingInputs;
  onInputsChange: (i: PricingInputs) => void;
  pricing: PricingResult | null;
  finalPrice: number | null;
  onFinalPriceChange: (n: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center overflow-hidden rounded-xl border-2 border-cream-300 bg-white focus-within:border-terracotta-400">
        {prefix && <span className="pl-4 text-sm font-semibold text-ink-700/50">{prefix}</span>}
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-ink-900 outline-none"
        />
        {suffix && <span className="pr-4 text-sm font-semibold text-ink-700/50">{suffix}</span>}
      </div>
    </div>
  );
}

export function Pricing({ inputs, onInputsChange, pricing, finalPrice, onFinalPriceChange, onContinue, onBack }: Props) {
  return (
    <div>
      <EyebrowTitle
        eyebrow="Step 5 of 8"
        title="Smart Pricing Assistant"
        subtitle="A fair starting point based on your costs and time — you always have the final say."
        icon={<IndianRupee size={14} />}
      />

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-ink-900">A few quick numbers</h3>
          <div className="space-y-4">
            <NumberField
              label="Material cost"
              prefix="₹"
              value={inputs.materialCost}
              onChange={(n) => onInputsChange({ ...inputs, materialCost: n })}
            />
            <NumberField
              label="Hours to make one piece"
              suffix="hrs"
              value={inputs.hoursToMake}
              onChange={(n) => onInputsChange({ ...inputs, hoursToMake: n })}
            />
            <NumberField
              label="Your time, per hour"
              prefix="₹"
              value={inputs.hourlyRate}
              onChange={(n) => onInputsChange({ ...inputs, hourlyRate: n })}
            />
            <NumberField
              label="Desired margin"
              suffix="%"
              value={inputs.desiredMarginPercent}
              onChange={(n) => onInputsChange({ ...inputs, desiredMarginPercent: n })}
            />
          </div>
        </Card>

        <div className="rounded-3xl border border-teal-900 bg-teal-800 p-6 text-cream-50 shadow-sm sm:p-8">
          <div className="mb-1 flex items-center gap-1.5">
            <h3 className="font-display text-lg font-semibold">Suggested price</h3>
            {pricing && (
              <SpeakButton
                text={`Suggested price range: ${pricing.low} to ${pricing.high} rupees. ${pricing.explanation.join('. ')}`}
                className="text-cream-100 hover:bg-white/10"
              />
            )}
          </div>
          <p className="mb-5 text-xs text-teal-100/80">This is an AI-assisted estimate — you have final control.</p>

          {pricing && (
            <>
              <div className="mb-5 rounded-2xl bg-white/10 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-100/70">Suggested range</p>
                <p className="mt-1 font-display text-2xl font-semibold">
                  ₹{pricing.low.toLocaleString('en-IN')} – ₹{pricing.high.toLocaleString('en-IN')}
                </p>
              </div>

              <FieldLabel>
                <span className="text-cream-50">Your starting price</span>
              </FieldLabel>
              <div className="mb-5 flex items-center overflow-hidden rounded-xl border-2 border-white/30 bg-white/10">
                <span className="pl-4 font-semibold text-cream-100">₹</span>
                <input
                  type="number"
                  min={0}
                  value={finalPrice ?? pricing.recommended}
                  onChange={(e) => onFinalPriceChange(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-transparent px-3 py-3 font-display text-lg font-semibold text-cream-50 outline-none"
                />
              </div>

              <ul className="space-y-2 text-xs text-teal-100/90">
                {pricing.explanation.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-ochre-300">•</span>
                    {line}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <PrimaryButton onClick={onContinue} className="w-full sm:w-auto">
          <Sparkles size={18} />
          Continue to Languages
        </PrimaryButton>
      </div>
    </div>
  );
}
