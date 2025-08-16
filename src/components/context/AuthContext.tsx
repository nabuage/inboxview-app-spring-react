import { ZonedDateTime } from "@js-joda/core";
import { createContext, useState, useEffect, type ReactNode } from "react";

export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface Auth {
    accessToken: string;
    refreshToken: string;
    expireAt: string;
}

interface AuthContextType {
    user: User | null;
    auth: Auth | null;
    getUser: () => User | null;
    userIsAuthenticated: () => boolean;
    userLogin: (user: User) => void;
    userLogout: () => void;
    setUserAuth: (auth: Auth) => void;
    getUserAuth: () => Auth;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [auth, setAuth] = useState<Auth | null>(null);

    useEffect(() => {
        setUser(getUser());
        setAuth(getUserAuth());
    }, []);

    const getUser = (): User | null => {
        return JSON.parse(localStorage.getItem("user") || "null");
    };

    const userIsAuthenticated = (): boolean => {
        const storedAuth = getUserAuth();

        return storedAuth !== null &&
          ZonedDateTime.parse(storedAuth.expireAt).isAfter(ZonedDateTime.now()) &&
          getUser() !== null;
    };

    const userLogin = (user: User): void => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const userLogout = (): void => {
        localStorage.removeItem("user");
        setUser(null);

        localStorage.removeItem("auth");
        setAuth(null);
    };

    const setUserAuth = (auth: Auth) => {
      localStorage.setItem("auth", JSON.stringify(auth));
      setAuth(auth);
    }

    const getUserAuth = (): Auth => {
      return JSON.parse(localStorage.getItem("auth") || "null");
    }

    const contextValue: AuthContextType = {
        user,
        auth,
        getUser,
        userIsAuthenticated,
        userLogin,
        userLogout,
        setUserAuth,
        getUserAuth
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// export const useAuth = (): AuthContextType | undefined => {
//     return useContext(AuthContext);
// };

