export const currency = (value, currencyCode = 'USD') => (
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value)
)

export const numberCompact = (value) => (
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
)

export const dateLabel = (value) => (
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
)

export const percent = (value) => `${Math.round(value)}%`

