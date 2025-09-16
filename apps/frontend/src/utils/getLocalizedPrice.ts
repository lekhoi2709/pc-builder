import type { PriceItem } from '../types/components';

const langToPriceIndex: Record<string, number> = {
  en: 0,
  vn: 1,
};

const langToLocale: Record<string, string> = {
  en: 'en-US',
  vn: 'vi-VN',
};

export function formatPrice({
  currency,
  price,
  locale,
  style,
  symbol,
}: {
  currency?: string;
  price?: number;
  locale?: string;
  style: 'decimal' | 'currency' | 'percent' | 'unit';
  symbol?: string;
}) {
  const formatter = new Intl.NumberFormat(locale, {
    style,
    currency,
  });

  const formatted = formatter.format(price!);

  return {
    price: symbol ? formatted.replace(currency!, symbol) : formatted,
  };
}

export default function getLocalizedPrice(price: PriceItem[], lang: string) {
  const idx = langToPriceIndex[lang] ?? 0;
  const locale = langToLocale[lang] ?? 'en-US';

  const item = price[idx];
  if (!item) return { price: '' };

  return formatPrice({
    currency: item.currency,
    price: item.amount,
    locale,
    style: 'currency',
    symbol: item.symbol,
  });
}
