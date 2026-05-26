import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, useEffect } from "react";

import AppLayout from "./ui/AppLayout.jsx";
import { LazyLoad } from "./utils/LazyLoad.jsx";
import { fetchCurrentUser } from "./features/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./ui/ProtectedRoute.jsx";
import ErrorPage from "./ui/ErrorPage.jsx";

const Home = lazy(() => import("./ui/Home.jsx"));
const Chat = lazy(() => import("./features/chat/Chat.jsx"));
const File = lazy(() => import("./features/file/File.jsx"));
const User = lazy(() => import("./features/user/User.jsx"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <LazyLoad>
            <Home />
          </LazyLoad>
        ),
      },
      {
        path: "/user",
        element: (
          <LazyLoad>
            <User />
          </LazyLoad>
        ),
      },
      { path: "*", element: <ErrorPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/chat",
            element: (
              <LazyLoad>
                <Chat />
              </LazyLoad>
            ),
          },
          {
            path: "/file",
            element: (
              <LazyLoad>
                <File />
              </LazyLoad>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (token !== null && user === null) dispatch(fetchCurrentUser());
  }, [token, user]);

  return <RouterProvider router={router} />;
}

export default App;
