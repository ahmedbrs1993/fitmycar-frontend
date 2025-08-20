import { configureStore, combineReducers } from "@reduxjs/toolkit";
import vehicleReducer from "./vehicleSlice";
import productReducer from "./productSlice";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const rootReducer = combineReducers({
  vehicle: vehicleReducer,
  product: productReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["vehicle", "product"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
