import type { Metadata } from "next";
import { Suspense } from "react";
import CountView from "./CountView";

export const metadata: Metadata = {
  title: "Shared count",
  robots: { index: false, follow: false },
};

export default function SharedCountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-500">
          Loading count…
        </div>
      }
    >
      <CountView />
    </Suspense>
  );
}
