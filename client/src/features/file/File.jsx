import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { useEffect, useRef, useState } from "react";
import { get, upload } from "./fileSlice";
import FileItem from "./FileItem";
import Toast from "../../ui/Toast/Toast";
import { addToast } from "../../ui/Toast/toastSlice";

function File() {
  const [fileError, setFileError] = useState(null);

  const fileUploadRef = useRef(null);
  const pollRef = useRef(null);

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.user);
  const { files } = useSelector((state) => state.file);

  useEffect(() => {
    dispatch(get(token));
  }, [token]);

  async function handlerefresh() {
    try {
      await dispatch(get(token)).unwrap();
      dispatch(addToast({ type: "success", message: "刷新成功" }));
    } catch (err) {
      dispatch(addToast({ type: "error", message: "刷新失败" }));
      setFileError(err.message);
    }
  }

  // 轮询，上传成功后显示新文件
  async function handleUpload({ file, token }) {
    try {
      await dispatch(upload({ file, token })).unwrap();

      if (pollRef.current) clearInterval(pollRef.current);

      const timer = setInterval(async () => {
        const files = await dispatch(get(token)).unwrap();
        const fileProcessing = files.some((f) => f.status === "processing");

        if (!fileProcessing) {
          return clearInterval(timer);
        }
      }, 2000);

      pollRef.current = timer;
    } catch (err) {
      setFileError(err.message);
    }
  }

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[url('b2.jpg')] bg-cover bg-fixed bg-bottom">
      <div className="flex h-170 w-130 -translate-y-8 flex-col gap-10 rounded-3xl bg-[#eaf4e0] py-8 pr-10 pl-10 sm:w-160 md:h-180 md:w-220 lg:h-200">
        <Toast />

        <div className="border-b-2 border-[#8b8e73] pb-8">
          <h1 className="font-family mb-4 text-3xl tracking-wider text-[#8b8e73] sm:text-4xl">
            ⚙️文档管理
          </h1>
          <p className="font-family text-black/60">
            上传文档进行向量化处理， 支持PDF、TXT、MD、DOCX、DOC格式 (不超过
            20MB)
          </p>
        </div>

        <div className="rounded-2xl bg-[#fbf7f4] py-5 pl-2 shadow-md">
          <h2 className="font-family flex items-center gap-4 pb-4 text-xl text-[#6c6e5c] md:text-2xl">
            <i className="bi bi-upload ml-2"></i>
            上传文档
          </h2>

          <div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              ref={fileUploadRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                handleUpload({ file, token });
                e.target.value = null;
              }}
              className="hidden"
            />
          </div>

          <Button
            type="selectFile"
            onClick={() => fileUploadRef.current.click()}
          >
            <i className="bi bi-cloud-upload mr-2 inline"></i>
            选择文件
          </Button>
        </div>

        <div className="hide-scrollbar h-94 overflow-y-auto rounded-2xl bg-[#fbf7f4] py-5 pr-10 pl-2 shadow-md">
          <h2 className="font-family flex items-center gap-4 pb-4 text-xl text-[#6c6e5c] md:text-2xl">
            <i className="bi bi-list-ul ml-2"></i>
            已上传文档
          </h2>

          <Button type="refresh" onClick={() => handlerefresh()}>
            <i className="bi bi-arrow-repeat mr-2 inline"></i>
            刷新列表
          </Button>

          <ul className="mt-4 flex flex-col gap-4 pl-4">
            {files?.map((f) => (
              <FileItem file={f} key={f.id} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default File;
