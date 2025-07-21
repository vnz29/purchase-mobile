import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useCurrentMonthRange } from "../../hooks/useCurrentMonthRange";
import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../../api/purchase";
import { useAuthStore } from "../../store/useAuthStore";
import { router, useNavigation } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const history = () => {
  const { user, accessToken } = useAuthStore();
  const { fromDate, toDate } = useCurrentMonthRange();
  const navigation = useNavigation();
  const { data } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => getPurchases(accessToken!, fromDate, toDate, user?.id!),
  });
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShow(Platform.OS === "ios"); // On iOS, keep showing until user confirms
  };

  const getTimeAndDate = (createdAt: string) => {
    const purchaseDate = new Date(createdAt);
    const time = purchaseDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // enables AM/PM
    });
    return time;
  };
  // const allPurchases = data
  //   ?.flatMap((entry) => entry.purchases)
  //   .reduce((sum, purchase) => sum + purchase.amount, 0);
  // console.log(allPurchases);
  console.log(data);
  const handlePurchasePress = (purchase) => {
    router.push({
      pathname: "/purchaseDetails",
      params: {
        purchase: JSON.stringify(purchase),
      },
    });
  };
  console.log(date);
  return (
    <View>
      <Button title="Select Date" onPress={() => setShow(true)} />
      <Text>selected: {date.toLocaleString()}</Text>
      {show && (
        <DateTimePicker
          value={date}
          mode="date" // You can change to "time" or "datetime"
          display="default"
          onChange={onChange}
        />
      )}
      {data && (
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
              Item{data[0].totalCount > 0 && "s"}: {data[0].totalCount}
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
                {item.purchases.map((purchase, index) => (
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
                          {getTimeAndDate(purchase.createdAt)}
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
                      (sum: number, purchase) => sum + purchase.amount,
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
  );
};

export default history;

const styles = StyleSheet.create({});
