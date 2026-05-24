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
    dispatch(clearMessages());
    setShowDelConfirm(false);
  }

  return (
    <div>
      {showdelConfirm && token && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-md z-50 flex justify-center items-center">
          <div className="bg-white lg:px-30 lg:py-30 md:px-15 md:py-20 px-15 py-10 -translate-4 shadow-2xl rounded-3xl text-center flex flex-col sm:gap-8 gap-4">
            <img
              src="/pfp3.png"
              alt="bird pfp"
              className="lg:h-30 lg:w-30 h-20 w-20 lg:translate-x-16 md:translate-x-16 translate-x-8"
            />
            <div className="font-family">
              <p className="text-2xl text-black/90 ">删除</p>
              <p className="text-xl text-black/60 translate-x-2">
                确定删除历史吗？
              </p>
            </div>

            <div className="flex flex-col md:flex-row  sm:gap-6 gap-4">
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
            onClick?.();
          }}
          className="mt-1 p-1 rounded-xl shadow-sm cursor-pointer hover:bg-gray-100/80 transition-all duration-500 "
        >
          <div>
            <i className="bi bi-chat-dots m-2 p-1 border rounded-full text-sm text-gray-400"></i>
            {children.question}
          </div>
        </li>

        <div className="absolute right-1 top-2">
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
