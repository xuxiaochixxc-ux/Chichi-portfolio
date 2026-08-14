export const isChineseLanguage = (language?: string) =>
  language?.toLowerCase().startsWith("zh") ?? false;

/**
 * Selects one side of permanent `English / 中文` portfolio labels.
 * Delimiters inside terms such as A/B remain intact because only spaced
 * separators are treated as bilingual boundaries.
 */
export const localizeBilingualLabel = (value: string, chinese: boolean) => {
  const parts = value.split(" / ");
  if (parts.length < 2) return value;
  return chinese ? parts.slice(1).join(" / ") : parts[0];
};
