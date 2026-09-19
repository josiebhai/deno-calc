import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/faq" className="hover:text-slate-900">
            FAQ
          </Link>
          <Link
            href="/count"
            className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500"
          >
            Start counting
          </Link>
        </nav>
      </div>
    </header>
  );
}
