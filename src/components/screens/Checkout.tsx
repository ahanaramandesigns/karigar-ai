import { useState } from 'react';
import { CreditCard, MapPin, ShieldCheck, ShoppingBag, Smartphone, Truck } from 'lucide-react';
import { Card, EyebrowTitle, FieldLabel, GhostButton, PrimaryButton } from '../ui';
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
      setError('Please fill in every field before placing the order.');
      return;
    }
    setError(null);
    onPlaceOrder({ shippingName: name.trim(), paymentMethod: method });
  };

  return (
    <div>
      <EyebrowTitle eyebrow="Checkout" title="Delivery & Payment" icon={<ShoppingBag size={14} />} />

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <MapPin size={18} className="text-terracotta-500" /> Shipping address
            </h3>
            <div className="space-y-4">
              <div>
                <FieldLabel>Full name</FieldLabel>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" className={inputCls} />
              </div>
              <div>
                <FieldLabel>Phone number</FieldLabel>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 98765 43210" className={inputCls} />
              </div>
              <div>
                <FieldLabel>Address</FieldLabel>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no., street, area" className={inputCls} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputCls} />
                <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="State" className={inputCls} />
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="PIN code" className={inputCls} />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-display text-lg font-semibold text-ink-900">Payment method</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(
                [
                  { key: 'card', label: 'Card', icon: CreditCard },
                  { key: 'upi', label: 'UPI', icon: Smartphone },
                  { key: 'cod', label: 'Cash on Delivery', icon: Truck },
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
                  <FieldLabel>Card number</FieldLabel>
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
                <FieldLabel>UPI ID</FieldLabel>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" className={inputCls} />
              </div>
            )}
            {method === 'cod' && (
              <p className="mt-5 text-sm text-ink-700/70">Pay in cash when your order arrives.</p>
            )}

            {error && <p className="mt-4 text-sm font-semibold text-terracotta-600">{error}</p>}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-4 font-display text-base font-semibold text-ink-900">Order summary</h3>
            <div className="flex gap-3">
              <img src={product.imageDataUrl} alt={product.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{product.title}</p>
                <p className="text-xs text-ink-700/60">Qty {quantity}</p>
              </div>
            </div>
            <div className="mt-5 space-y-2 border-t border-cream-200 pt-4 text-sm">
              <div className="flex justify-between text-ink-700/70">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-ink-700/70">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between border-t border-cream-200 pt-2 font-display text-base font-semibold text-ink-900">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <PrimaryButton onClick={handlePlaceOrder} className="mt-5 w-full">
              Place Order
            </PrimaryButton>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-ink-700/40">
              <ShieldCheck size={13} className="mt-0.5 shrink-0" />
              Demo checkout — no real payment is processed and nothing ships.
            </p>
          </Card>
          <div className="text-center">
            <GhostButton onClick={onBack}>← Back to product</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}
