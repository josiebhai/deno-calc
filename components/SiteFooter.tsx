import Link from "next/link";
import { SHARE_LINK_EXPIRY_DAYS, SITE_NAME } from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <Link href="/faq" className="hover:text-slate-800">
            FAQ
          </Link>
          <Link href="/count" className="hover:text-slate-800">
            Start counting
          </Link>
        </div>
        <p className="mt-4">
          Counts are anonymous — no accounts, no login — and share links auto-expire and
          delete after {SHARE_LINK_EXPIRY_DAYS} days.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
