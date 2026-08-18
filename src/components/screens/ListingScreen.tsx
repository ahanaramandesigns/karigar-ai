import { Loader2, RefreshCw, ScrollText, Sparkles, X } from 'lucide-react';
import { Card, EyebrowTitle, FieldLabel, GhostButton, PrimaryButton, SecondaryButton } from '../ui';
import type { ProductListing } from '../../types';

interface Props {
  isLoading: boolean;
  listing: ProductListing | null;
  onChange: (l: ProductListing) => void;
  onRegenerate: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ListingScreen({ isLoading, listing, onChange, onRegenerate, onContinue, onBack }: Props) {
  if (isLoading || !listing) {
    return (
      <div>
        <EyebrowTitle eyebrow="Step 4 of 8" title="Writing Your Listing" icon={<ScrollText size={14} />} />
        <Card className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 py-16 text-center">
          <Loader2 className="animate-spin text-terracotta-500" size={36} />
          <p className="font-semibold text-ink-800">Turning your story into a global-ready listing...</p>
        </Card>
      </div>
    );
  }

  const removeKeyword = (k: string) => onChange({ ...listing, keywords: listing.keywords.filter((x) => x !== k) });

  return (
    <div>
      <EyebrowTitle
        eyebrow="Step 4 of 8"
        title="Your Global Product Listing"
        subtitle="Written for international customers, using your own words for the story. Everything is editable."
        icon={<ScrollText size={14} />}
      />

      <Card className="mx-auto max-w-3xl space-y-6">
        <div>
          <FieldLabel>Product title</FieldLabel>
          <input
            value={listing.title}
            onChange={(e) => onChange({ ...listing, title: e.target.value })}
            className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 font-display text-lg font-semibold text-ink-900 outline-none focus:border-terracotta-400"
          />
        </div>

        <div>
          <FieldLabel hint="Shown in search results">Short description</FieldLabel>
          <textarea
            value={listing.shortDescription}
            onChange={(e) => onChange({ ...listing, shortDescription: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-terracotta-400"
          />
        </div>

        <div>
          <FieldLabel>Detailed description</FieldLabel>
          <textarea
            value={listing.detailedDescription}
            onChange={(e) => onChange({ ...listing, detailedDescription: e.target.value })}
            rows={5}
            className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-terracotta-400"
          />
        </div>

        <div>
          <FieldLabel hint="Your own words, preserved">Your craft story</FieldLabel>
          <textarea
            value={listing.artisanStory}
            onChange={(e) => onChange({ ...listing, artisanStory: e.target.value })}
            rows={4}
            className="w-full resize-none rounded-xl border-2 border-teal-200 bg-teal-50/40 px-4 py-3 text-sm text-ink-900 outline-none focus:border-teal-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Materials</FieldLabel>
            <input
              value={listing.materials}
              onChange={(e) => onChange({ ...listing, materials: e.target.value })}
              className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
            />
          </div>
          <div>
            <FieldLabel>Production time</FieldLabel>
            <input
              value={listing.productionTime}
              onChange={(e) => onChange({ ...listing, productionTime: e.target.value })}
              className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Category</FieldLabel>
          <input
            value={listing.category}
            onChange={(e) => onChange({ ...listing, category: e.target.value })}
            className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-terracotta-400"
          />
        </div>

        <div>
          <FieldLabel hint="Helps customers find you">Search keywords</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {listing.keywords.map((k) => (
              <button
                key={k}
                onClick={() => removeKeyword(k)}
                className="group inline-flex items-center gap-1 rounded-full border border-terracotta-200 bg-terracotta-50 px-3 py-1 text-xs font-semibold text-terracotta-700"
              >
                {k}
                <X size={12} className="opacity-40 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="mx-auto mt-8 flex max-w-3xl flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <SecondaryButton onClick={onRegenerate}>
            <RefreshCw size={16} />
            Regenerate
          </SecondaryButton>
          <PrimaryButton onClick={onContinue}>
            <Sparkles size={18} />
            Continue to Pricing
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
