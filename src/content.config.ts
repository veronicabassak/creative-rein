import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content model.
 *
 * Everything Charlie will edit lives in src/content as JSON or Markdown.
 * Pages are a list of sections; each section has a `_template` key naming the
 * component that renders it. That is the same shape TinaCMS uses for "blocks",
 * so each schema below maps one-to-one onto a Tina template later.
 *
 * Images are stored as "/images/file.jpg" strings (the path Tina's media
 * manager writes) and resolved to optimised assets in src/lib/images.ts.
 */

const image = z.object({
  src: z.string(),
  alt: z.string(),
});

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const background = z.enum(['plain', 'oat']).default('plain');

const hero = z.object({
  _template: z.literal('hero'),
  variant: z.enum(['home', 'page']).default('page'),
  heading: z.string(),
  /** A short second line under the heading, e.g. "Small groups, meaningful experiences". */
  tagline: z.string().optional(),
  lede: z.string().optional(),
  image: image.optional(),
  /** "Which of these is you?" links shown under the lede on the home page. */
  paths: z
    .array(z.object({ title: z.string(), detail: z.string(), href: z.string() }))
    .default([]),
  /** Show the next upcoming event on the lower half of the stable-door card. */
  showNextEvent: z.boolean().default(false),
});

const textPhoto = z.object({
  _template: z.literal('textPhoto'),
  id: z.string().optional(),
  heading: z.string(),
  tagline: z.string().optional(),
  /** Plain text. Leave a blank line between paragraphs. */
  body: z.string(),
  image: image.optional(),
  /** Up to two smaller photos shown under the main one. */
  moreImages: z.array(image).max(2).default([]),
  imageSide: z.enum(['left', 'right']).default('right'),
  background,
  link: link.optional(),
});

const list = z.object({
  _template: z.literal('list'),
  id: z.string().optional(),
  heading: z.string(),
  intro: z.string().optional(),
  /**
   * columns: side-by-side groups, each with an optional photo and bullet points.
   * pairs: a title with a sentence or two, two per row on wide screens.
   * steps: numbered, for things that happen in order.
   */
  style: z.enum(['columns', 'pairs', 'steps']).default('pairs'),
  items: z.array(
    z.object({
      title: z.string().optional(),
      text: z.string().optional(),
      image: image.optional(),
      points: z.array(z.string()).default([]),
    }),
  ),
  /** A closing sentence under the list. */
  note: z.string().optional(),
  background,
  link: link.optional(),
});

const eventList = z.object({
  _template: z.literal('eventList'),
  id: z.string().optional(),
  heading: z.string(),
  intro: z.string().optional(),
  /** 0 shows every upcoming event. */
  limit: z.number().int().min(0).default(0),
  emptyText: z
    .string()
    .default('Nothing is open for booking right now. Get in touch and we will tell you what is coming up.'),
  moreLink: link.optional(),
});

const gallery = z.object({
  _template: z.literal('gallery'),
  id: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  /**
   * grid: portrait tiles with optional name tags (for the ponies, pets and people).
   * strip: one row of photos, used to break up text.
   * mosaic: one large photo with smaller ones beside it.
   */
  layout: z.enum(['grid', 'strip', 'mosaic']).default('grid'),
  items: z.array(image.extend({ name: z.string().optional() })),
});

const priceList = z.object({
  _template: z.literal('priceList'),
  id: z.string().optional(),
  heading: z.string(),
  intro: z.string().optional(),
  items: z.array(
    z.object({ name: z.string(), detail: z.string().optional(), price: z.string() }),
  ),
  note: z.string().optional(),
});

const bookingBanner = z.object({
  _template: z.literal('bookingBanner'),
  id: z.string().optional(),
  heading: z.string(),
  text: z.string().optional(),
  button: link.optional(),
  /** Show the phone number and email from site settings. */
  showContact: z.boolean().default(true),
});

const contactForm = z.object({
  _template: z.literal('contactForm'),
  id: z.string().optional(),
  heading: z.string(),
  intro: z.string().optional(),
  /** Page people see after sending. */
  successPath: z.string().default('/thank-you/'),
});

const section = z.discriminatedUnion('_template', [
  hero,
  textPhoto,
  list,
  eventList,
  gallery,
  priceList,
  bookingBanner,
  contactForm,
]);

export type Section = z.infer<typeof section>;
export type SectionOf<T extends Section['_template']> = Extract<Section, { _template: T }>;

const pages = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Keep this page out of search results (e.g. the thank-you page). */
    noindex: z.boolean().default(false),
    sections: z.array(section),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    /** Local UK time, e.g. 2026-12-12T10:00 */
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
    price: z.string(),
    location: z.string().default('Creative Rein, Bathford'),
    includes: z.array(z.string()).default([]),
    /** Where the Book button goes. Leave empty to send people to the contact page. */
    bookingUrl: z.string().optional(),
    soldOut: z.boolean().default(false),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/settings' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.array(z.string()),
    mapUrl: z.string(),
    /** Links in the header. */
    nav: z.array(link),
    /** Links in the footer. */
    footerNav: z.array(link),
    bookButton: link,
  }),
});

export const collections = { pages, events, settings };
