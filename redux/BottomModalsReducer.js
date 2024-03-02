import { createSlice } from "@reduxjs/toolkit";

export const BottomSheetModalSlice = createSlice({
  name: "BottomSheetModal",
  initialState: {
    showAuthModal: false,
  },
  reducers: {
    setAuthModal: (state, action) => {
      state.showAuthModal = action.payload;
    },
  },
});

export const { setAuthModal } = BottomSheetModalSlice.actions;

export default BottomSheetModalSlice.reducer;
