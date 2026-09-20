import type { Metadata } from "next";
import CountCalculator from "./CountCalculator";

export const metadata: Metadata = {
  title: "Count offering",
  description: "Tally your cash offering by denomination and generate a 30-day share link.",
  alternates: { canonical: "/count" },
};

export default function CountPage() {
  return <CountCalculator />;
}
