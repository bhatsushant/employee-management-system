import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { router } from "./routes/router";
import { EmployeeProvider } from "./contexts/EmployeeContext";

function App() {
  return (
    <EmployeeProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </EmployeeProvider>
  );
}

export default App;
