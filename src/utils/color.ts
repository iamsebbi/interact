export const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== "string") return `rgba(0, 0, 0, ${alpha})`;
  let cleanHex = hex.replace("#", "");

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (cleanHex.length !== 6) {
    return hex; // fallback dacă este deja rgb sau alt format
  }

  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
