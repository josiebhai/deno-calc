// Single source of truth for share-link expiry duration. Structured this way
// so a future 7-day option can be added without touching multiple call sites.
export const SHARE_LINK_EXPIRY_DAYS = 30;
export const SHARE_LINK_EXPIRY_MS = SHARE_LINK_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://offering-counter.example.com";
export const SITE_NAME = "Offering Counter";
