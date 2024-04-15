import { EmployeeForm } from "@/components/EmployeeForm";
import { EmployeeTable } from "@/components/EmployeeTable";
import Login from "@/components/Login";
import { NavBar } from "@/components/NavBar";
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
    path: "/navigation",
    element: <NavBar />
  },
  {
    path: "/dashboard",
    element: <EmployeeTable />
  },
  {
    path: "/employee_form",
    element: <EmployeeForm />
  }
]);
