import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { token } = useSelector((state) => state.user);

  if (!token) return <Navigate to="/user" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
