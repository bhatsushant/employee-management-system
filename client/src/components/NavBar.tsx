import { createContext, useState, useContext, ReactNode } from "react";
import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  Menu,
  Gauge,
  CircleUserRound,
  UserRoundCog,
  LogOut
} from "lucide-react";

type SidebarContextType = {
  expanded: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default function NavBar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen w-1/5">
      <nav className="h-full flex flex-col bg-gray-800 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded(curr => !curr)}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <NavbarItem
              icon={<Menu size={20} />}
              text="Menu"
              active
            ></NavbarItem>
            <NavbarItem
              icon={<Gauge size={20} />}
              text="Dashboard"
            ></NavbarItem>
            <NavbarItem
              icon={<UserRoundCog size={20} />}
              text="Add Employee"
            ></NavbarItem>
            <NavbarItem
              icon={<CircleUserRound size={20} />}
              text="Profile"
            ></NavbarItem>
            <NavbarItem icon={<LogOut size={20} />} text="Logout"></NavbarItem>
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-gray-100">John Doe</h4>
              <span className="text-xs text-gray-400">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function NavbarItem({
  icon,
  text,
  active,
  alert
}: {
  icon: ReactNode;
  text: string;
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
