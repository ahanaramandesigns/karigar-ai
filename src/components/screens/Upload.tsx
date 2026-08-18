import { useCallback, useRef, useState } from 'react';
import { ImageUp, Sparkles, X } from 'lucide-react';
import { Card, EyebrowTitle, FieldLabel, PrimaryButton, GhostButton } from '../ui';
import { useT } from '../../i18n/I18nContext';

interface Props {
  imageDataUrl: string | null;
  productNameHint: string;
  onImageChange: (dataUrl: string | null, fileName: string | null) => void;
  onProductNameChange: (name: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
}

const MAX_SIZE_MB = 8;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];

export function UploadScreen({ imageDataUrl, productNameHint, onImageChange, onProductNameChange, onAnalyze, onBack }: Props) {
  const t = useT();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      setError(null);
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) {
        setError(t('upload.errorType'));
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(t('upload.errorSize', { size: MAX_SIZE_MB }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onImageChange(reader.result as string, file.name);
      reader.onerror = () => setError(t('upload.errorRead'));
      reader.readAsDataURL(file);
    },
    [onImageChange, t],
  );

  return (
    <div>
      <EyebrowTitle eyebrow={t('nav.stepOf', { n: 1, total: 8 })} title={t('upload.title')} subtitle={t('upload.subtitle')} icon={<ImageUp size={14} />} />

      <Card className="mx-auto max-w-2xl">
        {!imageDataUrl ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-4 border-dashed p-10 text-center transition-colors sm:p-16 ${
              dragActive ? 'border-terracotta-400 bg-terracotta-50' : 'border-terracotta-200 bg-cream-50 hover:bg-cream-100'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-500">
              <ImageUp size={32} />
            </div>
            <div>
              <p className="text-lg font-bold text-ink-900">{t('upload.dropHint')}</p>
              <p className="mt-1 text-sm text-ink-700/60">{t('upload.dropHintSub', { size: MAX_SIZE_MB })}</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(',')}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        ) : (
          <div className="relative">
            <img src={imageDataUrl} alt="Uploaded product preview" className="mx-auto max-h-96 w-full rounded-2xl object-cover" />
            <button
              onClick={() => onImageChange(null, null)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-md transition-transform hover:scale-105"
              aria-label={t('upload.removePhoto')}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm font-semibold text-terracotta-600">{error}</p>}

        <div className="mt-6">
          <FieldLabel hint={t('upload.nameHint')}>{t('upload.nameLabel')}</FieldLabel>
          <input
            type="text"
            value={productNameHint}
            onChange={(e) => onProductNameChange(e.target.value)}
            placeholder={t('upload.namePlaceholder')}
            className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base text-ink-900 outline-none transition-colors focus:border-terracotta-400"
          />
        </div>

        <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          <GhostButton onClick={onBack}>{t('common.back')}</GhostButton>
          <PrimaryButton onClick={onAnalyze} disabled={!imageDataUrl} className="w-full sm:w-auto">
            <Sparkles size={18} />
            {t('upload.analyzeBtn')}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
