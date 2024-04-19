import { createContext, useState, useContext, ReactNode } from "react";
import {
  ChevronLast,
  ChevronFirst,
  Gauge,
  UserRoundCog,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/UserContext";
import { signOutUser } from "@/utils/firebase";
import axios from "axios";

type SidebarContextType = {
  expanded: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default function Navbar() {
  const [expanded, setExpanded] = useState(true);
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = async (path: string) => {
    if (path === "logout") {
      await signOutUser();
      await axios
        .post(
          "http://localhost:3000/auth/logout",
          {},
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            }
          }
        )
        .then(() => setCurrentUser(null))
        .catch(error => {
          console.error("Backend logout failed:", error);
        });
      navigate("/");
    } else {
      setCurrentUser(currentUser);
      navigate(path);
    }
  };

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-slate-950 border-r shadow-sm">
        <div
          className={`mt-6 mb-4 flex border-b pb-4 ${
            expanded ? "justify-between" : "justify-end"
          }`}
        >
          {expanded && (
            <div className="ml-7 text-xl font-bold">CyberConvoy</div>
          )}
          <button
            onClick={() => setExpanded(curr => !curr)}
            className="rounded-lg bg-gray-600 hover:bg-indigo-600 right-0 relative -mr-3"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 mb-4">
            <div className="h-1/2">
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
            </div>
            <div className="h-1/2 flex justify-end items-end">
              <NavbarItem
                icon={<LogOut size={20} />}
                text="Logout"
                onClick={() => handleNavigation("logout")}
              />
            </div>
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src={currentUser?.photoURL || currentUser?.image}
            alt=""
            className="w-10 h-10 rounded-md"
            onError={e => {
              e.currentTarget.src =
                "https://avatars.githubusercontent.com/u/97726953";
            }}
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <Link to="/user_profile">
                <h4 className="font-semibold">
                  {currentUser?.displayName ||
                    `${currentUser?.firstName} ${currentUser?.lastName}`}
                </h4>
                <span className="text-xs text-gray-600">
                  {currentUser?.email || currentUser?.email}
                </span>
              </Link>
            </div>
          </div>
        </div>
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
