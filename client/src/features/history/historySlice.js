import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteHistory, getHistory } from "../../services/apiHistory";
import { logout } from "../user/userSlice";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getHistoryQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHistoryQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getHistoryQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout, () => initialState)
      .addCase(delHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(delHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.meta.arg;
        state.items = state.items.filter((item) => item.id !== id);
      })
      .addCase(delHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const getHistoryQuestion = createAsyncThunk(
  "history/getHistoryQuestion",
  async ({ token }) => {
    return await getHistory({ token });
  },
);

export const delHistory = createAsyncThunk(
  "history/delHistory",
  async ({ token, id }) => {
    return await deleteHistory({ token, id });
  },
);

export default historySlice.reducer;
