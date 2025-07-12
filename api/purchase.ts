import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import {
  FormDataProps,
  PurchaseResponseHttp,
  UpdateFormDataProps,
} from "../types";

export const getCurrentPurchase = async (
  accessToken: string,
  userId: string
) => {
  //   const { user, accessToken } = useAuthStore();

  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.get(`/purchase?userID=${userId}`);

    return res.data;
  } catch (error) {
    console.error("Error in createTodo:", error);
    throw error;
  }
};

export const updateSpecificPurchase = async (
  form: UpdateFormDataProps,
  accessToken: string
): Promise<PurchaseResponseHttp> => {
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.put(`/purchase/updatePurchase/${form?.id}`, {
      name: form.name,
      amount: form.amount,
    });

    return res.data;
  } catch (error) {
    console.error("Error in createTodo:", error);
    throw error;
  }
};
