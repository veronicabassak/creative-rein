# Creative Rein website

Astro + TypeScript, plain CSS, static output for Netlify.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
```

Needs Node 22.

## Where things live

| What | Where |
| --- | --- |
| Page content (a list of sections per page) | `src/content/pages/*.json` |
| Events (one file each) | `src/content/events/*.md` |
| Phone, email, address, menu | `src/content/settings/site.json` |
| Photos | `src/assets/images/` |
| Section components | `src/components/sections/` |
| Colours, type scale, spacing | `src/styles/global.css` |
| Content schema | `src/content.config.ts` |

`home.json` is the home page. Any other file in `src/content/pages` becomes a
page at `/<file-name>/`, so a new page needs no new template.

## Sections

Each section in a page file has a `_template` key: `hero`, `textPhoto`, `list`,
`eventList`, `gallery`, `priceList`, `bookingBanner` or `contactForm`.

- `textPhoto` takes one main photo and up to two smaller ones (`moreImages`).
- `list` has three styles: `columns` (photo + bullet points), `pairs` (title + text)
  and `steps` (numbered, for things that happen in order).
- `gallery` has three layouts: `grid` (with name tags), `strip` and `mosaic`. `_template` is the key
TinaCMS uses for blocks, so each schema in `content.config.ts` maps onto one
Tina template.

To add a section type: add its schema to `content.config.ts`, add a component
in `src/components/sections/`, and add one `case` in `src/components/Sections.astro`.

## Images

Content refers to images as `/images/file.jpg`. The files sit in
`src/assets/images` and `src/lib/images.ts` looks them up by file name, so Astro
resizes and converts them to WebP at build time. When Tina is added, point its
media folder at `src/assets/images`.

## Contact form

The form on /contact/ uses Netlify Forms. Nothing to set up in code: after the
first deploy, messages appear in the Netlify dashboard under Forms, and you can
turn on email notifications there so they go to Charlie. It does not send while
running `npm run dev`.

## Old addresses

`public/_redirects` sends the old Hostinger page addresses (e.g. /homeschooling)
to the new pages, so links people have saved still work.

## Photos

Put new photos in `src/assets/images/` and refer to them in the page files as
`"/images/file-name.jpg"`. Only the file name has to match.

If a photo gets cropped badly (heads cut off), add `"focus": "top"` next to its
`src` and `alt`. `"bottom"` and `"center"` also work.

## Events

Events that have finished are left out when the site builds. The Book button
goes to the event's `bookingUrl`; with no URL it goes to the enquiry section on
the Bookings page.
