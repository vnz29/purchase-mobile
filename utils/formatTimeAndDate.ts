export const formatTimeAndDate = (createdAt: string) => {
  const purchaseDate = new Date(createdAt);
  const time = purchaseDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // enables AM/PM
  });
  return time;
};

export const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
