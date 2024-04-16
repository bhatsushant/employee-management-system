import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from "react";
import { onAuthStateChangedListener } from "../utils/firebase";

interface UserContextType {
  currentUser: any;
  setCurrentUser: Dispatch<SetStateAction<any>>;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {} // Adjusted to an empty function
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const value: UserContextType = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
