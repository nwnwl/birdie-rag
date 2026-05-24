import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import fileSlice from './features/file/fileSlice';
import toastSlice from './ui/Toast/toastSlice';
import chatSlice from './features/chat/chatSlice';
import historySlice from './features/history/historySlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    file: fileSlice,
    toast: toastSlice,
    chat: chatSlice,
    history: historySlice,
  },
});
