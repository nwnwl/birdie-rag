import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";
import History from "../features/history/History";
import Button from "./Button";
import { logout } from "../features/user/userSlice";

function AppLayout() {
  const [fold, setFold] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const timerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  // 登出
  function handleLogout() {
    navigate("/");
    setShowConfirm(false);
    // ProtectedRoute 在 token 变 null 时重定向到 /user，和 navigate('/') 竞争了，需要delay
    timerRef.current = setTimeout(() => {
      dispatch(logout());
    }, 1000);
  }

  // 组件销毁 或者 依赖变化
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen  relative">
      <nav className=" z-30 bg-[#C6D9A3]/80 flex justify-between">
        <div className="flex">
          {/* group: 让子元素能感知到父元素的 hover 状态 */}
          <div className="group">
            <Button
              onClick={() => {
                setFold(!fold);
              }}
              type="sidebar"
            >
              {/* Bootstrap 图标库 */}
              <i className="bi bi-layout-sidebar "></i>
            </Button>
            {/* invisible + opacity-0 → 看不见 + 点不到 */}
            <span className="fixed top-20 left-1 bg-gray-600/70 text-white rounded-md p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none">
              {fold ? "关闭边栏" : "打开边栏"}
            </span>
          </div>
          <header className=" py-4  pl-4 z-10">
            <Header />
          </header>
        </div>

        <div className="flex gap-4">
          <Button type="chat" onClick={() => navigate("/chat")}>
            Chat
          </Button>
          <Button type="file" onClick={() => navigate("/file")}>
            Files
          </Button>
          <Button
            type="logout"
            onClick={() => {
              if (token) {
                setShowConfirm(true);
              } else {
                navigate("/user");
              }
            }}
          >
            Logout
          </Button>
        </div>
      </nav>

      {showConfirm && token && (
        <div className="absolute bg-white/40 backdrop-blur-md  h-full w-full z-50 flex justify-center items-center inset-0">
          <div className="bg-white lg:px-30 lg:py-30 md:px-15 md:py-20 px-15 py-10 -translate-4 shadow-2xl rounded-3xl text-center flex flex-col sm:gap-8 gap-4">
            <img
              src="/pfp.png"
              alt="bird pfp"
              className="lg:h-30 lg:w-30 h-20 w-20 lg:translate-x-16 md:translate-x-16 translate-x-8"
            />

            <div className="font-family">
              <p className="text-2xl text-black/90 ">退出</p>
              <p className="text-xl text-black/60 translate-x-2">
                确定退出登陆吗？
              </p>
            </div>

            <div className="flex flex-col md:flex-row  sm:gap-6 gap-4">
              <Button type="confirm" onClick={() => handleLogout()}>
                退出
              </Button>
              <Button type="cancel" onClick={() => setShowConfirm(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="h-full w-full bg-[url('/b1.jpg')] bg-cover bg-center bg-no-repeat relative overflow-hidden ">
        <div className="flex flex-1 h-full  flex-row relative ">
          {fold && (
            <div
              className="absolute inset-0 bg-gray-400/60 z-10"
              onClick={() => setFold(false)}
            />
          )}
          <div className="absolute pt-10 z-20 bg-white rounded-r-2xl h-full overflow-y-auto ">
            {fold && <History onSelect={() => setFold(!fold)} />}
          </div>

          <div className="h-screen w-screen ">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
