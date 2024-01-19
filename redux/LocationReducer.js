import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action
export const fetchLocationByCity = createAsyncThunk(
  "fetchLocation",
  async (city) => {
    const { data } = await axios.post(
      "https://mazinda.com/api/location/fetch-location-by-city",
      {
        city,
      }
    );
    if (data.success) {
      return data.location;
    } else return null;
  }
);

export const LocationSlice = createSlice({
  name: "location",
  initialState: {
    isLoading: false,
    isError: false,
    location: {},
    serviceable: true,
  },
  reducers: {
    updateLocation: (state, action) => {
      state.location = action.payload;
      state.serviceable = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocationByCity.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLocationByCity.fulfilled, (state, action) => {
      if (!action.payload) {
        state.serviceable = false;
      }
      (state.isLoading = false), (state.location = action.payload);
    });
    builder.addCase(fetchLocationByCity.rejected, (state, action) => {
      (state.isLoading = false), (state.isError = true);
    });
  },
});

export const { updateLocation } = LocationSlice.actions;

export default LocationSlice.reducer;
