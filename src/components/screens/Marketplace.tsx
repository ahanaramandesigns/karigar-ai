import { ShoppingBag, Sparkles, Store } from 'lucide-react';
import { Card, EyebrowTitle, GhostButton } from '../ui';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { resolveProductContent } from '../../data/marketplace';
import type { MarketplaceProduct } from '../../types';

interface Props {
  products: MarketplaceProduct[];
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function Marketplace({ products, onSelect, onBack }: Props) {
  const t = useT();
  const uiLang = useUILanguage();

  return (
    <div>
      <EyebrowTitle
        eyebrow={t('marketplace.eyebrow')}
        title={t('marketplace.title')}
        subtitle={t('marketplace.subtitle')}
        icon={<Store size={14} />}
      />

      {products.length === 0 ? (
        <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-500">
            <ShoppingBag size={26} />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-900">{t('marketplace.emptyTitle')}</h3>
          <p className="text-sm text-ink-700/70">{t('marketplace.emptyText')}</p>
          <GhostButton onClick={onBack} className="mt-2">
            {t('common.back')}
          </GhostButton>
        </Card>
      ) : (
        <>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const content = resolveProductContent(p, uiLang);
              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-terracotta-100 bg-white/80 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-square w-full overflow-hidden bg-cream-100">
                    <img
                      src={p.imageDataUrl}
                      alt={content.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-terracotta-500">{p.category}</span>
                    <h3 className="font-display text-sm font-semibold leading-snug text-ink-900 line-clamp-2">{content.title}</h3>
                    <p className="mt-auto text-base font-semibold text-teal-700">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-6xl text-center">
            <GhostButton onClick={onBack}>{t('common.back')}</GhostButton>
          </div>
        </>
      )}

      <p className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-1.5 text-center text-xs text-ink-700/40">
        <Sparkles size={12} /> {t('marketplace.demoNote')}
      </p>
    </div>
  );
}
