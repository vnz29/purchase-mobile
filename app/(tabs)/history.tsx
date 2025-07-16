import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useCurrentMonthRange } from "../../hooks/useCurrentMonthRange";
const history = () => {
  const { fromDate, toDate } = useCurrentMonthRange();
  console.log(fromDate);
  console.log(toDate);
  return (
    <View>
      <Text>h</Text>
    </View>
  );
};

export default history;

const styles = StyleSheet.create({});
