export const sanitizePriceInput = text => {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const [whole = '', ...fractionParts] = cleaned.split('.');

  if (!fractionParts.length) {
    return whole;
  }

  return `${whole}.${fractionParts.join('').slice(0, 2)}`;
};

export const parsePrice = value => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const num =
    typeof value === 'number' ? value : parseFloat(String(value).trim());

  if (!Number.isFinite(num) || num < 0) {
    return null;
  }

  return Math.round(num * 100) / 100;
};

export const formatPrice = value => {
  const num = parsePrice(value);

  if (num === null) {
    return null;
  }

  return Number.isInteger(num) ? String(num) : num.toFixed(2);
};

export const formatPriceDisplay = value => {
  const formatted = formatPrice(value);

  return formatted !== null ? `$${formatted}` : null;
};
