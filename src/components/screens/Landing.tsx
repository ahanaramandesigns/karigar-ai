import { motion } from 'framer-motion';
import { Camera, Globe2, Mic, Sparkles, Tags, Wand2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../ui';
import { DEMO_IMAGE_URL } from '../../data/demoData';

export function Landing({ onStart, onTryDemo }: { onStart: () => void; onTryDemo: () => void }) {
  return (
    <div className="texture-weave">
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:flex-row lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-ochre-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ochre-700">
            <Sparkles size={14} /> Heritage meets technology
          </div>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink-900 sm:text-5xl lg:text-6xl">
            Turn Your Craft Into a{' '}
            <span className="text-terracotta-500">Global Story</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-ink-700/80 lg:mx-0">
            One photo. Your story. <span className="font-semibold text-ink-900">AI handles the digital work.</span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <PrimaryButton onClick={onStart} className="w-full sm:w-auto">
              <Wand2 size={20} />
              Start Selling Globally
            </PrimaryButton>
            <SecondaryButton onClick={onTryDemo} className="w-full sm:w-auto">
              Try a Sample Product
            </SecondaryButton>
          </div>
          <p className="mt-4 text-sm text-ink-700/50">No design skills, writing skills, or tech skills needed.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex-1"
        >
          <div className="animate-float-soft relative mx-auto max-w-sm overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
            <img src={DEMO_IMAGE_URL} alt="Sample handwoven bamboo basket" className="aspect-square w-full object-cover" />
            <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 p-3 backdrop-blur-sm">
              <p className="font-display text-sm font-semibold text-ink-900">Handwoven Bamboo Basket</p>
              <p className="text-xs text-teal-700">✓ Global-ready listing generated</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3-step process */}
      <section className="border-y border-terracotta-100 bg-white/60 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            Three simple steps
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Camera, step: '1', title: 'Upload your craft', desc: 'Take or add one photo of your product.' },
              { icon: Mic, step: '2', title: 'Tell us your story', desc: 'Speak or type — no professional writing needed.' },
              { icon: Globe2, step: '3', title: 'Get a global-ready listing', desc: 'Ready to sell — in multiple languages.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="rounded-3xl bg-cream-100 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-500 text-white">
                  <Icon size={26} />
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-terracotta-500">Step {step}</div>
                <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
                <p className="mt-1 text-sm text-ink-700/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-center font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          You make the craft. We handle the digital world.
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-ink-700/70">
          Descriptions, pricing, translations, keywords and marketing — all generated for you, always editable by you.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Wand2, label: 'Descriptions' },
            { icon: Tags, label: 'Fair Pricing' },
            { icon: Globe2, label: 'Translations' },
            { icon: Sparkles, label: 'Marketing' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50/50 p-5 text-center">
              <Icon className="text-teal-600" size={24} />
              <span className="text-sm font-semibold text-teal-800">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <PrimaryButton onClick={onStart}>
            <Wand2 size={20} />
            Start Selling Globally
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
