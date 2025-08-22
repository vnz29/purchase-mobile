import z from "zod";
import {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormReset,
} from "react-hook-form";
// PurchaseType
export type PurchasedItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};

export type TPurchase = {
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
  item: TPurchase[];
  message: string;
};
export type FormDataProps = {
  name: string;
  amount: string;
  id?: string; // use string for input fields, even if number later
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

export type CustomBottomSheetDatePickerProps = {
  snapPoints: string[];
  handleUpdate: (date: Date, type: string) => void;
  fromDate: string;
  toDate: string;
  isLoading: boolean;
  handleClick: () => void;
  headerText: string;
  onClosePress: () => void;
};

export type CustomBottomSheetProps = {
  snapPoints: string[];
  onChange?: (index: number) => void;
  onClosePress: () => void;
  item?: PurchasedItem | null; // Add
  inputChange: (key: keyof FormDataProps, value: string) => void;
  form: FormDataProps;
  isLoading: boolean;
  onSubmit: () => void;
  headerText: string;
};

export type LoginHttpResponse = {
  accessToken: string;
  id: string;
  message: string;
  refreshToken: string;
  username: string;
};

export const PurchaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required"),
  id: z.string().min(1).optional(),
});

export type PurchaseFormData = z.infer<typeof PurchaseSchema>;

export type CustomBottomSheetPropss = {
  snapPoints: string[];
  onChange?: (index: number) => void;
  onClosePress: () => void;
  item?: PurchasedItem | null; // Add

  isLoading: boolean;

  headerText: string;
  control: Control<PurchaseFormData>;

  errors: FieldErrors<PurchaseFormData>;
  reset: UseFormReset<PurchaseFormData>;

  handleSubmit: UseFormHandleSubmit<PurchaseFormData>;
  onSubmit: (data: PurchaseFormData) => void;
};
