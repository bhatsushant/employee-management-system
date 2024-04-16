import { EmployeeForm } from "@/pages/EmployeeForm";
import { EmployeeTable } from "@/pages/EmployeeTable";
import Login from "@/pages/Login";
import Navbar from "@/components/Navbar";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { useAuth } from "@/contexts/UserContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/" />;
};

export const router = createBrowserRouter([
  { path: "*", element: <Navigate to="/" /> },
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
