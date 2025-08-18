import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Props {
    children: ReactNode;
}

export const PrivateRoute = ({children}: Props) => {
    const Auth = useContext(AuthContext);
    return (
        Auth?.userIsAuthenticated ? children : <Navigate to={"/login"} />
    );
};