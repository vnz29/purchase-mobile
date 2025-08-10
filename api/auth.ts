import api from "../lib/axios";
import * as SecureStore from "expo-secure-store";

type tokenProps = {
  accessToken: string;
};
export const logOutUser = async (accessToken: string) => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.post(`/user/logout`, { refreshToken: refreshToken });
    console.log(res);
    return res.status;
  } catch (error) {
    console.error("Error in createTodos shit:", error);
    throw error;
  }
};
