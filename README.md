# Offering Counter

A small, fast, mobile-first web app that helps church counting teams tally
cash offerings by denomination, share a read-only summary via an expiring
link, and export the count as CSV. No accounts, no login — anonymous by
design.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Firestore (no Firebase Auth)
- Firebase Analytics

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your Firebase project config
npm run dev
```

## Firebase setup

1. Create a Firebase project and a Firestore database.
2. Deploy security rules: `firebase deploy --only firestore:rules` (uses
   `firestore.rules` in this repo — allows anonymous `create`/`get` on
   `counts/{shareId}`, disallows `list`/query entirely).
3. Configure a **Firestore TTL policy** on the `counts` collection's
   `expiresAt` field (Firebase Console → Firestore → TTL) so expired
   documents are auto-deleted server-side. Note TTL deletion can lag up to
   ~24–72 hours, which is why the view page also checks `expiresAt`
   client-side.
4. Enable Firebase Analytics for the project and fill in the
   `NEXT_PUBLIC_FIREBASE_*` env vars from your web app config.

Share-link expiry duration is a single constant in `lib/config.ts`
(`SHARE_LINK_EXPIRY_DAYS`, currently 30) so it's easy to add a shorter
option later.

## Deploy

```bash
npm run build
firebase deploy
```
