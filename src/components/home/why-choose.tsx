import { Gem, HeartHandshake, Layers, MessageCircle, PartyPopper } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const reasons = [
  {
    icon: Gem,
    title: "Timeless Indian Elegance",
    copy: "Sarees chosen for drape, lustre and longevity — pieces that stay beautiful season after season.",
  },
  {
    icon: Layers,
    title: "Beautifully Curated Collections",
    copy: "Kanjivaram, Banarasi, Mysore, bridal and designer silks, thoughtfully grouped so you can find your edit quickly.",
  },
  {
    icon: PartyPopper,
    title: "Sarees for Every Celebration",
    copy: "From intimate family rituals to grand weddings — options for every occasion and every budget.",
  },
  {
    icon: HeartHandshake,
    title: "Personalised Shopping Assistance",
    copy: "Tell us the occasion, colours and budget. We will shortlist sarees that suit you best.",
  },
  {
    icon: MessageCircle,
    title: "Easy WhatsApp Enquiries",
    copy: "Enquire about any saree in one tap and continue the conversation with our team on WhatsApp.",
  },
];

export function WhyChoose() {
  return (
    <section className="bg-ivory-warm py-20 sm:py-28">
      <div className="container-lux">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-wine">Why Geeta Silk House</p>
          <h2 className="mt-5 font-display text-5xl leading-tight text-ink sm:text-6xl">
            Chosen with care, <span className="italic text-wine">for you</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 0.05} className="group">
              <div className="flex h-full flex-col">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-wine transition-colors duration-500 group-hover:border-wine group-hover:bg-wine group-hover:text-ivory">
                  <reason.icon size={22} />
                </span>
                <h3 className="mt-6 font-display text-2xl text-ink">{reason.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{reason.copy}</p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.25} className="sm:col-span-2 lg:col-span-1">
            <div className="flex h-full flex-col justify-center rounded-lg border border-gold/30 bg-ink p-8 text-ivory">
              <p className="font-display text-3xl leading-snug">
                Not sure where to begin?
              </p>
              <p className="mt-3 text-sm text-ivory/65">
                Share your occasion and budget — we will curate a shortlist for you.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
