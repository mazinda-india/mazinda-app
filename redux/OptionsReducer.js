import { createSlice } from "@reduxjs/toolkit";

export const OptionsSlice = createSlice({
  name: "options",
  initialState: {
    searchQuery: "",
    showSearchBar: true,
    allowLocationChange: true,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setShowSearchBar: (state, action) => {
      state.showSearchBar = action.payload;
    },
    setAllowLocationChange: (state, action) => {
      state.allowLocationChange = action.payload;
    },
  },
});

export const { setSearchQuery, setShowSearchBar, setAllowLocationChange } =
  OptionsSlice.actions;

export default OptionsSlice.reducer;
