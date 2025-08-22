import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import {
  DeletePurchaseResponseHttp,
  FormDataProps,
  PurchaseResponseHttp,
  UpdateFormDataProps,
} from "../types";
type UpdatePurchaseInput = {
  form: UpdateFormDataProps;
  accessToken: string;
};
type DeletePurchase = {
  id: string;
  accessToken: string;
};

export const getCurrentPurchase = async (
  accessToken: string,
  userId: string
) => {
  // const { user, accessToken } = useAuthStore();
  console.log(accessToken, "purchase accesstoken");
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.get(`/purchase?userID=${userId}`);

    return res.data;
  } catch (error) {
    console.error("Error in createTodos shitss:", error);
    throw error;
  }
};
export const getPurchases = async (
  accessToken: string,
  fromDate: string,
  endDate: string,
  userID: string
) => {
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.get(`/purchase/search`, {
      params: {
        start_date: fromDate,
        end_date: endDate,
        userID,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error in createTodos shits:", error);
    throw error;
  }
};
export const addPurchase = async ({ name, amount, userID, accessToken }) => {
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.post("/purchase/addPurchase", {
      name,
      amount,
      userID,
    });
    return res.data;
  } catch (error) {
    console.error("Error in createTodoss:", error);
    throw error;
  }
};
export const updateSpecificPurchase = async ({
  form,
  accessToken,
}: UpdatePurchaseInput): Promise<PurchaseResponseHttp> => {
  console.log(form);
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.put(`/purchase/updatePurchase/${form?.id}`, {
      name: form.name,
      amount: form.amount,
    });

    return res.data;
  } catch (error) {
    console.error("Error in createTodoss:", error);
    throw error;
  }
};

export const deleteSpecificPurchase = async ({
  id,
  accessToken,
}: DeletePurchase): Promise<DeletePurchaseResponseHttp> => {
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const res = await api.patch(`/purchase/deletePurchase/${id}`, {
      isDeleted: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error in createTodoss:", error);
    throw error;
  }
};
