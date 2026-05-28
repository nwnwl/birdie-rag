import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { userRegister, userLogin, fetchData } from "../../services/apiUser";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

const handleFulfilled = (state, action) => {
  state.loading = false;
  state.token = action.payload.token;
  state.error = null;
  state.user = {
    id: action.payload.userId,
    username: action.payload.username,
  };
  localStorage.setItem("token", action.payload.token);
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, handleFulfilled)
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
        };
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export const register = createAsyncThunk(
  "user/register",
  async ({ username, password }) => {
    return await userRegister({ username, password });
  },
);

export const login = createAsyncThunk(
  "user/login",
  async ({ username, password }) => {
    return await userLogin({ username, password });
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;

    return await fetchData(token);
  },
);

export default userSlice.reducer;
