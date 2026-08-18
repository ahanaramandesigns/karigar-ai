import { useEffect, useRef } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

// Global "read on hover / focus" accessibility mode for people with low
// vision: move the cursor (or Tab with a keyboard) over anything readable
// on the page and it's spoken aloud. Mounted once at the app root — this is
// the "cursor moves and speaks" mode, distinct from the per-element
// SpeakButton (ui.tsx), which is a click-to-read control for specific
// blocks of generated content.

const READABLE_SELECTOR =
  'button, a, input, textarea, select, label, [role="button"], h1, h2, h3, h4, p, span, li, img[alt]';

function getAccessibleText(el: Element): string {
  const aria = el.getAttribute('aria-label');
  if (aria) return aria;
  if (el.tagName === 'IMG') return el.getAttribute('alt') || '';
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    const field = el as HTMLInputElement | HTMLTextAreaElement;
    return field.value || field.placeholder || '';
  }
  return (el.textContent || '').trim();
}

export function ReadOnHover({ enabled, lang }: { enabled: boolean; lang: string }) {
  const { speak, stop } = useTextToSpeech();
  const timerRef = useRef<number | null>(null);
  const lastTextRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }

    const handleTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      const el = target.closest(READABLE_SELECTOR);
      if (!el) return;
      const text = getAccessibleText(el).slice(0, 400);
      if (!text || text === lastTextRef.current) return;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      // Small dwell delay so sweeping the cursor across the page doesn't
      // trigger a burst of overlapping speech for every element passed over.
      timerRef.current = window.setTimeout(() => {
        lastTextRef.current = text;
        speak(text, lang);
      }, 220);
    };

    const onMouseOver = (e: MouseEvent) => handleTarget(e.target);
    const onFocusIn = (e: FocusEvent) => handleTarget(e.target);
    const onMouseOut = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      lastTextRef.current = '';
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('mouseout', onMouseOut);
    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('mouseout', onMouseOut);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [enabled, lang, speak, stop]);

  return null;
}
