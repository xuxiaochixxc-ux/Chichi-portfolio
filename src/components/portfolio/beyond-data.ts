export type BeyondVideo = {
  id: string;
  title: string;
  metadata: string;
  year: string;
  ratio: "portrait" | "landscape";
  src: string | null;
  poster?: string;
};

export type BeyondPhoto = {
  id: string;
  alt: string;
  title?: string;
  note?: string;
  ratio: "portrait" | "landscape" | "square";
  src: string | null;
  offset?: "none" | "low";
};

export const urbanDesignPortfolioPdfUrl = "https://cdn.enter.pro/resources/uid_100033229/57eb7171-ec23-4b.pdf";

export const beyondVideos: BeyondVideo[] = [
  {
    id: "product-demo",
    title: "PRODUCT DEMO",
    metadata: "Video Editing · Content Design",
    year: "2026",
    ratio: "landscape",
    src: null,
  },
  {
    id: "social-short",
    title: "SOCIAL SHORT",
    metadata: "Short-form Video · Campaign Content",
    year: "2026",
    ratio: "portrait",
    src: null,
  },
  {
    id: "launch-video",
    title: "LAUNCH VIDEO",
    metadata: "Product Storytelling · Editing",
    year: "2026",
    ratio: "landscape",
    src: null,
  },
];

export const beyondPhotos: BeyondPhoto[] = [
  { id: "photo-01", alt: "", ratio: "portrait", src: null, offset: "none" },
  { id: "photo-02", alt: "", ratio: "landscape", src: null, offset: "low" },
  { id: "photo-03", alt: "", ratio: "square", src: null, offset: "none" },
  { id: "photo-04", alt: "", ratio: "portrait", src: null, offset: "low" },
  { id: "photo-05", alt: "", ratio: "landscape", src: null, offset: "none" },
];

export type LifePhoto = {
  id: string;
  src: string;
  alt: string;
  orientation: "portrait" | "landscape" | "square";
  aspectRatio: number;
  caption?: string;
};

/**
 * Life, Lately — editorial horizontal photography archive.
 *
 * Each entry preserves its native orientation via `aspectRatio` (width /
 * height) so the strip renders varied widths at a constant height. Only
 * confidently identifiable locations carry a caption (PRAGUE ×2, HONG KONG
 * ×1, MUNICH ×1, sourced from unmistakable landmarks/signage in-frame); the
 * rest intentionally omit captions to avoid fabricated detail. Self-portrait
 * photos are interleaved with people/city/landscape frames rather than
 * placed consecutively; the sequence is bookended by two personal
 * effort/fitness self-photos (gym press → climbing).
 */
export const lifePhotos: LifePhoto[] = [
  {
    id: "life-photo-01",
    src: "https://cdn.enter.pro/resources/uid_100033229/fafddfd4-8f69-42.jpg",
    alt: "Lifting a dumbbell during a shoulder press at the gym",
    orientation: "portrait",
    aspectRatio: 0.7493,
  },
  {
    id: "life-photo-02",
    src: "https://cdn.enter.pro/resources/uid_100033229/db906066-b88d-46.jpg",
    alt: "Friends gathered together by a riverside promenade",
    orientation: "landscape",
    aspectRatio: 1.25,
  },
  {
    id: "life-photo-03",
    src: "https://cdn.enter.pro/resources/uid_100033229/781509b4-68d5-4d.jpg",
    alt: "Looking up at the spires of Prague Castle and St. Vitus Cathedral",
    orientation: "portrait",
    aspectRatio: 0.6667,
    caption: "PRAGUE",
  },
  {
    id: "life-photo-04",
    src: "https://cdn.enter.pro/resources/uid_100033229/689db83d-cf25-4a.jpg",
    alt: "A grassy alpine ridge with hikers walking along the cliff edge",
    orientation: "square",
    aspectRatio: 1,
  },
  {
    id: "life-photo-05",
    src: "https://cdn.enter.pro/resources/uid_100033229/8df051cd-106a-4c.jpg",
    alt: "Resting against a wall beneath blooming cherry blossoms in a graduation gown",
    orientation: "landscape",
    aspectRatio: 1.3328,
  },
  {
    id: "life-photo-06",
    src: "https://cdn.enter.pro/resources/uid_100033229/a03bcc19-e683-4a.jpg",
    alt: "A cobblestone street leading toward a green-domed church",
    orientation: "portrait",
    aspectRatio: 0.7499,
    caption: "PRAGUE",
  },
  {
    id: "life-photo-07",
    src: "https://cdn.enter.pro/resources/uid_100033229/11c91fb1-19a7-45.jpg",
    alt: "Sitting on the grass beside a whimsical stone sculpture and palm trees",
    orientation: "landscape",
    aspectRatio: 1.3336,
  },
  {
    id: "life-photo-08",
    src: "https://cdn.enter.pro/resources/uid_100033229/375ebbbc-6dc0-4e.jpg",
    alt: "A narrow Hong Kong street lined with high-rise buildings and shop signs",
    orientation: "portrait",
    aspectRatio: 0.7499,
    caption: "HONG KONG",
  },
  {
    id: "life-photo-09",
    src: "https://cdn.enter.pro/resources/uid_100033229/52bc7da3-c0cb-40.jpg",
    alt: "Holding an architectural model in front of urban design presentation boards",
    orientation: "landscape",
    aspectRatio: 1.3333,
  },
  {
    id: "life-photo-10",
    src: "https://cdn.enter.pro/resources/uid_100033229/da56c55c-c9e1-49.jpg",
    alt: "Riders on a swinging fairground carousel against a blue sky",
    orientation: "landscape",
    aspectRatio: 1.3336,
    caption: "MUNICH",
  },
  {
    id: "life-photo-11",
    src: "https://cdn.enter.pro/resources/uid_100033229/89ead4f8-0220-44.jpg",
    alt: "Climbing an indoor bouldering wall",
    orientation: "portrait",
    aspectRatio: 0.5626,
  },
];
