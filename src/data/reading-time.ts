// Rough reading-time estimate. English ~200 wpm; Chinese ~400 chars/min.
export function readingTime(body: string, lang: string): number {
  if (lang === 'zh' || lang === 'zh-Hant' || lang === 'ja') {
    const chars = (body.match(/[一-鿿]/g) || []).length;
    return Math.max(1, Math.round(chars / 400));
  }
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
