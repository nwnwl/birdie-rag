import { useDispatch, useSelector } from "react-redux";
import { clearMessages, loadHistory } from "../chat/chatSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { delHistory } from "./historySlice";
import { useState } from "react";
import Error from "../../ui/Error";

function HistoryItem({ children, onClick }) {
  const [showdelConfirm, setShowDelConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.history);

  function handleDelete() {
    dispatch(delHistory({ token, id: children.id }));
    // 更新删除后页面
    dispatch(clearMessages());
    setShowDelConfirm(false);
  }

  return (
    <div>
      {showdelConfirm && token && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
          <div className="flex -translate-4 flex-col gap-4 rounded-3xl bg-white px-15 py-10 text-center shadow-2xl sm:gap-8 md:px-15 md:py-20 lg:px-30 lg:py-30">
            <img
              src="/pfp3.png"
              alt="bird pfp"
              className="h-20 w-20 translate-x-8 md:translate-x-16 lg:h-30 lg:w-30 lg:translate-x-16"
            />
            <div className="font-family">
              <p className="text-2xl text-black/90">删除</p>
              <p className="translate-x-2 text-xl text-black/60">
                确定删除历史吗？
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row">
              <Button type="confirm" onClick={() => handleDelete()}>
                删除
              </Button>
              <Button type="cancel" onClick={() => setShowDelConfirm(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>{error && <Error>{error}</Error>}</div>

      <div className="relative">
        <li
          onClick={() => {
            dispatch(loadHistory(children));
            navigate("/chat");
            // 关闭侧边栏（onSelect）
            onClick?.();
          }}
          className="mt-1 cursor-pointer rounded-xl p-1 shadow-sm transition-all duration-500 hover:bg-gray-100/80"
        >
          <div>
            <i className="bi bi-chat-dots m-2 rounded-full border p-1 text-sm text-gray-400"></i>
            {children.question}
          </div>
        </li>

        <div className="absolute top-2 right-1">
          <Button
            type="history"
            onClick={() => setShowDelConfirm(!showdelConfirm)}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HistoryItem;
