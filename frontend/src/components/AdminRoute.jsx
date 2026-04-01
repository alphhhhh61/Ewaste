import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userInfoStr = localStorage.getItem('userInfo');

  if (!userInfoStr) {
    return <Navigate to="/admin-login" replace />;
  }

  let userInfo;
  try {
    userInfo = JSON.parse(userInfoStr);
  } catch {
    return <Navigate to="/admin-login" replace />;
  }

  if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'Admin' || userInfo.isAdmin)) {
    return children;
  }
  
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
