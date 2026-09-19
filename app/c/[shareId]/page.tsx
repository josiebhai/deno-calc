import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/config";
import CountView from "./CountView";

export const metadata: Metadata = {
  title: `Shared count — ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default async function SharedCountPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  return <CountView shareId={shareId} />;
}
