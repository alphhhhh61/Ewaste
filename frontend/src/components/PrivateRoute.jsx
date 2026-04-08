import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  if (!userInfo) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Admins should not access user routes — send them to admin dashboard
  if (userInfo.role === 'admin' || userInfo.role === 'Admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
