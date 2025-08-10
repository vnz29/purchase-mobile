import { useCallback, useEffect, useState } from "react";

export const useCurrentMonthRange = () => {
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const resetDates = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const start = new Date(year, month, 1);
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.getMonth() !== month) {
      const formatted = formatLocalDate(start);
      setFromDate(formatted);
      setToDate(formatted);
    } else {
      setFromDate(formatLocalDate(start));
      setToDate(formatLocalDate(yesterday));
    }
  }, []);

  useEffect(() => {
    resetDates();
  }, []);

  const updateDate = (Date: Date, type: string) => {
    if (type === "from-date") setFromDate(formatLocalDate(Date));
    else setToDate(formatLocalDate(Date));
  };
  return {
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    updateDate,
    resetDates,
  };
};
