import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from '../../ui/Button';
import { login, register } from '../user/userSlice';
import Error from '../../ui/Error';

function User() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setShowError(false);

    try {
      if (isLogin) {
        await dispatch(login({ username, password })).unwrap();
        navigate('/chat');
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
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <form
      className="h-screen w-screen flex  bg-[url('/b2.jpg')]  bg-cover bg-bottom bg-fixed  justify-center items-start"
      onSubmit={handleSubmit}
    >
      <div
        className={`lg:h-130 md:h-125 mt-30 lg:mr-15  flex rounded-3xl bg-[#eaf4e0]/90 shadow-2xl ${isLogin ? 'lg:pl-70 md:pl-60 md:pr-5 ' : 'md:-translate-x-5  md:pr-30'}  sm:px-15 py-0 px-10 relative transition-all duration-500 ease-in-out`}
      >
        <div
          className={`hidden md:block ${isLogin ? 'lg:pl-60 lg:pr-30  md:pl-50 md:pr-25 rounded-r-full ' : 'rounded-l-full translate-x-5 lg:pl-60 lg:pr-30 md:pl-50 md:pr-30 '} py-15 bg-[#C8E6C9] absolute h-full top-0 lg:-left-10  md:-left-1 transition-all duration-500  overflow-hidden `}
          style={{ left: !isLogin && '28rem' }}
        >
          <img
            src="/b5.png"
            alt="bird picture"
            className={`lg:w-90 lg:h-125 md:w-70 md:h-100 object-cover absolute p-8 -left-1 lg:-translate-y-10 md:-translate-y-5 transition-all duration-500 ease-in-out `}
            style={{ transform: `translateX(${isLogin ? 0 : -360}px)` }}
          />
          <img
            src="/b4.png"
            alt="bird picture"
            className={`lg:w-90 lg:h-125 md:w-70 md:h-100 object-cover absolute p-8 left-5 lg:-translate-y-15 md:-translate-y-2  transition-all duration-500 ease-in-out `}
            style={{ transform: `translateX(${isLogin ? 360 : 0}px)` }}
          />
        </div>

        <div
          className={`flex flex-col h-full ${isLogin ? 'lg:pl-40 md:px-30 lg:py-10 md:py-8' : 'lg:py-10 md:pl-18 md:pr-60 md:py-8'} md:px-15 pt-10 pb-12 rounded-r-3xl  `}
        >
          <h1 className="text-center font-cause text-5xl text-amber-900 p-6">
            {isLogin ? 'Login' : 'Register'}
          </h1>

          <div className="flex flex-col ">
            <label htmlFor="username" className="m-1 font-cause text-amber-900">
              username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-2xl border py-2 px-8 bg-white font-cause border-amber-900 focus:border-[#5C3D2E]/80 focus:border-2 outline-none"
            />

            <label htmlFor="password " className="m-1 font-cause text-amber-900">
              password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border py-2 px-8 bg-white font-cause border-amber-900  focus:border-[#5C3D2E]/80 focus:border-2 outline-none"
            />
          </div>

          <Error>{showError ? error : ''}</Error>
          <Button type="start">{isLogin ? 'Sign in' : 'Sign up'}</Button>

          <p className="font-cause text-amber-900 m-6 whitespace-nowrap overflow-hidden text-ellipsis">
            <span>{isLogin ? 'No account yet,' : 'have an account?'}</span>
            <Button onClick={() => handdleLoginStatus()} type="sign">
              {isLogin ? 'Sign up!' : 'Sign in!'}
            </Button>
          </p>
        </div>
      </div>
    </form>
  );
}

export default User;
