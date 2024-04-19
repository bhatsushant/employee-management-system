import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { checkAuth } from "@/utils/auth";

const auth = getAuth();

interface UserContextType {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  loading: true
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await checkAuth();
        response ? setCurrentUser(response) : setCurrentUser(null);
        setLoading(false);
      } catch (error) {
        console.error("Session check failed:", error);
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        checkSession();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
