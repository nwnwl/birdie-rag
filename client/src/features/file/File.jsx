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

  async function handleUpload({ file, token }) {
    try {
      await dispatch(upload({ file, token })).unwrap();

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
    <div className="h-screen w-screen bg-[url('b2.jpg')] bg-cover bg-fixed bg-bottom flex justify-center items-center">
      <div className="bg-[#eaf4e0] flex flex-col md:w-220  sm:w-160 w-130 -translate-y-8 rounded-3xl gap-10 lg:h-200 md:h-180 h-170 pl-10 pr-10 py-8">
        <Toast />

        <div className="border-b-2 border-[#8b8e73] pb-8  ">
          <h1 className="sm:text-4xl text-3xl font-family text-[#8b8e73] mb-4 tracking-wider">
            ⚙️文档管理
          </h1>
          <p className="font-family text-black/60">
            上传文档进行向量化处理， 支持PDF、TXT、MD、DOCX、DOC格式 (不超过
            20MB)
          </p>
        </div>

        <div className="bg-[#fbf7f4] rounded-2xl py-5 pl-2  shadow-md">
          <h2 className="font-family md:text-2xl text-xl  text-[#6c6e5c] flex gap-4  items-center pb-4">
            <i className="ml-2 bi bi-upload"></i>
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
            <i className="bi bi-cloud-upload inline mr-2"></i>
            选择文件
          </Button>
        </div>

        <div className="bg-[#fbf7f4] rounded-2xl pr-10 py-5 pl-2  shadow-md h-94 overflow-y-auto hide-scrollbar">
          <h2 className="font-family md:text-2xl text-xl text-[#6c6e5c] flex gap-4 items-center pb-4">
            <i class="ml-2 bi bi-list-ul"></i>
            已上传文档
          </h2>

          <Button type="refresh" onClick={() => handlerefresh()}>
            <i class="bi bi-arrow-repeat inline mr-2"></i>
            刷新列表
          </Button>

          <ul className="flex flex-col pl-4 gap-4 mt-4   ">
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
