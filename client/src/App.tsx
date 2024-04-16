import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { router } from "./routes/router";
import NavBar from "./components/NavBar";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
