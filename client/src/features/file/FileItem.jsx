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
      className={`bi bi-filetype-${format} text-3xl text-[#71815b] bg-white rounded-md p-1`}
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
        <div className="absolute bg-white/40   h-full w-full z-50 flex justify-center items-center inset-0 backdrop-blur-md">
          <div className="bg-white lg:px-30 lg:py-30 md:px-15 md:py-20 px-15 py-10 -translate-4 shadow-2xl rounded-3xl text-center flex flex-col sm:gap-8 gap-4">
            <img
              src="/pfp2.png"
              alt="bird pfp"
              className="lg:h-30 lg:w-30 h-20 w-20 lg:translate-x-16 md:translate-x-16 translate-x-8"
            />

            <div className="font-family  ">
              <p className="text-2xl text-black/90">删除</p>
              <p className="text-xl text-black/60 translate-x-2">
                确定删除文档吗？
              </p>
            </div>

            <div className="flex flex-col md:flex-row sm:gap-6 gap-4">
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
        <div className="font-family text-black/60 bg-[#ebefeb] w-fit pr-2 rounded-md underline">
          <i className="bi bi-star-fill px-2 "></i>
          重命名请写出文件后缀名
        </div>
      )}

      <li className="bg-[#ebefeb]  shadow-sm py-4 rounded-2xl font-family text-black/60 sm:text-xl text-sm pl-6 flex justify-between items-center relative">
        {isEditing ? (
          <>
            <div className="flex items-center gap-3">
              {fmt}
              <textarea
                value={name}
                ref={inputRef}
                onChange={(e) => setName(e.target.value)}
                className="bg-white sm:w-80  w-50 h-fit hide-scrollbar py-1 pl-2 rounded-md focus:border-[#71815b] focus:border-2 outline-none"
              />
            </div>

            <div className=" flex gap-4 mr-4 ">
              <Button
                type="changeCancel"
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className="bi bi-x-lg sm:text-[30px] text-[20px] bg-white p-1.25 hover:bg-gray-200 rounded-md hover:transition-all hover:duration-500"></i>
              </Button>
              <Button type="changeConfirm" onClick={() => handleRename()}>
                <i className="bi bi-check-square-fill text-red-300 sm:text-[40px] text-[30px]  hover:text-red-400 hover:transition-all hover:duration-500"></i>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {file.status === "processing" && (
                <i className="bi bi-arrow-repeat animate-spin text-3xl text-[#71815b] ml-70"></i>
              )}
              {file.status === "ready" && (
                <>
                  {fmt}
                  {file.original_name || file.filename}
                </>
              )}
              {file.status === "error" && (
                <>
                  <i className="bi bi-exclamation-triangle-fill  text-3xl rounded-md p-1 text-red-400"></i>
                  <p className="bg-white py-1 px-2  text-red-300 rounded-md">
                    文档处理失败，请删除后重新上传
                  </p>
                </>
              )}
            </div>

            <div className=" flex gap-4 mr-4">
              <Button type="rename" onClick={() => setIsEditing(!isEditing)}>
                <i className="bi bi-pencil-square cursor-pointer"></i>
              </Button>

              <Button type="delete" onClick={() => setDelConfirm(true)}>
                <i className="bi bi-trash2 text-white text-xl cursor-pointer"></i>
              </Button>
            </div>
          </>
        )}
      </li>
    </>
  );
}

export default FileItem;
