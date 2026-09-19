"use client";

import { useState, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";

interface ShareButtonsProps {
  url: string;
  text: string;
}

function subscribeNoop() {
  return () => {};
}

function useNativeShareSupport(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => typeof navigator !== "undefined" && !!navigator.share,
    () => false
  );
}

export default function ShareButtons({ url, text }: ShareButtonsProps) {
  const canNativeShare = useNativeShareSupport();
  const [copied, setCopied] = useState(false);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  async function handleNativeShare() {
    try {
      await navigator.share({ title: text, url });
      track({ name: "generic_share_clicked" });
    } catch {
      // user cancelled — no-op
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track({ name: "copy_link_clicked" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ name: "whatsapp_share_clicked" })}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
      >
        Share via WhatsApp
      </a>
      {canNativeShare ? (
        <button
          type="button"
          onClick={handleNativeShare}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Share
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      )}
    </div>
  );
}
