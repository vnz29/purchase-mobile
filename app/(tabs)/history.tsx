import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useCurrentMonthRange } from "../../hooks/useCurrentMonthRange";
import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../../api/purchase";
import { useAuthStore } from "../../store/useAuthStore";
import { router, useFocusEffect, useNavigation } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import CustomBottomSheetDatePicker from "../../components/CustomBottomSheetDatePicker";
import { useBottomSheet } from "../../hooks/useBottomSheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TPurchase } from "../../types";
import { formatTimeAndDate } from "../../utils/formatTimeAndDate";
const history = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const { user, accessToken } = useAuthStore();
  const { fromDate, toDate, updateDate, resetDates } = useCurrentMonthRange();
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => getPurchases(accessToken!, fromDate, toDate, user?.id!),
    enabled: Boolean(fromDate && toDate),
  });
  useFocusEffect(
    useCallback(() => {
      // Screen is focused — you can optionally do something here
      refetch();
      return () => {
        // Screen is unfocused — reset dates
        console.log("hello");
        resetDates();
      };
    }, [])
  );

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShow(Platform.OS === "ios"); // On iOS, keep showing until user confirms
  };

  const handlePurchasePress = (purchase: TPurchase) => {
    router.push({
      pathname: "/purchaseDetails",
      params: {
        purchase: JSON.stringify(purchase),
      },
    });
  };
  const {
    bottomSheetModalRef,
    snapPoints,
    handleCloseModalPress,
    handlePresentModalPress,
  } = useBottomSheet(["45%"]);

  const handleUpdate = (date: Date, type: string) => {
    updateDate(date, type);
  };
  const handleUpdateDate = () => {
    refetch();
    handleCloseModalPress();
  };
  if (isFetching) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          padding: 15,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: 600 }}>
          {fromDate} - {toDate}
        </Text>
        <TouchableOpacity onPress={() => handlePresentModalPress()}>
          <AntDesign name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <CustomBottomSheetDatePicker
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleUpdate={handleUpdate}
        fromDate={fromDate}
        toDate={toDate}
        isLoading={isLoading}
        handleClick={handleUpdateDate}
        onClosePress={handleCloseModalPress}
        headerText="Search Purchased"
      />

      {show && (
        <DateTimePicker
          value={date}
          mode="date" // You can change to "time" or "datetime"
          display="default"
          onChange={onChange}
        />
      )}
      <View>
        {data?.length > 0 && (
          <View style={{ paddingBottom: 100 }}>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 15,
                paddingHorizontal: 15,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: 500, fontSize: 16 }}>
                {`Item${data[0]?.totalCount > 1 ? "s" : ""}: ${
                  data[0].totalCount
                }`}
              </Text>
              <Text style={{ fontWeight: 500, fontSize: 16 }}>
                Total Amount: ₱{data[0].totalAmount}
              </Text>
            </View>
            <FlatList
              data={data[0].days}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View
                  style={{
                    paddingHorizontal: 15,
                  }}
                >
                  {/* Divider with Centered Date and Count */}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 12,
                    }}
                  >
                    <Text
                      style={{
                        marginHorizontal: 4,

                        backgroundColor: "#34d399",
                        color: "black",
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        fontWeight: 500,
                        borderRadius: 20,
                      }}
                    >
                      {item._id}
                      {/* ({item.count} item{item.count > 1 ? "s" : ""}) */}
                    </Text>
                    <View
                      style={{ flex: 1, height: 1, backgroundColor: "#ccc" }}
                    />

                    <View
                      style={{ flex: 1, height: 1, backgroundColor: "#ccc" }}
                    />
                  </View>

                  {/* Purchases under this date */}
                  {item.purchases.map((purchase: TPurchase, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePurchasePress(purchase)} // <- your function here
                      activeOpacity={0.7}
                    >
                      <View
                        key={index}
                        style={{
                          paddingHorizontal: 15,
                          paddingVertical: 15,
                          marginBottom: 4,
                          backgroundColor: "#fff",
                          borderRadius: 8,
                          marginVertical: 6,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontWeight: 600, fontSize: 14 }}>
                            {purchase.name}
                          </Text>
                          <Text
                            style={{
                              color: "#666",
                              fontWeight: 300,
                              fontSize: 14,
                            }}
                          >
                            {formatTimeAndDate(purchase.createdAt)}
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end", marginTop: 3 }}>
                          <Text
                            style={{
                              color: "green",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            ₱{purchase.amount}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}

                  <View
                    style={{
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      padding: 10,
                    }}
                  >
                    <Text style={{ fontWeight: 500, fontSize: 16 }}>
                      Total {item.count} purchase{item.count > 1 ? "s" : ""}: ₱
                      {item.purchases.reduce(
                        (sum: number, purchase: TPurchase) =>
                          sum + purchase.amount,
                        0
                      )}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default history;

const styles = StyleSheet.create({});
