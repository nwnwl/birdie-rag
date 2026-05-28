import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { useEffect, useRef, useState } from "react";

import { del, rename } from "./fileSlice";
import { addToast } from "../../ui/Toast/toastSlice";

function FileItem({ file }) {
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(file?.original_name);
  const [delConfirm, setDelConfirm] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const inputRef = useRef(null);

  const format = file.filename?.slice(file.filename.lastIndexOf(".") + 1);

  let fmt = (
    <i
      className={`bi bi-filetype-${format} rounded-md bg-white p-1 text-3xl text-[#71815b]`}
      aria-hidden="true"
    ></i>
  );

  async function handleDelete() {
    try {
      await dispatch(del({ id: file.id, token })).unwrap();
      dispatch(addToast({ type: "success", message: "删除成功" }));
    } catch (err) {
      dispatch(addToast({ type: "error", message: "删除失败" }));
      setError(err.message);
    }
  }

  async function handleRename() {
    try {
      await dispatch(rename({ id: file.id, name, token })).unwrap();
      dispatch(addToast({ type: "success", message: "改名成功" }));
      setIsEditing(false);
    } catch (err) {
      dispatch(addToast({ type: "error", message: "改名失败" }));
      setError(err.message);
    }
  }

  // 编辑模式光标末尾自动出现
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.focus();

    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [isEditing]);

  return (
    <>
      {delConfirm && (
        <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-white/40 backdrop-blur-md">
          <div className="flex -translate-4 flex-col gap-4 rounded-3xl bg-white px-15 py-10 text-center shadow-2xl sm:gap-8 md:px-15 md:py-20 lg:px-30 lg:py-30">
            <img
              src="/pfp2.png"
              alt="bird pfp"
              className="h-20 w-20 translate-x-8 md:translate-x-16 lg:h-30 lg:w-30 lg:translate-x-16"
            />

            <div className="font-family">
              <p className="text-2xl text-black/90">删除</p>
              <p className="translate-x-2 text-xl text-black/60">
                确定删除文档吗？
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row">
              <Button type="confirm" onClick={() => handleDelete()}>
                删除
              </Button>
              <Button type="cancel" onClick={() => setDelConfirm(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="font-family w-fit rounded-md bg-[#ebefeb] pr-2 text-black/60 underline">
          <i className="bi bi-star-fill px-2"></i>
          重命名请写出文件后缀名
        </div>
      )}

      <li className="font-family relative flex items-center justify-between rounded-2xl bg-[#ebefeb] py-4 pl-6 text-sm text-black/60 shadow-sm sm:text-xl">
        {isEditing ? (
          <>
            <div className="flex items-center gap-3">
              {fmt}
              <textarea
                value={name}
                ref={inputRef}
                onChange={(e) => setName(e.target.value)}
                className="hide-scrollbar h-fit w-50 rounded-md bg-white py-1 pl-2 outline-none focus:border-2 focus:border-[#71815b] sm:w-70 md:w-90 lg:w-100"
              />
            </div>

            <div className="mr-4 flex gap-4">
              <Button
                type="changeCancel"
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className="bi bi-x-lg rounded-md p-1.25 text-[20px] sm:text-[30px]"></i>
              </Button>
              <Button type="changeConfirm" onClick={() => handleRename()}>
                <i className="bi bi-check-square-fill text-[30px] sm:text-[40px]"></i>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {file.status === "processing" && (
                <i className="bi bi-arrow-repeat ml-70 -translate-x-35 animate-spin text-3xl text-[#71815b] sm:-translate-x-20 md:translate-0"></i>
              )}
              {file.status === "ready" && (
                <>
                  {fmt}
                  {file.original_name || file.filename}
                </>
              )}
              {file.status === "error" && (
                <>
                  <i className="bi bi-exclamation-triangle-fill rounded-md p-1 text-3xl text-red-400"></i>
                  <p className="rounded-md bg-white px-2 py-1 text-red-300">
                    文档处理失败，请删除后重新上传
                  </p>
                </>
              )}
            </div>

            <div className="mr-4 flex gap-4">
              {file.status === "ready" && (
                <Button type="rename" onClick={() => setIsEditing(!isEditing)}>
                  <i className="bi bi-pencil-square cursor-pointer"></i>
                </Button>
              )}

              <Button type="delete" onClick={() => setDelConfirm(true)}>
                <i className="bi bi-trash2 cursor-pointer text-xl text-white"></i>
              </Button>
            </div>
          </>
        )}
      </li>
    </>
  );
}

export default FileItem;
