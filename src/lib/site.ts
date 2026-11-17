import { getEntry } from 'astro:content';

export async function getSite() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('src/content/settings/site.json is missing.');
  return entry.data;
}

/** "07301 111 842" -> "tel:+447301111842" */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits.startsWith('0') ? `+44${digits.slice(1)}` : digits}`;
}
