import { customAlphabet } from "nanoid";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { getDb } from "./firebase";
import { SHARE_LINK_EXPIRY_MS } from "./config";
import type { CountRecord, DenominationLine } from "./types";

const nanoid = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 9);

export function generateShareId(): string {
  return nanoid();
}

export interface CreateCountInput {
  orgName: string;
  serviceName: string;
  currencyCode: string;
  currencySymbol: string;
  denominations: DenominationLine[];
  total: number;
}

export async function createCount(input: CreateCountInput): Promise<string> {
  const shareId = generateShareId();
  const now = Date.now();
  const expiresAt = now + SHARE_LINK_EXPIRY_MS;

  await setDoc(doc(getDb(), "counts", shareId), {
    orgName: input.orgName.trim() || null,
    serviceName: input.serviceName.trim() || null,
    currencyCode: input.currencyCode,
    currencySymbol: input.currencySymbol,
    denominations: input.denominations,
    total: input.total,
    createdAt: Timestamp.fromMillis(now),
    expiresAt: Timestamp.fromMillis(expiresAt),
  });

  return shareId;
}

export async function getCount(shareId: string): Promise<CountRecord | null> {
  const snap = await getDoc(doc(getDb(), "counts", shareId));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    orgName: data.orgName ?? null,
    serviceName: data.serviceName ?? null,
    currencyCode: data.currencyCode,
    currencySymbol: data.currencySymbol,
    denominations: data.denominations,
    total: data.total,
    createdAt: (data.createdAt as Timestamp).toMillis(),
    expiresAt: (data.expiresAt as Timestamp).toMillis(),
  };
}

export function isExpired(count: Pick<CountRecord, "expiresAt">): boolean {
  return count.expiresAt < Date.now();
}
