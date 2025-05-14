export type SortType = "asc" | "dec";

export function convertNumberToMoney(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.parseInt(value) / 100);
}

function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
}

export function sortByKey<T>(
  data: T[],
  key: keyof T,
  type: SortType = "asc",
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return type === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (
      typeof aValue === "string" &&
      typeof bValue === "string" &&
      isISODate(aValue) &&
      isISODate(bValue)
    ) {
      const aTime = new Date(aValue).getTime();
      const bTime = new Date(bValue).getTime();
      return type === "asc" ? aTime - bTime : bTime - aTime;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return type === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
}

export function chunkArray<T>(items: T[], size = 10) {
  if (size < 1) throw new Error("Chunk size can't be less than 1");

  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size);

    chunks.push(chunk);
  }

  return chunks;
}

export function chunkNumber(total: number, size = 10) {
  const result = [];

  while (total > 0) {
    result.push(Math.min(size, total));
    total -= size;
  }

  return result;
}
