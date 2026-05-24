import { useDispatch, useSelector } from "react-redux";
import HistoryItem from "./HistoryItem";
import { useEffect } from "react";
import { getHistoryQuestion } from "./historySlice";

function History({ onSelect }) {
  const { token } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.history);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;
    dispatch(getHistoryQuestion({ token }));
  }, [token]);

  return (
    <ul className="w-80 flex flex-col gap-3 rounded-r-2xl overflow-y-auto  text-gray-900 ">
      {items.length === 0 && (
        <div className="flex flex-col text-center font-family ">
          <p className="-translate-x-1 text-xl text-black/70">
            没有聊天历史记录
          </p>
          <span className="text-black/60">
            与Birdie开始新的对话,以便在这里查看
          </span>
        </div>
      )}

      {items.map((msg) => (
        <HistoryItem key={msg.id} onClick={onSelect}>
          {msg}
        </HistoryItem>
      ))}
    </ul>
  );
}

export default History;
