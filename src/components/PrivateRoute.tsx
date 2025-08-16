import { useContext, type ReactNode } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export const PrivateRoute = ({children}: Props) => {
    const Auth = useContext(AuthContext);
    return (
        Auth?.userIsAuthenticated ? children : <Navigate to={"/login"} />
    );
};