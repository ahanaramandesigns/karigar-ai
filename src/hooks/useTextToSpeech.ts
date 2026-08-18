import { useCallback, useState } from 'react';

// Thin wrapper around the browser's Web Speech API (SpeechSynthesis) — the
// read-aloud counterpart to useVoiceInput. Lets people who can't read, or
// can't see the screen, hear any piece of generated text spoken back to
// them. Gracefully degrades: if unsupported, isSupported=false and callers
// should hide the speak button rather than break the flow.

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, lang = 'en-IN') => {
      if (!isSupported || !text.trim()) return;
      window.speechSynthesis.cancel(); // only one thing reads aloud at a time
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported],
  );

  return { isSupported, isSpeaking, speak, stop };
}
