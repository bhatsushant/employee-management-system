import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from "react";
import { onAuthStateChangedListener } from "../utils/firebase";

interface UserContextType {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: false
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: Boolean(currentUser)
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
