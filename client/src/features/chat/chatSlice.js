import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAnswerStream } from "../../services/apiChat";
import { logout } from "../user/userSlice";

const initialState = {
  messages: [],
  loading: false,
  error: null,
  sources: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadHistory(state, action) {
      state.messages = [
        { role: "user", content: action.payload.question },
        { role: "assistant", content: action.payload.answer },
      ];
    },
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
        state.loading = false;
        state.error = action.error.message;
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
      onDone: () => {},
    });
  },
);

export const { loadHistory, appendTokenContext, clearMessages } =
  chatSlice.actions;

export default chatSlice.reducer;
