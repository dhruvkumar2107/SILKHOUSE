export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function isSvg(src: string): boolean {
  return src.toLowerCase().endsWith(".svg");
}
