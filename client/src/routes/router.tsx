import { EmployeeTable } from "@/components/EmployeeTable";
import Login from "@/components/Login";
import { Navigate, createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/auth" />
  },
  {
    path: "/auth",
    element: <Login />
  },
  {
    path: "/employee",
    element: <EmployeeTable />
  }
]);
