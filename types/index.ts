// PurchaseType
export type PurchasedItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};

export type ItemList = {
  __v: number;
  _id: string;
  amount: number;
  createdAt: string; // ISO date string
  isDeleted: boolean;
  name: string;
  updatedAt: string; // ISO date string
  userId: string;
};

export type PurchaseResponseHttp = {
  item: ItemList[];
  message: string;
};
export type FormDataProps = {
  name: string;
  amount: string; // use string for input fields, even if number later
};
export type FormData = {
  id?: string;
  name: string;
  amount: string; // use string for input fields, even if number later
};

export type UpdateFormDataProps = FormDataProps & {
  id?: string;
};
export type UpdatePurchaseInput = {
  form: UpdateFormDataProps;
  accessToken: string;
};

export type DeletePurchaseResponseHttp = {
  message: string;
};

export type DeletePurchase = {
  id: string;
  accessToken: string;
};
