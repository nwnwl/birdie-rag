import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cancelStream, getAnswerStream } from "../../services/apiChat";
import { logout } from "../user/userSlice";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearMessages: () => initialState,
    appendTokenContext(state, action) {
      const last = state.messages[state.messages.length - 1];

      if (last && last.role === "assistant") {
        last.content += action.payload;
      } else {
        state.messages.push({ role: "assistant", content: action.payload });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(answerStream.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        const { question } = action.meta.arg;
        state.messages.push({ role: "user", content: question });
      })
      .addCase(answerStream.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(answerStream.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;

        state.messages = [
          { role: "user", content: action.payload.question },
          { role: "assistant", content: action.payload.answer },
        ];
      })
      .addCase(logout, () => initialState);
  },
});

// 流式输出
export const answerStream = createAsyncThunk(
  "chat/answerStream",
  async ({ question, token }, thunkAPI) => {
    return await getAnswerStream({
      question,
      token,
      onToken: (tokenText) => {
        thunkAPI.dispatch(appendTokenContext(tokenText));
      },
    });
  },
);

export const loadHistory = createAsyncThunk(
  "chat/loadHistory",
  async (history) => {
    cancelStream();
    return history;
  },
);

export const { appendTokenContext, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
