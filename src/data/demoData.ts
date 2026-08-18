import type { ArtisanStory, ProductAnalysis } from '../types';

// Sample/demo artisan data so judges can experience the full flow instantly
// without uploading anything. Clearly fictional — for demonstration only.

export const DEMO_IMAGE_URL =
  'https://images.unsplash.com/photo-1622560481156-01415a693ea6?q=80&w=1200&auto=format&fit=crop';

export const DEMO_PRODUCT_NAME = 'Handwoven Bamboo Basket';

export const DEMO_ARTISAN_NAME = 'Lakshmi Devi (sample artisan)';

export const DEMO_STORY: ArtisanStory = {
  materials: 'Natural bamboo strips, sun-dried and hand-split. No dyes or plastic used.',
  timeToMake: 'About 2 to 3 days, working a few hours each day.',
  traditionStory:
    'I learned this weaving pattern from my mother, who learned it from her mother. In our village, most homes near the river used baskets like this to carry rice and vegetables. I still soak the bamboo the same way my family always has, before splitting it by hand.',
  origin: 'Made in our village workshop in a rural district known locally for bamboo craft.',
  productNameHint: DEMO_PRODUCT_NAME,
};

export const DEMO_ANALYSIS: ProductAnalysis = {
  category: 'Home Décor & Storage — Baskets',
  visibleMaterials: ['Bamboo (natural fiber)', 'Hand-split cane strips'],
  craftType: 'Hand-weaving',
  colors: ['Natural tan', 'Warm honey brown'],
  style: 'Rustic, traditional, minimal',
  notes:
    'This is a best-effort visual read of the photo. The artisan\'s own description below is treated as the primary source of truth.',
};
