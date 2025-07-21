import { StyleSheet, Text, View } from "react-native";
import React from "react";

const about = () => {
  console.log("tests");
  return (
    <View>
      <View>
        <Text>About the App</Text>
      </View>
      <View>
        <Text>
          Take control of your finances with our easy-to-use expense monitoring
          app. Designed to help you track every dollar, this app gives you a
          clear picture of your spending habits so you can make smarter
          financial decisions.Take control of your finances with our easy-to-use
          expense monitoring app. Designed to help you track every dollar, this
          app gives you a clear picture of your spending habits so you can make
          smarter financial decisions.
        </Text>
        <Text>
          Whether you're budgeting for personal goals or just want to stay
          organized, the app allows you to record daily expenses, categorize
          transactions, set spending limits, and view insightful reports — all
          in one place.
        </Text>
        <Text>
          Stay on top of your money, reduce unnecessary spending, and build
          better financial habits — starting today.
        </Text>
      </View>
    </View>
  );
};

export default about;

const styles = StyleSheet.create({});
