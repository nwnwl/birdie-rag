import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteFile,
  getFiles,
  renameFile,
  uploadFile,
} from "../../services/apiFile";
import { logout } from "../user/userSlice";

const initialState = {
  loading: false,
  files: [],
  error: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(get.pending, (state) => {
        state.loading = true;
      })
      .addCase(get.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action?.payload;
      })
      .addCase(get.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(upload.fulfilled, (state, action) => {
        state.files.unshift(action.payload);
      })
      .addCase(rename.fulfilled, (state, action) => {
        const { id, name } = action.meta.arg;
        const item = state.files.find((f) => f.id === id);
        if (item) item.original_name = name;
      })
      .addCase(del.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        state.files = state.files.filter((f) => f.id !== id);
      })
      .addCase(logout, () => initialState);
  },
});

export const get = createAsyncThunk("file/get", async (token) => {
  return await getFiles(token);
});

export const upload = createAsyncThunk(
  "file/upload",
  async ({ file, token }) => {
    return await uploadFile({ file, token });
  },
);

export const rename = createAsyncThunk(
  "file/rename",
  async ({ id, name, token }) => {
    return await renameFile({ id, name, token });
  },
);

export const del = createAsyncThunk("file/delete", async ({ id, token }) => {
  return await deleteFile({ id, token });
});

export default fileSlice.reducer;
