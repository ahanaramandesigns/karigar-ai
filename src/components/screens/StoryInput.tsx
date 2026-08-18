import { Mic, MicOff, Sparkles, BookHeart } from 'lucide-react';
import { Card, EyebrowTitle, FieldLabel, PrimaryButton, GhostButton, SpeakButton } from '../ui';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import type { ArtisanStory } from '../../types';

interface Props {
  story: ArtisanStory;
  onChange: (story: ArtisanStory) => void;
  onGenerate: () => void;
  onBack: () => void;
}

function QuestionBlock({
  label,
  field,
  placeholder,
  value,
  onUpdate,
}: {
  label: string;
  field: keyof ArtisanStory;
  placeholder: string;
  value: string;
  onUpdate: (field: keyof ArtisanStory, val: string) => void;
}) {
  const { isSupported, isListening, error, start, stop } = useVoiceInput((text) =>
    onUpdate(field, value ? `${value} ${text}` : text),
  );

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-1.5">
        <FieldLabel>{label}</FieldLabel>
        <SpeakButton text={label} className="-mt-2" />
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onUpdate(field, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-xl border-2 border-cream-300 bg-white px-4 py-3 pr-14 text-base text-ink-900 outline-none transition-colors focus:border-terracotta-400"
        />
        {isSupported && (
          <button
            type="button"
            onClick={isListening ? stop : start}
            title="Tell your story"
            aria-label="Tell your story with your voice"
            className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-colors ${
              isListening ? 'animate-pulse-ring bg-terracotta-600' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
      </div>
      {isListening && <p className="mt-1.5 text-xs font-semibold text-teal-700">🎙️ Listening — speak naturally...</p>}
      {error && <p className="mt-1.5 text-xs font-semibold text-terracotta-600">{error}</p>}
    </div>
  );
}

export function StoryInput({ story, onChange, onGenerate, onBack }: Props) {
  const update = (field: keyof ArtisanStory, val: string) => onChange({ ...story, [field]: val });
  const canContinue = story.materials.trim() && story.timeToMake.trim();

  return (
    <div>
      <EyebrowTitle
        eyebrow="Step 2 of 8"
        title="Tell us about your craft"
        subtitle="No professional writing needed — just answer naturally, by typing or speaking."
        icon={<BookHeart size={14} />}
      />

      <Card className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          <Mic size={16} className="shrink-0" />
          Tap the microphone on any question and just speak — we'll write it down for you.
        </div>

        <QuestionBlock
          label="What is this product made from?"
          field="materials"
          placeholder="e.g. Natural bamboo, hand-split and sun-dried"
          value={story.materials}
          onUpdate={update}
        />
        <QuestionBlock
          label="How long does it take you to make?"
          field="timeToMake"
          placeholder="e.g. About 2 to 3 days"
          value={story.timeToMake}
          onUpdate={update}
        />
        <QuestionBlock
          label="Is there a story or tradition behind it?"
          field="traditionStory"
          placeholder="e.g. I learned this from my mother, who learned it from hers..."
          value={story.traditionStory}
          onUpdate={update}
        />
        <QuestionBlock
          label="Where is this craft traditionally made?"
          field="origin"
          placeholder="e.g. Our village workshop, known for bamboo craft"
          value={story.origin}
          onUpdate={update}
        />

        <p className="mt-2 text-xs text-ink-700/50">
          We'll use exactly what you tell us — we never invent traditions, origins or details you haven't shared.
        </p>

        <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          <GhostButton onClick={onBack}>← Back</GhostButton>
          <PrimaryButton onClick={onGenerate} disabled={!canContinue} className="w-full sm:w-auto">
            <Sparkles size={18} />
            Generate My Listing
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
