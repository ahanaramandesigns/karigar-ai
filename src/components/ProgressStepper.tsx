import { Check } from 'lucide-react';

const STEPS = [
  'Upload',
  'Your Story',
  'AI Analysis',
  'Listing',
  'Pricing',
  'Languages',
  'Marketing',
  'Export',
];

export function ProgressStepper({ current }: { current: number }) {
  // current is screen index 2..9 mapped to steps 0..7
  const activeIndex = Math.min(Math.max(current - 2, 0), STEPS.length - 1);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-4 sm:pt-6">
      <div className="flex items-center overflow-x-auto pb-1">
        {STEPS.map((label, i) => {
          const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'todo';
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
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
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-1.5 h-0.5 flex-1 rounded ${i < activeIndex ? 'bg-teal-500' : 'bg-cream-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
