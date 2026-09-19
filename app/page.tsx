import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faq-content";
import { SHARE_LINK_EXPIRY_DAYS, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Church Offering Counting, Simplified`,
  description:
    "Tally cash offerings by denomination, share a read-only summary via an expiring link, and export as CSV. No accounts, no login — built for church counting teams.",
  alternates: { canonical: "/" },
};

const steps = [
  { title: "Enter counts", body: "Log how many of each note you counted — the total updates live." },
  { title: "Get your total", body: "See the grand total instantly, broken down by denomination." },
  { title: "Share the link", body: "Generate a read-only link that's valid for 30 days and send it via WhatsApp." },
  { title: "Recipient views & exports", body: "Your treasurer opens the link, sees the summary, and exports it as CSV." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: SITE_URL,
  description:
    "A free tool for church counting teams to tally cash offerings by denomination, share a read-only summary via an expiring link, and export the count as CSV.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 text-center sm:pt-24">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Count your church offering in minutes. Share it in seconds.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          A free, mobile-first tool for church counting teams to tally cash by denomination and
          share a read-only summary with your treasurer — no accounts, no login.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/count"
            className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-indigo-500"
          >
            Start counting — it&apos;s free
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="flex flex-col items-start">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Denomination entry, built for phones</h2>
            <p className="mt-3 text-slate-600">
              Enter the quantity for each note value — ₹2000 down to ₹1 — and watch the subtotal
              and grand total update live. When you&apos;re done, generate a share link and send
              it straight to WhatsApp or any messaging app.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2 font-medium text-slate-500">
                <span>Value</span>
                <span>Qty</span>
                <span>Subtotal</span>
              </div>
              {[
                [2000, 3, 6000],
                [500, 10, 5000],
                [100, 25, 2500],
              ].map(([value, qty, subtotal]) => (
                <div key={value} className="flex justify-between text-slate-700">
                  <span>₹{value}</span>
                  <span>{qty}</span>
                  <span>₹{subtotal}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
                <span>Total</span>
                <span>₹13,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="rounded-lg border border-slate-200 bg-white p-4 open:shadow-sm"
              >
                <summary className="cursor-pointer font-medium text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/faq" className="text-indigo-600 hover:underline">
              See the full FAQ
            </Link>{" "}
            · Share links auto-expire and delete after {SHARE_LINK_EXPIRY_DAYS} days.
          </p>
        </div>
      </section>
    </>
  );
}
