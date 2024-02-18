import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action
export const fetchStoriesData = createAsyncThunk(
  "fetchStories",
  async (city) => {
    const { data } = await axios.post(
      "https://mazinda.com/api/story/fetch-location-stories",
      {
        city,
      }
    );
    return data.stories;
  }
);

export const StorySlice = createSlice({
  name: "stories",
  initialState: {
    isLoading: false,
    isError: false,
    stories: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStoriesData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStoriesData.fulfilled, (state, action) => {
      (state.isLoading = false), (state.stories = action.payload);
    });
    builder.addCase(fetchStoriesData.rejected, (state, action) => {
      (state.isLoading = false), (state.isError = true);
    });
  },
});

// export const { addNewAddress } = StorySlice.actions;

export default StorySlice.reducer;
