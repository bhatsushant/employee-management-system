import { createContext, useState, useContext, ReactNode } from "react";
import {
  ChevronLast,
  ChevronFirst,
  Gauge,
  CircleUserRound,
  UserRoundCog,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/UserContext";
import { signOutUser } from "@/utils/firebase";

type SidebarContextType = {
  expanded: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default function Navbar() {
  const [expanded, setExpanded] = useState(true);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = async (path: string) => {
    if (path === "logout") {
      await signOutUser();
      setCurrentUser(null);
      navigate("/");
    } else {
      navigate(path);
    }
  };

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-gray-800 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <button
            onClick={() => setExpanded(curr => !curr)}
            className="p-1.5 rounded-lg dark-bg-slate-800 hover:bg-gray-600"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <NavbarItem
              icon={<Gauge size={20} />}
              text="Dashboard"
              onClick={() => handleNavigation("/dashboard")}
            />
            <NavbarItem
              icon={<UserRoundCog size={20} />}
              text="Add Employee"
              onClick={() => handleNavigation("/employee_form")}
            />
            <NavbarItem
              icon={<CircleUserRound size={20} />}
              text="Profile"
              onClick={() => handleNavigation("/employee_form")}
            />
            <NavbarItem
              icon={<LogOut size={20} />}
              text="Logout"
              onClick={() => handleNavigation("logout")}
            />
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3"></div>
      </nav>
    </aside>
  );
}

export function NavbarItem({
  icon,
  text,
  onClick,
  active,
  alert
}: {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  active?: boolean;
  alert?: boolean;
}) {
  const { expanded } = useContext(SidebarContext)!;

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-700 to-indigo-600 text-indigo-100"
            : "hover:bg-indigo-600 text-gray-100"
        }
      `}
      onClick={onClick}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-700 text-indigo-100 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
