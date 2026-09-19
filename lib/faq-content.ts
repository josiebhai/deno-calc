import { SHARE_LINK_EXPIRY_DAYS } from "./config";

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is Offering Counter and who is it for?",
    answer:
      "Offering Counter is a free tool for church counting teams to quickly tally cash offerings by denomination and share the result with a treasurer or accountant — without spreadsheets or paperwork.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Offering Counter works anonymously with no sign-up, login, or account required. You just open the calculator, enter your counts, and generate a share link.",
  },
  {
    question: "What currencies are supported?",
    answer:
      "Indian Rupee (INR) is supported today, with denominations from ₹1 to ₹2000. More currencies are planned — the currency selector is built so new ones can be added easily.",
  },
  {
    question: "How long does a share link last, and what happens after it expires?",
    answer: `Every share link stays valid for ${SHARE_LINK_EXPIRY_DAYS} days from creation. After that, the link shows an "expired" message and the underlying data is automatically deleted.`,
  },
  {
    question: "Is my data safe? Can anyone else see my count?",
    answer:
      "Only someone with the exact share link can view a count — links cannot be browsed, listed, or guessed. No accounts or personal data are collected, and links auto-delete after they expire.",
  },
  {
    question: "Can I export the data?",
    answer:
      "Yes. Anyone with the share link can export the count as a CSV file directly from the summary page, ready to open in Excel, Sheets, or your accounting software.",
  },
  {
    question: "Is this free?",
    answer: "Yes, Offering Counter is completely free to use.",
  },
  {
    question: "How is this different from a general cash-counting app?",
    answer:
      "Offering Counter is purpose-built for church offering counting teams: it's optimized for quick denomination entry on a phone, requires no account, and makes it effortless to share a read-only summary with a treasurer via WhatsApp or any messaging app.",
  },
];
