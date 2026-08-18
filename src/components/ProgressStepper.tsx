import { Check } from 'lucide-react';
import { useT, type UIStringKey } from '../i18n/I18nContext';

const STEP_KEYS: UIStringKey[] = [
  'nav.stepUpload',
  'nav.stepStory',
  'nav.stepAnalysis',
  'nav.stepListing',
  'nav.stepPricing',
  'nav.stepLanguages',
  'nav.stepMarketing',
  'nav.stepExport',
];

export function ProgressStepper({ current }: { current: number }) {
  const t = useT();
  // current is screen index 2..9 mapped to steps 0..7
  const activeIndex = Math.min(Math.max(current - 2, 0), STEP_KEYS.length - 1);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-4 sm:pt-6">
      <div className="flex items-center overflow-x-auto pb-1">
        {STEP_KEYS.map((key, i) => {
          const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'todo';
          return (
            <div key={key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-8 sm:w-8 ${
                    state === 'done'
                      ? 'bg-teal-600 text-white'
                      : state === 'active'
                        ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-100'
                        : 'bg-cream-200 text-ink-700/40'
                  }`}
                >
                  {state === 'done' ? <Check size={14} /> : i + 1}
                </div>
                <span
                  className={`hidden text-[10px] font-semibold sm:block ${
                    state === 'active' ? 'text-terracotta-600' : state === 'done' ? 'text-teal-700' : 'text-ink-700/40'
                  }`}
                >
                  {t(key)}
                </span>
              </div>
              {i < STEP_KEYS.length - 1 && (
                <div className={`mx-1.5 h-0.5 flex-1 rounded ${i < activeIndex ? 'bg-teal-500' : 'bg-cream-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
