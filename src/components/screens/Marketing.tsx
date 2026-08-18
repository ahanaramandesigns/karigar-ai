import { Camera, Loader2, MessageCircle, Search, Sparkles, Tag, Target } from 'lucide-react';
import { Card, CopyButton, EyebrowTitle, GhostButton, PrimaryButton } from '../ui';
import type { MarketingAssets } from '../../types';

interface Props {
  isLoading: boolean;
  marketing: MarketingAssets | null;
  onChange: (m: MarketingAssets) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Marketing({ isLoading, marketing, onChange, onContinue, onBack }: Props) {
  if (isLoading || !marketing) {
    return (
      <div>
        <EyebrowTitle eyebrow="Step 7 of 8" title="Creating Your Marketing Kit" icon={<Sparkles size={14} />} />
        <Card className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 py-16 text-center">
          <Loader2 className="animate-spin text-terracotta-500" size={36} />
          <p className="font-semibold text-ink-800">Putting together captions, messages and keywords...</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <EyebrowTitle
        eyebrow="Step 7 of 8"
        title="AI Marketing Assistant"
        subtitle="Ready-to-use posts and messages — no marketing knowledge required. Everything is editable."
        icon={<Sparkles size={14} />}
      />

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <Camera size={16} className="text-terracotta-500" /> Instagram Caption
            </div>
            <CopyButton text={marketing.instagramCaption} />
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
              <MessageCircle size={16} className="text-teal-600" /> WhatsApp Message
            </div>
            <CopyButton text={marketing.whatsappMessage} />
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
            <Search size={16} className="text-ochre-600" /> Search Keywords
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
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900">
            <Target size={16} className="text-terracotta-500" /> Who's it for
          </div>
          <p className="text-sm text-ink-700/80">{marketing.targetSegment}</p>
        </Card>

        <Card className="sm:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <Tag size={16} className="text-terracotta-500" /> Tagline
            </div>
            <CopyButton text={marketing.tagline} />
          </div>
          <input
            value={marketing.tagline}
            onChange={(e) => onChange({ ...marketing, tagline: e.target.value })}
            className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 font-display text-base font-semibold text-ink-900 outline-none focus:border-terracotta-400"
          />
        </Card>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <PrimaryButton onClick={onContinue} className="w-full sm:w-auto">
          <Sparkles size={18} />
          Finish & View Dashboard
        </PrimaryButton>
      </div>
    </div>
  );
}
