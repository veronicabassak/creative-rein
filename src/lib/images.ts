import type { ImageMetadata } from 'astro';

/**
 * Content files store images as "/images/file.jpg" (the path TinaCMS's media
 * manager will write). The files themselves live in src/assets/images so Astro
 * can resize and compress them at build time. This looks one up by file name.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const byName = new Map(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop() ?? path, mod.default]),
);

export function resolveImage(src: string): ImageMetadata {
  const name = src.split('/').pop() ?? src;
  const found = byName.get(name);
  if (!found) {
    throw new Error(`Image "${src}" was not found in src/assets/images.`);
  }
  return found;
}

const focusPositions = { top: '50% 12%', center: '50% 50%', bottom: '50% 88%' } as const;

/** Inline style for a photo's crop focus, or undefined to use the component's default. */
export function focusStyle(focus?: keyof typeof focusPositions): string | undefined {
  return focus ? `object-position: ${focusPositions[focus]}` : undefined;
}
