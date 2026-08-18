import { CheckCircle2, Store } from 'lucide-react';
import { Card, EyebrowTitle, PrimaryButton, SecondaryButton } from '../ui';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { resolveProductContent } from '../../data/marketplace';
import type { Order } from '../../types';

interface Props {
  order: Order;
  onContinueShopping: () => void;
  onBackToHome: () => void;
}

export function OrderConfirmation({ order, onContinueShopping, onBackToHome }: Props) {
  const t = useT();
  const uiLang = useUILanguage();
  const content = resolveProductContent(order.product, uiLang);
  const paymentLabel = {
    card: t('checkout.cardLabel'),
    upi: t('checkout.upiLabel'),
    cod: t('checkout.codLabel'),
  }[order.paymentMethod];

  return (
    <div>
      <EyebrowTitle
        eyebrow={t('orderConfirmation.eyebrow')}
        title={t('orderConfirmation.thankYou', { name: order.shippingName.split(' ')[0] })}
        icon={<CheckCircle2 size={14} />}
      />

      <Card className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
          <CheckCircle2 size={32} />
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-ink-700/50">{t('orderConfirmation.orderIdLabel')}</p>
        <p className="font-mono text-sm text-ink-900">{order.id}</p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-cream-100 p-4 text-left">
          <img src={order.product.imageDataUrl} alt={content.title} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{content.title}</p>
            <p className="text-xs text-ink-700/60">{t('orderConfirmation.paidVia', { n: order.quantity, method: paymentLabel })}</p>
          </div>
          <p className="ml-auto shrink-0 font-display text-lg font-semibold text-terracotta-600">
            ₹{order.total.toLocaleString('en-IN')}
          </p>
        </div>

        <p className="mt-5 text-xs text-ink-700/40">{t('orderConfirmation.demoNote')}</p>

        <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-center">
          <SecondaryButton onClick={onBackToHome}>{t('orderConfirmation.backHomeBtn')}</SecondaryButton>
          <PrimaryButton onClick={onContinueShopping}>
            <Store size={18} />
            {t('orderConfirmation.continueShoppingBtn')}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
