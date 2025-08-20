import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehicleState } from "../types/vehicle";

const initialState: VehicleState = {
  brand: null,
  model: null,
  generation: null,
  fuelType: null,
  fuelTypeId: null,
};

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setVehicleConfig: (
      state,
      action: PayloadAction<{
        brand: string;
        model: string;
        generation: string;
        fuelType: string;
        fuelTypeId: number;
      }>
    ) => {
      state.brand = action.payload.brand;
      state.model = action.payload.model;
      state.generation = action.payload.generation;
      state.fuelType = action.payload.fuelType;
      state.fuelTypeId = action.payload.fuelTypeId;
    },
    clearVehicleConfig: (state) => {
      state.brand = null;
      state.model = null;
      state.generation = null;
      state.fuelType = null;
      state.fuelTypeId = null;
    },
  },
});

export const { setVehicleConfig, clearVehicleConfig } = vehicleSlice.actions;

export default vehicleSlice.reducer;
