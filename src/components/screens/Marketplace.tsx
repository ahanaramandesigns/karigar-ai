import { ShoppingBag, Sparkles, Store } from 'lucide-react';
import { Card, EyebrowTitle, GhostButton } from '../ui';
import type { MarketplaceProduct } from '../../types';

interface Props {
  products: MarketplaceProduct[];
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function Marketplace({ products, onSelect, onBack }: Props) {
  return (
    <div>
      <EyebrowTitle
        eyebrow="Karigar Marketplace"
        title="Shop Handmade, Straight From the Artisan"
        subtitle="Every listing here was written, priced and translated by a karigar using the AI tool — browse what's been made so far."
        icon={<Store size={14} />}
      />

      {products.length === 0 ? (
        <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-500">
            <ShoppingBag size={26} />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-900">No products here yet</h3>
          <p className="text-sm text-ink-700/70">
            As soon as a karigar finishes a listing with the AI tool, it'll appear here for people to browse and buy.
            Try the sample product from the home page to see how it looks.
          </p>
          <GhostButton onClick={onBack} className="mt-2">
            ← Back
          </GhostButton>
        </Card>
      ) : (
        <>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-terracotta-100 bg-white/80 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden bg-cream-100">
                  <img
                    src={p.imageDataUrl}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-terracotta-500">{p.category}</span>
                  <h3 className="font-display text-sm font-semibold leading-snug text-ink-900 line-clamp-2">{p.title}</h3>
                  <p className="mt-auto text-base font-semibold text-teal-700">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-6xl text-center">
            <GhostButton onClick={onBack}>← Back</GhostButton>
          </div>
        </>
      )}

      <p className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-1.5 text-center text-xs text-ink-700/40">
        <Sparkles size={12} /> Demo marketplace — products are stored on this device only, for prototype purposes.
      </p>
    </div>
  );
}
