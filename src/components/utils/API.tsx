import axios from "axios";
import type { Auth } from "../context/AuthContext";

interface AuthenticationRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirm: string;
}

interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

const authenticate = async (request: AuthenticationRequest): Promise<Auth> => {
    const response = await instance.post<Auth>(
        "/api/auth/login",
        request,
        {  
            headers: {
                "Content-type": "application/json"
            }
        });
    return response.data;
}

const register = async (request: RegisterRequest): Promise<UserResponse> => {
    const response = await instance.post<UserResponse>(
        "/api/registration/register",
        request,
        {  
            headers: {
                "Content-type": "application/json"
            }
        });
    return response.data;
}

const getUser = async (): Promise<UserResponse> => {
    const response = await instance.get<UserResponse>("/api/user/me");
    return response.data;
}

export const API = {
    authenticate,
    getUser,
    register
};

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

instance.interceptors.request.use(
    (config) => {
        const authString = localStorage.getItem("auth");

        if (authString !== null) {
            try {
                const auth: Auth = JSON.parse(authString);console.log(auth);

                if (auth.accessToken) {
                    config.headers.Authorization = `Bearer ${auth.accessToken}`;
                }

            } catch (error) {
                console.log(error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);