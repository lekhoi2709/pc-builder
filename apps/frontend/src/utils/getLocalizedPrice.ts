import type { Component } from '../types/components';

const langToPriceIndex: Record<string, number> = {
  en: 0,
  vn: 1,
};

const langToLocale: Record<string, string> = {
  en: 'en-US',
  vn: 'vi-VN',
};

function formatPrice(
  currency: string,
  price: number,
  symbol: string,
  locale: string
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  const formatted = formatter.format(price);

  return {
    price: symbol ? formatted.replace(currency, symbol) : formatted,
  };
}

export default function getLocalizedPrice(component: Component, lang: string) {
  const idx = langToPriceIndex[lang] ?? 0;
  const locale = langToLocale[lang] ?? 'en-US';

  const item = component.price[idx];
  if (!item) return { price: '' };

  return formatPrice(item.currency, item.amount, item.symbol, locale);
}
