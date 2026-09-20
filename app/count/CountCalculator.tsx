"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DEFAULT_CURRENCY_CODE, getCurrency, listCurrencies } from "@/lib/currencies";
import { createCount } from "@/lib/counts";
import { getFirebaseConfigSummary } from "@/lib/firebase";
import { track } from "@/lib/analytics";
import { SHARE_LINK_EXPIRY_DAYS, SITE_URL } from "@/lib/config";
import ShareButtons from "@/components/ShareButtons";

export default function CountCalculator() {
  const [currencyCode, setCurrencyCode] = useState<string>(DEFAULT_CURRENCY_CODE);
  const [orgName, setOrgName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [shareId, setShareId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  function logStep(message: string) {
    const timestamp = new Date().toISOString().slice(11, 19);
    setDebugLog((prev) => [...prev, `${timestamp} ${message}`]);
  }

  const currency = getCurrency(currencyCode);

  useEffect(() => {
    track({ name: "count_started", params: { currency_code: currencyCode } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const denominations = useMemo(
    () =>
      currency.denominations.map((value) => {
        const qty = quantities[value] ?? 0;
        return { value, qty, subtotal: value * qty };
      }),
    [currency, quantities]
  );

  const total = denominations.reduce((sum, d) => sum + d.subtotal, 0);

  function handleCurrencyChange(code: string) {
    setCurrencyCode(code);
    setQuantities({});
    setShareId(null);
    track({ name: "currency_changed", params: { currency_code: code } });
  }

  function handleQtyChange(value: number, qty: string) {
    const parsed = Math.max(0, parseInt(qty, 10) || 0);
    setQuantities((prev) => ({ ...prev, [value]: parsed }));
  }

  async function handleGenerateLink() {
    setSaving(true);
    setError(null);
    setDebugLog([]);
    logStep(`Starting — currency=${currency.code}, site_url=${SITE_URL}`);
    logStep(`Firebase config: ${getFirebaseConfigSummary()}`);
    try {
      const nonZero = denominations.filter((d) => d.qty > 0);
      logStep(`Writing count to Firestore (${nonZero.length} denominations, total=${total})…`);
      const timeoutMs = 15000;
      const id = await Promise.race([
        createCount({
          orgName,
          serviceName,
          currencyCode: currency.code,
          currencySymbol: currency.symbol,
          denominations,
          total,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`Timed out after ${timeoutMs / 1000}s waiting for Firestore — likely a network/firewall/ad-blocker issue, or Firestore isn't reachable with this config.`)),
            timeoutMs
          )
        ),
      ]);
      logStep(`Firestore write succeeded — shareId=${id}`);
      setShareId(id);
      track({
        name: "share_link_created",
        params: {
          currency_code: currency.code,
          total_denomination_count: nonZero.length,
          has_org_name: orgName.trim().length > 0,
          has_service_name: serviceName.trim().length > 0,
        },
      });
      logStep("Done.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logStep(`ERROR: ${message}`);
      setError("Something went wrong generating your link. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const shareUrl = shareId ? `${SITE_URL}/c?id=${shareId}` : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Count your offering</h1>
      <p className="mt-1 text-sm text-slate-600">
        Enter the quantity for each note. Your total updates live below.
      </p>

      {shareUrl ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="font-semibold text-green-900">Your link is ready</h2>
          <p className="mt-1 text-sm text-green-800">
            Valid for {SHARE_LINK_EXPIRY_DAYS} days. Anyone with this link can view the summary
            and export it as CSV.
          </p>
          <p className="mt-3 break-all rounded-md bg-white px-3 py-2 text-sm text-slate-700">
            {shareUrl}
          </p>
          <div className="mt-4">
            <ShareButtons
              url={shareUrl}
              text={`Offering count: ${currency.symbol}${total.toLocaleString()} total (valid for ${SHARE_LINK_EXPIRY_DAYS} days).`}
            />
          </div>
          <Link href={shareUrl.replace(SITE_URL, "")} className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            View & export this count →
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Church / Organization Name <span className="text-slate-400">(optional)</span>
              </span>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                onBlur={() => orgName.trim() && track({ name: "org_name_entered" })}
                placeholder="Grace Fellowship Church"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Service / Collection Name <span className="text-slate-400">(optional)</span>
              </span>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                onBlur={() => serviceName.trim() && track({ name: "service_name_entered" })}
                placeholder="5 AM Service"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="mt-4 block max-w-xs">
            <span className="text-sm font-medium text-slate-700">Currency</span>
            <select
              value={currencyCode}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {listCurrencies().map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label} ({c.symbol})
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Value</th>
                  <th className="px-4 py-2 font-medium">Quantity</th>
                  <th className="px-4 py-2 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {denominations.map((d) => (
                  <tr key={d.value}>
                    <td className="px-4 py-2 font-medium text-slate-800">
                      {currency.symbol}
                      {d.value}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={quantities[d.value] ?? ""}
                        onChange={(e) => handleQtyChange(d.value, e.target.value)}
                        placeholder="0"
                        className="w-24 rounded-md border border-slate-300 px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2 text-right text-slate-700">
                      {currency.symbol}
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
                    {currency.symbol}
                    {total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleGenerateLink}
            disabled={saving}
            className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Generating…" : "Share link"}
          </button>
          <p className="mt-2 text-xs text-slate-500">
            After generating a link, that link is where the summary and CSV export live —
            forward it to your treasurer or accountant.
          </p>

          {debugLog.length > 0 && (
            <pre className="mt-4 overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {debugLog.join("\n")}
            </pre>
          )}
        </>
      )}
    </div>
  );
}
