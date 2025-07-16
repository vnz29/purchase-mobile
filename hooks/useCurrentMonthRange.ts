import { StyleSheet, Text, View } from "react-native";
import React from "react";

export const useCurrentMonthRange = () => {
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 1-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const start = new Date(year, month, 1); // 1st day of this month

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1); // Yesterday

  // If today is the 1st, make fromDate and toDate the same
  if (yesterday.getMonth() !== month) {
    return {
      fromDate: formatLocalDate(start),
      toDate: formatLocalDate(start),
    };
  }

  return {
    fromDate: formatLocalDate(start),
    toDate: formatLocalDate(yesterday),
  };
};
