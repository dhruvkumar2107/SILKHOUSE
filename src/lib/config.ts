/**
 * Store configuration.
 *
 * Everything here is CONFIGURABLE. Items marked `TODO` are placeholders that the
 * Geeta Silk House team must supply with real, verified details — nothing here
 * fabricates store facts, certifications or reviews.
 */

export const storeConfig = {
  name: "Geeta Silk House",
  tagline: "Where Every Weave Tells a Royal Story.",
  establishedNote: "Serving Vijayapura with silk sarees and traditional wear.",

  address: {
    line1: "1st Floor, Damagar Complex",
    line2: "BLDEA Road, Sumiti Nagar, Gacchinakatti Colony",
    city: "Vijayapura",
    state: "Karnataka",
    postalCode: "586103",
    country: "India",
  },

  /**
   * WhatsApp number in international format WITHOUT symbols, e.g. "919876543210".
   * Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local. When empty, enquiry buttons open
   * WhatsApp with the message pre-filled so the customer can choose a recipient.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",

  /**
   * TODO: add only when verified by the store. Leave blank to hide.
   * Example: "+91 90000 00000"
   */
  phone: process.env.NEXT_PUBLIC_STORE_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL ?? "",

  /**
   * TODO: add only when the store has these accounts. Leave blank to hide.
   */
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
  },
} as const;

export const fullAddress = `${storeConfig.name}, ${storeConfig.address.line1}, ${storeConfig.address.line2}, ${storeConfig.address.city}, ${storeConfig.address.state} ${storeConfig.address.postalCode}, ${storeConfig.address.country}`;

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "Signature Edit", href: "/#signature" },
  { label: "Our Story", href: "/#story" },
  { label: "Visit Us", href: "/#location" },
] as const;
