import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of use for the Geeta Silk House website.",
};

export default function TermsPage() {
  return (
    <div className="bg-ivory">
      <div className="container-lux max-w-3xl py-28 sm:py-32">
        <p className="eyebrow text-wine">Legal</p>
        <h1 className="mt-5 font-display text-5xl text-ink">Terms &amp; Conditions</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-ink/70">
          <p>
            By using this website you agree to these terms. This site is a catalogue for browsing our
            sarees and for starting a conversation with our team.
          </p>
          <p>
            <strong className="text-ink">Enquiries, not orders.</strong> Buttons on this site open a
            WhatsApp conversation. Sending an enquiry does not create an order or a contract. A sale
            is confirmed only when our team has confirmed availability, pricing and payment with you.
          </p>
          <p>
            <strong className="text-ink">Product imagery.</strong> Images on this site are original
            illustrative artwork created to represent each saree’s colour, weave and style. They are
            not photographs of physical store inventory. Colours may also appear differently across
            screens. Please confirm the exact piece with our team before purchasing.
          </p>
          <p>
            <strong className="text-ink">Pricing.</strong> Prices shown are indicative, in Indian
            Rupees, and may change without notice. Final pricing is confirmed on enquiry.
          </p>
          <p className="rounded-lg border border-gold/30 bg-ivory-warm p-5 text-sm text-ink/60">
            Note for the store: add your verified shipping, returns and exchange policies here before
            launch. These are not stated on this website because the store has not yet supplied them.
          </p>
        </div>
        <Link
          href="/collection"
          className="mt-10 inline-flex rounded-full bg-wine px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-wine-deep"
        >
          Back to the collection
        </Link>
      </div>
    </div>
  );
}
