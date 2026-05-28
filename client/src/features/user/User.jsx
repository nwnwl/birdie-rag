import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "../../ui/Button";
import { login, register } from "../user/userSlice";
import Error from "../../ui/Error";

function User() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setShowError(false);

    try {
      if (isLogin) {
        await dispatch(login({ username, password })).unwrap();
        navigate("/chat");
      } else {
        await dispatch(register({ username, password })).unwrap();
        handdleLoginStatus();
      }
    } catch (err) {
      setError(err.message);
      setShowError(true);
    }
  }

  const handdleLoginStatus = function () {
    setIsLogin(!isLogin);
    setError("");
    setUsername("");
    setPassword("");
  };

  return (
    <form
      className="flex h-screen w-screen items-start justify-center bg-[url('/b2.jpg')] bg-cover bg-fixed bg-bottom"
      onSubmit={handleSubmit}
    >
      <div
        className={`mt-30 flex rounded-3xl bg-[#eaf4e0]/90 shadow-2xl md:h-125 lg:mr-15 lg:h-130 ${isLogin ? "md:pr-5 md:pl-60 lg:pl-70 " : "md:-translate-x-5 md:pr-30"} relative px-10 py-0 transition-all duration-500 ease-in-out sm:px-15`}
      >
        <div
          className={`hidden md:block ${isLogin ? "rounded-r-full md:-left-1 md:pr-25 md:pl-50 lg:-left-10 lg:pr-30 lg:pl-60" : "left-112 translate-x-5 rounded-l-full md:pr-30 md:pl-50 lg:pr-30 lg:pl-60"} absolute top-0 h-full overflow-hidden bg-[#C8E6C9] py-15 transition-all duration-500`}
        >
          <img
            src="/b5.png"
            alt="bird picture"
            className={`absolute -left-3 object-cover p-8 transition-all duration-500 ease-in-out md:h-100 md:w-70 md:-translate-y-5 lg:h-125 lg:w-90 lg:-translate-y-10`}
            style={{ transform: `translateX(${isLogin ? 0 : -360}px)` }}
          />
          <img
            src="/b4.png"
            alt="bird picture"
            className={`absolute left-5 object-cover p-8 transition-all duration-500 ease-in-out md:h-100 md:w-70 md:-translate-y-2 lg:h-125 lg:w-90 lg:-translate-y-10`}
            style={{ transform: `translateX(${isLogin ? 360 : 0}px)` }}
          />
        </div>

        <div
          className={`flex h-full flex-col ${isLogin ? "md:px-30 md:py-8 lg:py-10 lg:pl-40" : "md:py-8 md:pr-60 md:pl-18 lg:py-10"} rounded-r-3xl pt-10 pb-12 md:px-15`}
        >
          <h1 className="font-cause p-6 text-center text-5xl text-amber-900">
            {isLogin ? "Login" : "Register"}
          </h1>

          <div className="flex flex-col">
            <label htmlFor="username" className="font-cause m-1 text-amber-900">
              username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-cause rounded-2xl border border-amber-900 bg-white px-8 py-2 outline-none focus:border-2 focus:border-[#5C3D2E]/80"
            />

            <label htmlFor="password" className="font-cause m-1 text-amber-900">
              password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-cause rounded-2xl border border-amber-900 bg-white px-8 py-2 outline-none focus:border-2 focus:border-[#5C3D2E]/80"
            />
          </div>

          {showError && <Error>{error}</Error>}
          <Button type="start">{isLogin ? "Sign in" : "Sign up"}</Button>

          <p className="font-cause m-6 overflow-hidden text-ellipsis whitespace-nowrap text-amber-900">
            <span>{isLogin ? "No account yet," : "have an account?"}</span>
            <Button onClick={() => handdleLoginStatus()} type="sign">
              {isLogin ? "Sign up!" : "Sign in!"}
            </Button>
          </p>
        </div>
      </div>
    </form>
  );
}

export default User;
