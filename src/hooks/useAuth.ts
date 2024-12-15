import React, {
    useEffect,
    useState,
    createContext,
    useContext,
    ReactNode,
  } from "react";
  import { onAuthStateChanged, User, signOut } from "firebase/auth";
  import { auth } from "../firebase";
  
  // Define the shape of the AuthContext
  interface AuthContextProps {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
  }
  
  // Create the AuthContext
  const AuthContext = createContext<AuthContextProps | undefined>(undefined);
  
  // AuthProvider Component
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    const logout = async () => {
      await signOut(auth);
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, loading, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Custom Hook to Use AuthContext
  export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  