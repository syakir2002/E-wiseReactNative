import dayjs from "dayjs";
export function formatCurrency(value: number, currency = "RM"): string {
  const currencyCode = currency.toUpperCase() === "RM" ? "MYR" : currency;

  try {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const currencyLabel =
      currency.toUpperCase() === "RM" || currencyCode.toUpperCase() === "MYR"
        ? "RM"
        : currency;

    return `${currencyLabel} ${value.toFixed(2)}`;
  }
}

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
