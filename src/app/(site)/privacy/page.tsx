import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Geeta Silk House handles information on this website.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-ivory">
      <div className="container-lux max-w-3xl py-28 sm:py-32">
        <p className="eyebrow text-wine">Legal</p>
        <h1 className="mt-5 font-display text-5xl text-ink">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-ink/70">
          <p>
            This website is an informational catalogue for Geeta Silk House. We do not require you to
            create an account and we do not sell your personal information.
          </p>
          <p>
            <strong className="text-ink">Enquiries.</strong> When you tap an “Enquire on WhatsApp”
            button, your device opens WhatsApp with a pre-filled message. Any information you then
            share is handled within WhatsApp under WhatsApp’s own privacy terms. Your enquiry list
            (saved sarees) is stored only in your browser and is never uploaded by this site.
          </p>
          <p>
            <strong className="text-ink">Store administration.</strong> The admin dashboard is
            password protected and used only by store staff to manage the catalogue.
          </p>
          <p>
            <strong className="text-ink">Cookies.</strong> This site does not use advertising or
            third-party tracking cookies.
          </p>
          <p className="rounded-lg border border-gold/30 bg-ivory-warm p-5 text-sm text-ink/60">
            Note for the store: replace this page with your verified privacy policy before launch if
            your practices differ from the description above.
          </p>
        </div>
      </div>
    </div>
  );
}
