export function formatLocalDateTime(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(",", ""); // Remove comma between date and time
}

export function formatLocalTime(dateString: string, durationMinutes?: number) {
  const date = new Date(dateString);

  if (durationMinutes) {
    date.setMinutes(date.getMinutes() + durationMinutes);
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  }).format(date);
}
