import { EmployeeForm } from "@/pages/EmployeeForm";
import { EmployeeTable } from "@/pages/EmployeeTable";
import Login from "@/pages/Login";
import Navbar from "@/components/Navbar";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
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
