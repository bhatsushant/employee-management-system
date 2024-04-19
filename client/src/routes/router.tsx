import { EmployeeForm } from "@/pages/EmployeeForm";
import { EmployeeTable } from "@/pages/EmployeeTable";
import Login from "@/pages/Login";
import Navbar from "@/components/Navbar";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { checkAuth } from "@/utils/auth";
import { useEffect, useState } from "react";
import UserProfile from "@/pages/UserProfile";
import { useAuth } from "@/contexts/UserContext";
import EmployeeDetails from "@/pages/EmployeeDetails";
import ClipLoader from "react-spinners/ClipLoader";

const useNativeAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      const userData = await checkAuth();
      setUser(userData);
      setLoading(false);
    };

    authenticate();
  }, []);

  return { user, loading };
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();
  const { user } = useNativeAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <ClipLoader color="#4A90E2" size={150} />
      </div>
    );
  return currentUser || user ? children : <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  { path: "*", element: <Navigate to="/" replace /> },
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: <NavLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <EmployeeTable />
          </ProtectedRoute>
        )
      },
      {
        path: "employee_form",
        element: (
          <ProtectedRoute>
            <EmployeeForm />
          </ProtectedRoute>
        )
      },
      {
        path: "user_profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "employee",
        element: (
          <ProtectedRoute>
            <EmployeeDetails />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

function NavLayout() {
  return (
    <div className="flex">
      <Navbar />
      <Outlet />
    </div>
  );
}
