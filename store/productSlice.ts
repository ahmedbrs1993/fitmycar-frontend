import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../types/products";

interface ProductState {
  product: ProductType | null;
  subProduct: string | null;
}

const initialState: ProductState = {
  product: null,
  subProduct: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<ProductType>) => {
      state.product = action.payload;
      state.subProduct = null;
    },
    setSubProduct: (state, action: PayloadAction<string>) => {
      state.subProduct = action.payload;
    },
    clearProduct: (state) => {
      state.product = null;
      state.subProduct = null;
    },
  },
});

export const { setProduct, setSubProduct, clearProduct } = productSlice.actions;

export default productSlice.reducer;
