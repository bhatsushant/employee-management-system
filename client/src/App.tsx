import "./App.css";
import Login from "./components/Login";
import { ModeToggle } from "./components/ModeToggle";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <Login />
    </ThemeProvider>
  );
}

export default App;
