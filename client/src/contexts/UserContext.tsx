import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const auth = getAuth();

interface UserContextType {
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
