import { motion } from 'framer-motion';
import { Camera, Ear, EarOff, Globe2, Mic, Sparkles, Store, Tags, Wand2 } from 'lucide-react';
import { GhostButton, PrimaryButton, SecondaryButton, SpeakButton } from '../ui';
import { DEMO_IMAGE_URL } from '../../data/demoData';
import { LANGUAGE_LABELS, SPEECH_LOCALES, type Language } from '../../types';
import { useT } from '../../i18n/I18nContext';

interface Props {
  onStart: () => void;
  onTryDemo: () => void;
  onGoToMarketplace: () => void;
  selectedLanguages: Language[];
  uiLanguage: Language;
  onChooseLanguages: (langs: Language[], justSelected?: Language) => void;
  readOnHover: boolean;
  onToggleReadOnHover: () => void;
}

export function Landing({
  onStart,
  onTryDemo,
  onGoToMarketplace,
  selectedLanguages,
  uiLanguage,
  onChooseLanguages,
  readOnHover,
  onToggleReadOnHover,
}: Props) {
  const t = useT();
  const uiLang = uiLanguage;

  // Local toggle — computes the next array from its own closure per click,
  // so rapid multi-select clicks never race each other (see App.tsx's
  // chooseLanguages, which replaces the whole array in one call). Passes
  // along which language was just turned on, so the site's UI language
  // switches to it immediately — array order alone can't tell us that,
  // since the default 'en' stays in the array even after adding more.
  const toggle = (lang: Language) => {
    const has = selectedLanguages.includes(lang);
    const next = has ? selectedLanguages.filter((l) => l !== lang) : [...selectedLanguages, lang];
    onChooseLanguages(next, has ? undefined : lang);
  };

  return (
    <div className="texture-weave">
      {/* Language + accessibility — kept first, at the very top */}
      <section className="border-b border-terracotta-100 bg-white/70 py-10">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ochre-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ochre-700">
            <Globe2 size={14} /> {t('landing.chooseLangEyebrow')}
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{t('landing.chooseLangHeading')}</h2>
            <SpeakButton text={`${t('landing.chooseLangHeading')}. ${t('landing.chooseLangSubtitle')}`} lang={SPEECH_LOCALES[uiLang]} />
          </div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-700/70">{t('landing.chooseLangSubtitle')}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => {
              const info = LANGUAGE_LABELS[lang];
              const selected = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  onClick={() => toggle(lang)}
                  aria-pressed={selected}
                  className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                    selected
                      ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-700'
                      : 'border-cream-300 bg-white text-ink-700/70 hover:border-terracotta-200'
                  }`}
                >
                  <span className="text-lg">{info.flag}</span>
                  {info.name}
                  <span className="text-xs text-ink-700/40">({info.native})</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 border-t border-cream-200 pt-5">
            <button
              onClick={onToggleReadOnHover}
              aria-pressed={readOnHover}
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                readOnHover ? 'border-teal-600 bg-teal-600 text-white' : 'border-teal-200 bg-white text-teal-700 hover:bg-teal-50'
              }`}
            >
              {readOnHover ? <Ear size={16} /> : <EarOff size={16} />}
              {t('landing.readOnHoverToggle')}
            </button>
            <p className="max-w-md text-xs text-ink-700/50">{t('landing.readOnHoverHint')}</p>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:flex-row lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-ochre-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ochre-700">
            <Sparkles size={14} /> {t('landing.eyebrow')}
          </div>
          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink-900 sm:text-5xl lg:text-6xl">
              {t('landing.heroTitlePrefix')}{' '}
              <span className="text-terracotta-500">{t('landing.heroTitleHighlight')}</span>
            </h1>
            <SpeakButton
              text={`${t('landing.heroTitlePrefix')} ${t('landing.heroTitleHighlight')}. ${t('landing.heroSubtitlePrefix')} ${t('landing.heroSubtitleBold')} ${t('landing.helper')}`}
              lang={SPEECH_LOCALES[uiLang]}
              size={18}
            />
          </div>
          <p className="mx-auto mt-5 max-w-lg text-lg text-ink-700/80 lg:mx-0">
            {t('landing.heroSubtitlePrefix')} <span className="font-semibold text-ink-900">{t('landing.heroSubtitleBold')}</span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <PrimaryButton onClick={onStart} className="w-full sm:w-auto">
              <Wand2 size={20} />
              {t('landing.ctaStart')}
            </PrimaryButton>
            <SecondaryButton onClick={onTryDemo} className="w-full sm:w-auto">
              {t('landing.ctaDemo')}
            </SecondaryButton>
            <GhostButton onClick={onGoToMarketplace} className="w-full border-2 border-teal-200 sm:w-auto">
              <Store size={18} />
              {t('landing.ctaMarketplace')}
            </GhostButton>
          </div>
          <p className="mt-4 text-sm text-ink-700/50">{t('landing.helper')}</p>
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
              <p className="text-xs text-teal-700">{t('landing.demoBadge')}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3-step process */}
      <section className="border-y border-terracotta-100 bg-white/60 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            {t('landing.stepsHeading')}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Camera, step: '1', title: t('landing.step1Title'), desc: t('landing.step1Desc'), badge: 'bg-terracotta-500', label: 'text-terracotta-500' },
              { icon: Mic, step: '2', title: t('landing.step2Title'), desc: t('landing.step2Desc'), badge: 'bg-marigold-500', label: 'text-marigold-600' },
              { icon: Globe2, step: '3', title: t('landing.step3Title'), desc: t('landing.step3Desc'), badge: 'bg-teal-500', label: 'text-teal-600' },
            ].map(({ icon: Icon, step, title, desc, badge, label }) => (
              <div key={step} className="rounded-3xl bg-cream-100 p-6 text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white ${badge}`}>
                  <Icon size={26} />
                </div>
                <div className={`mb-1 text-xs font-bold uppercase tracking-wide ${label}`}>Step {step}</div>
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
          {t('landing.handleHeading')}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-ink-700/70">{t('landing.handleSubtitle')}</p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Wand2, label: t('landing.featureDescriptions'), border: 'border-terracotta-100', bg: 'bg-terracotta-50/50', icon_: 'text-terracotta-600', text: 'text-terracotta-800' },
            { icon: Tags, label: t('landing.featurePricing'), border: 'border-marigold-200', bg: 'bg-marigold-50/50', icon_: 'text-marigold-600', text: 'text-marigold-800' },
            { icon: Globe2, label: t('landing.featureTranslations'), border: 'border-ochre-200', bg: 'bg-ochre-50/50', icon_: 'text-ochre-600', text: 'text-ochre-800' },
            { icon: Sparkles, label: t('landing.featureMarketing'), border: 'border-teal-100', bg: 'bg-teal-50/50', icon_: 'text-teal-600', text: 'text-teal-800' },
          ].map(({ icon: Icon, label, border, bg, icon_, text }) => (
            <div key={label} className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center ${border} ${bg}`}>
              <Icon className={icon_} size={24} />
              <span className={`text-sm font-semibold ${text}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <PrimaryButton onClick={onStart}>
            <Wand2 size={20} />
            {t('landing.ctaStart')}
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
