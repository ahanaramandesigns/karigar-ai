import type { AppState } from '../types';
import { LANGUAGE_LABELS } from '../types';

export function buildExportText(state: AppState): string {
  const { listing, story, analysis, pricing, finalPrice, translations, marketing } = state;
  if (!listing) return '';

  const price = finalPrice ?? pricing?.recommended;
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('KARIGAR AI — MARKETPLACE-READY PRODUCT LISTING');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`TITLE: ${listing.title}`);
  lines.push(`CATEGORY: ${listing.category}`);
  lines.push(`PRICE: ${price ? `₹${price.toLocaleString('en-IN')}` : 'Not set'}`);
  lines.push('');
  lines.push('-- SHORT DESCRIPTION --');
  lines.push(listing.shortDescription);
  lines.push('');
  lines.push('-- DETAILED DESCRIPTION --');
  lines.push(listing.detailedDescription);
  lines.push('');
  lines.push('-- ARTISAN STORY --');
  lines.push(listing.artisanStory);
  lines.push('');
  lines.push(`MATERIALS: ${listing.materials}`);
  lines.push(`PRODUCTION TIME: ${listing.productionTime}`);
  lines.push(`KEYWORDS: ${listing.keywords.join(', ')}`);
  lines.push('');

  if (analysis) {
    lines.push('-- AI PHOTO ANALYSIS (artisan-reviewed) --');
    lines.push(`Craft type: ${analysis.craftType}`);
    lines.push(`Colors: ${analysis.colors.join(', ')}`);
    lines.push(`Style: ${analysis.style}`);
    lines.push('');
  }

  if (pricing) {
    lines.push('-- PRICING RATIONALE (AI-assisted estimate) --');
    pricing.explanation.forEach((e) => lines.push(`• ${e}`));
    lines.push(`Suggested range: ₹${pricing.low.toLocaleString('en-IN')} – ₹${pricing.high.toLocaleString('en-IN')}`);
    lines.push('');
  }

  const translated = Object.values(translations).filter(Boolean);
  if (translated.length) {
    lines.push('-- TRANSLATIONS --');
    translated.forEach((t) => {
      if (!t) return;
      lines.push(`[${LANGUAGE_LABELS[t.language].name}]`);
      lines.push(`Title: ${t.title}`);
      lines.push(`Description: ${t.shortDescription}`);
      lines.push('');
    });
  }

  if (marketing) {
    lines.push('-- MARKETING KIT --');
    lines.push(`Tagline: ${marketing.tagline}`);
    lines.push(`Instagram caption: ${marketing.instagramCaption}`);
    lines.push('');
    lines.push(`WhatsApp message: ${marketing.whatsappMessage}`);
    lines.push('');
    lines.push(`Target customers: ${marketing.targetSegment}`);
    lines.push('');
  }

  if (story.traditionStory) {
    lines.push('-- ORIGINAL ARTISAN INPUT (unedited) --');
    lines.push(`Materials: ${story.materials}`);
    lines.push(`Time to make: ${story.timeToMake}`);
    lines.push(`Tradition/story: ${story.traditionStory}`);
    lines.push(`Origin: ${story.origin}`);
    lines.push('');
  }

  lines.push('='.repeat(60));
  lines.push('Generated with Karigar AI — "You make the craft. We handle the digital world."');
  lines.push('='.repeat(60));

  return lines.join('\n');
}

export function downloadListing(state: AppState) {
  const text = buildExportText(state);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (state.listing?.title || 'product-listing').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  a.href = url;
  a.download = `${safeName}-karigar-listing.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
