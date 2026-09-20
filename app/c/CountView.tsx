"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCount, isExpired } from "@/lib/counts";
import { downloadCsv } from "@/lib/csv";
import { track } from "@/lib/analytics";
import { SITE_URL } from "@/lib/config";
import ShareButtons from "@/components/ShareButtons";
import type { CountRecord } from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "expired" }
  | { status: "not-found" }
  | { status: "ready"; count: CountRecord; loadedAt: number };

function getDaysRemaining(expiresAt: number, loadedAt: number): number {
  return Math.max(0, Math.ceil((expiresAt - loadedAt) / (24 * 60 * 60 * 1000)));
}

export default function CountView() {
  const searchParams = useSearchParams();
  const shareId = searchParams.get("id");
  const [state, setState] = useState<LoadState>(
    shareId ? { status: "loading" } : { status: "not-found" }
  );

  useEffect(() => {
    if (!shareId) {
      track({ name: "share_link_viewed", params: { valid: false } });
      return;
    }

    let cancelled = false;

    getCount(shareId)
      .then((count) => {
        if (cancelled) return;
        if (!count) {
          setState({ status: "not-found" });
          track({ name: "share_link_viewed", params: { valid: false } });
          return;
        }
        if (isExpired(count)) {
          setState({ status: "expired" });
          track({ name: "share_link_viewed", params: { valid: false } });
          return;
        }
        setState({ status: "ready", count, loadedAt: Date.now() });
        track({ name: "share_link_viewed", params: { valid: true } });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "not-found" });
      });

    return () => {
      cancelled = true;
    };
  }, [shareId]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-500">
        Loading count…
      </div>
    );
  }

  if (state.status === "not-found" || state.status === "expired") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">This link has expired</h1>
        <p className="mt-3 text-slate-600">
          Share links are only valid for a limited time, and this one is no longer available.
        </p>
        <Link
          href="/count"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Start a new count
        </Link>
      </div>
    );
  }

  const { count, loadedAt } = state;
  const shareUrl = `${SITE_URL}/c?id=${shareId}`;
  const daysRemaining = getDaysRemaining(count.expiresAt, loadedAt);

  function handleExport() {
    downloadCsv(count, `offering-count-${shareId}.csv`);
    track({ name: "csv_exported" });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {(count.orgName || count.serviceName) && (
        <div className="mb-6">
          {count.orgName && <h1 className="text-2xl font-bold text-slate-900">{count.orgName}</h1>}
          {count.serviceName && <p className="text-slate-600">{count.serviceName}</p>}
        </div>
      )}
      {!count.orgName && !count.serviceName && (
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Offering count</h1>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 text-sm text-slate-500">
          <span>Counted on {new Date(count.createdAt).toLocaleDateString()}</span>
          <span>Expires in {daysRemaining} day{daysRemaining === 1 ? "" : "s"}</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Value</th>
              <th className="px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {count.denominations.map((d) => (
              <tr key={d.value}>
                <td className="px-4 py-2 font-medium text-slate-800">
                  {count.currencySymbol}
                  {d.value}
                </td>
                <td className="px-4 py-2 text-slate-700">{d.qty}</td>
                <td className="px-4 py-2 text-right text-slate-700">
                  {count.currencySymbol}
                  {d.subtotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900" colSpan={2}>
                Total
              </td>
              <td className="px-4 py-3 text-right text-lg font-bold text-slate-900">
                {count.currencySymbol}
                {count.total.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Export as CSV
        </button>
      </div>

      <div className="mt-4">
        <ShareButtons
          url={shareUrl}
          text={`Offering count: ${count.currencySymbol}${count.total.toLocaleString()} total.`}
        />
      </div>
    </div>
  );
}
