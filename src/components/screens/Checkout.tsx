import { useState } from 'react';
import { CreditCard, MapPin, ShieldCheck, ShoppingBag, Smartphone, Truck } from 'lucide-react';
import { Card, EyebrowTitle, FieldLabel, GhostButton, PrimaryButton } from '../ui';
import { useT, useUILanguage } from '../../i18n/I18nContext';
import { resolveProductContent } from '../../data/marketplace';
import type { MarketplaceProduct } from '../../types';

interface Props {
  product: MarketplaceProduct;
  quantity: number;
  onPlaceOrder: (details: { shippingName: string; paymentMethod: 'card' | 'upi' | 'cod' }) => void;
  onBack: () => void;
}

const SHIPPING_FLAT = 49;
const FREE_SHIPPING_THRESHOLD = 999;

const inputCls =
  'w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-terracotta-400';

export function Checkout({ product, quantity, onPlaceOrder, onBack }: Props) {
  const t = useT();
  const uiLang = useUILanguage();
  const content = resolveProductContent(product, uiLang);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [pincode, setPincode] = useState('');
  const [method, setMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const subtotal = product.price * quantity;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const isComplete =
    name.trim() && phone.trim() && address.trim() && city.trim() && region.trim() && pincode.trim() &&
    (method === 'cod' || (method === 'card' && cardNumber.trim() && cardExpiry.trim() && cardCvv.trim()) ||
      (method === 'upi' && upiId.trim()));

  const handlePlaceOrder = () => {
    if (!isComplete) {
      setError(t('checkout.validationError'));
      return;
    }
    setError(null);
    onPlaceOrder({ shippingName: name.trim(), paymentMethod: method });
  };

  return (
    <div>
      <EyebrowTitle eyebrow={t('checkout.eyebrow')} title={t('checkout.title')} icon={<ShoppingBag size={14} />} />

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <MapPin size={18} className="text-terracotta-500" /> {t('checkout.shippingHeading')}
            </h3>
            <div className="space-y-4">
              <div>
                <FieldLabel>{t('checkout.nameLabel')}</FieldLabel>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('checkout.namePlaceholder')} className={inputCls} />
              </div>
              <div>
                <FieldLabel>{t('checkout.phoneLabel')}</FieldLabel>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('checkout.phonePlaceholder')} className={inputCls} />
              </div>
              <div>
                <FieldLabel>{t('checkout.addressLabel')}</FieldLabel>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('checkout.addressPlaceholder')} className={inputCls} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('checkout.cityPlaceholder')} className={inputCls} />
                <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder={t('checkout.statePlaceholder')} className={inputCls} />
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder={t('checkout.pinPlaceholder')} className={inputCls} />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-display text-lg font-semibold text-ink-900">{t('checkout.paymentHeading')}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(
                [
                  { key: 'card', label: t('checkout.cardLabel'), icon: CreditCard },
                  { key: 'upi', label: t('checkout.upiLabel'), icon: Smartphone },
                  { key: 'cod', label: t('checkout.codLabel'), icon: Truck },
                ] as const
              ).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMethod(key)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 text-sm font-semibold transition-colors ${
                    method === key ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-700' : 'border-cream-300 bg-white text-ink-700/70 hover:border-terracotta-200'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {method === 'card' && (
              <div className="mt-5 space-y-4">
                <div>
                  <FieldLabel>{t('checkout.cardNumberLabel')}</FieldLabel>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ''))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={inputCls}
                  />
                  <input
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="CVV"
                    maxLength={3}
                    className={inputCls}
                  />
                </div>
              </div>
            )}
            {method === 'upi' && (
              <div className="mt-5">
                <FieldLabel>{t('checkout.upiIdLabel')}</FieldLabel>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder={t('checkout.upiIdPlaceholder')} className={inputCls} />
              </div>
            )}
            {method === 'cod' && (
              <p className="mt-5 text-sm text-ink-700/70">{t('checkout.codNote')}</p>
            )}

            {error && <p className="mt-4 text-sm font-semibold text-terracotta-600">{error}</p>}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-4 font-display text-base font-semibold text-ink-900">{t('checkout.orderSummaryHeading')}</h3>
            <div className="flex gap-3">
              <img src={product.imageDataUrl} alt={content.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{content.title}</p>
                <p className="text-xs text-ink-700/60">{t('checkout.qtyLabel', { n: quantity })}</p>
              </div>
            </div>
            <div className="mt-5 space-y-2 border-t border-cream-200 pt-4 text-sm">
              <div className="flex justify-between text-ink-700/70">
                <span>{t('checkout.subtotalLabel')}</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-ink-700/70">
                <span>{t('checkout.shippingLabel')}</span>
                <span>{shipping === 0 ? t('checkout.freeLabel') : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between border-t border-cream-200 pt-2 font-display text-base font-semibold text-ink-900">
                <span>{t('checkout.totalLabel')}</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <PrimaryButton onClick={handlePlaceOrder} className="mt-5 w-full">
              {t('checkout.placeOrderBtn')}
            </PrimaryButton>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-ink-700/40">
              <ShieldCheck size={13} className="mt-0.5 shrink-0" />
              {t('checkout.demoNote')}
            </p>
          </Card>
          <div className="text-center">
            <GhostButton onClick={onBack}>{t('checkout.backBtn')}</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}
