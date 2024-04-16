import { EmployeeForm } from "@/components/EmployeeForm";
import { EmployeeTable } from "@/components/EmployeeTable";
import Login from "@/components/Login";
import NavBar, { NavbarItem } from "@/components/NavBar";
import { Navigate, createBrowserRouter } from "react-router-dom";
import {
  Menu,
  Gauge,
  CircleUserRound,
  UserRoundCog,
  LogOut
} from "lucide-react";

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
    element: (
      <NavBar>
        <NavbarItem icon={<Menu size={20} />} text="Menu" active></NavbarItem>
        <NavbarItem icon={<Gauge size={20} />} text="Dashboard"></NavbarItem>
        <NavbarItem
          icon={<UserRoundCog size={20} />}
          text="Add Employee"
        ></NavbarItem>
        <NavbarItem
          icon={<CircleUserRound size={20} />}
          text="Profile"
        ></NavbarItem>
        <NavbarItem icon={<LogOut size={20} />} text="Logout"></NavbarItem>
      </NavBar>
    )
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
