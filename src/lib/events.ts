import { getCollection, type CollectionEntry } from 'astro:content';

export type EventEntry = CollectionEntry<'events'>;

/** "Now" in UK local time, in the same YYYY-MM-DDTHH:mm shape events use. */
function ukNow(): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/**
 * Events that have not finished yet, soonest first.
 * This runs when the site is built, so a past event drops off at the next build.
 */
export async function getUpcomingEvents(limit = 0): Promise<EventEntry[]> {
  const now = ukNow();
  const upcoming = (await getCollection('events'))
    .filter((event) => event.data.end >= now)
    .sort((a, b) => a.data.start.localeCompare(b.data.start));
  return limit > 0 ? upcoming.slice(0, limit) : upcoming;
}

/** "Saturday 12 December" */
export function formatDay(local: string): string {
  const [year, month, day] = local.slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)));
}

/** "10am", "12 noon", "1.30pm" */
export function formatTime(local: string): string {
  const [hour = 0, minute = 0] = local.slice(11, 16).split(':').map(Number);
  if (hour === 12 && minute === 0) return '12 noon';
  if (hour === 0 && minute === 0) return 'midnight';
  const suffix = hour >= 12 ? 'pm' : 'am';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${h}${suffix}` : `${h}.${String(minute).padStart(2, '0')}${suffix}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} to ${formatTime(end)}`;
}
