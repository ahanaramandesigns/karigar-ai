import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Card, EditableTag, EyebrowTitle, GhostButton, PrimaryButton, SpeakButton } from '../ui';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { resolveProductContent } from '../../data/marketplace';
import { SPEECH_LOCALES } from '../../types';
import type { MarketplaceProduct } from '../../types';

interface Props {
  product: MarketplaceProduct;
  onBuyNow: (quantity: number) => void;
  onBack: () => void;
}

export function ProductDetail({ product, onBuyNow, onBack }: Props) {
  const t = useT();
  const uiLang = useUILanguage();
  const content = resolveProductContent(product, uiLang);
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <EyebrowTitle eyebrow={t('productDetail.eyebrow')} title={content.title} icon={<ShoppingBag size={14} />} />

      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-[minmax(0,320px)_1fr]">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border-8 border-white shadow-lg sm:mx-0">
          <img src={product.imageDataUrl} alt={content.title} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <EditableTag label={product.category} tone="ochre" />
          <div className="mt-3 flex items-start justify-between gap-3">
            <p className="font-display text-3xl font-semibold text-terracotta-600">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <SpeakButton
              text={`${content.title}. ${product.price}. ${content.shortDescription}. ${content.detailedDescription}`}
              lang={SPEECH_LOCALES[uiLang]}
            />
          </div>

          <p className="mt-3 text-sm text-ink-800">{content.shortDescription}</p>
          <p className="mt-2 text-sm text-ink-700/70">{content.detailedDescription}</p>
          {!content.wasTranslated && uiLang !== 'en' && (
            <p className="mt-2 text-xs italic text-ink-700/40">{t('productDetail.notTranslatedNote')}</p>
          )}

          <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50/60 p-4 text-sm italic text-teal-900">
            {content.artisanStory}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.keywords.map((k) => (
              <span key={k} className="rounded-full bg-cream-200 px-2.5 py-1 text-[11px] font-semibold text-ink-700/70">
                #{k.replace(/\s+/g, '')}
              </span>
            ))}
          </div>

          <Card className="mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-ink-800">{t('productDetail.quantityLabel')}</span>
              <div className="flex items-center overflow-hidden rounded-xl border-2 border-cream-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center text-ink-700 hover:bg-cream-100"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-ink-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="flex h-9 w-9 items-center justify-center text-ink-700 hover:bg-cream-100"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <PrimaryButton onClick={() => onBuyNow(quantity)} className="w-full sm:w-auto">
              <ShoppingBag size={18} />
              {t('productDetail.buyNowBtn', { price: `₹${(product.price * quantity).toLocaleString('en-IN')}` })}
            </PrimaryButton>
          </Card>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-4xl text-center">
        <GhostButton onClick={onBack}>{t('common.back')}</GhostButton>
      </div>
    </div>
  );
}
