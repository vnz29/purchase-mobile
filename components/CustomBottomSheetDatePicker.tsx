import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomBottomSheetDatePicker: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={date.toDateString()}
        editable={false}
        pointerEvents="none"
      />
      <TouchableOpacity onPress={showDatePicker} style={styles.icon}>
        <Icon name="calendar-today" size={24} color="#000" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  icon: {
    padding: 8,
  },
});

export default CustomBottomSheetDatePicker;
