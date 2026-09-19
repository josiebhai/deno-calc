import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/faq-content";
import { SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `FAQ — ${SITE_NAME}`,
  description:
    "Answers to common questions about Offering Counter: accounts, supported currencies, link expiry, data privacy, CSV export, and pricing.",
  alternates: { canonical: "/faq" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold text-slate-900">Frequently asked questions</h1>
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
    </section>
  );
}
