import { EmployeeForm } from "@/components/EmployeeForm";
import { EmployeeTable } from "@/components/EmployeeTable";
import Login from "@/components/Login";
import NavBar from "@/components/NavBar";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

// export const router = createBrowserRouter([
//   {
//     path: "*",
//     element: <Navigate to="/auth" />
//   },
//   {
//     path: "/",
//     element: <Login />
//   },
//   {
//     path: "/dashboard",
//     element: <EmployeeTable />
//   },
//   {
//     path: "/employee_form",
//     element: <EmployeeForm />
//   }
// ]);

export const router = createBrowserRouter([
  { path: "*", element: <Navigate to="/" /> },
  {
    path: "/",
    element: <Login />
  },
  {
    element: <NavLayout />,
    errorElement: (
      <h1>Shucks! Someone's writing some erroneous code aren't they?</h1>
    ),
    children: [
      {
        path: "/dashboard",
        element: <EmployeeTable />
      },
      {
        path: "/employee_form",
        element: <EmployeeForm />
      }
    ]
  }
]);

function NavLayout() {
  return (
    <div className="flex">
      <NavBar />
      <Outlet />
    </div>
  );
}
