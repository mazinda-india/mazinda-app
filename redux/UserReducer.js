import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Action
export const fetchUserData = createAsyncThunk("fetchUser", async () => {
  const userToken = await AsyncStorage.getItem("user_token");
  if (!userToken) {
    return;
  }
  const { data } = await axios.post("https://mazinda.com/api/user/fetch-user", {
    userToken,
  });
  return data.user;
});

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    isError: false,
    user_token: null,
    user: {},
  },
  prepare: async () => {
    const user_token = await AsyncStorage.getItem("user_token");
    return { payload: user_token || null };
  },
  reducers: {
    addNewAddress: (state, action) => {
      const { newSavedAddresses } = action.payload;
      state.user.savedAddresses = newSavedAddresses;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      (state.isLoading = false), (state.user = action.payload);
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      (state.isLoading = false), (state.isError = true);
    });
  },
});

export const { addNewAddress } = UserSlice.actions;

export default UserSlice.reducer;
