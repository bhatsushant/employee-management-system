import { EmployeeForm } from "@/pages/EmployeeForm";
import { EmployeeTable } from "@/pages/EmployeeTable";
import Login from "@/pages/Login";
import Navbar from "@/components/Navbar";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { checkAuth } from "@/utils/auth";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function verifyAuthentication() {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    }

    verifyAuthentication();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return localStorage.getItem("verifiedUser") ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
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
      }
    ]
  }
]);

function NavLayout() {
  return (
    <div className="flex gap-x-48">
      <Navbar />
      <Outlet />
    </div>
  );
}
