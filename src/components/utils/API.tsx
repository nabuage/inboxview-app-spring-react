import axios from "axios";
import type { Auth } from "../context/AuthContext";

interface APIError {
  id: string;
  timestamp: string;
  error: string;
  statusCode: number;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  data?: Auth;
  error?: APIError;
}

interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserResponse {
  data?: User;
  error?: APIError;
}

const authenticate = async (request: AuthRequest): Promise<AuthResponse> => {
  try {
    const response = await unauthenticated.post(
        "/api/auth/login",
        request,
        {  
            headers: {
                "Content-type": "application/json"
            }
        });
    return {data: response.data};
  } catch (error) {
    if (axios.isAxiosError<APIError, Record<string, string>>(error)) {
      return {error: error.response?.data};
    }
    throw error;
  }
    
}

const register = async (request: RegisterRequest): Promise<UserResponse> => {
  try {
    const response = await unauthenticated.post(
    "/api/registration/register",
    request,
    {  
        headers: {
            "Content-type": "application/json"
        }
    });

    return {data: response.data};
  } catch (error) {
    if (axios.isAxiosError<APIError, Record<string, string>>(error)) {
      return {error: error.response?.data};
    }
    throw error;
  }  
}

const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await authenticated.get("/api/user/me");
    return {data: response.data};
  } catch (error) {
    if (axios.isAxiosError<APIError, Record<string, string>>(error)) {
      return {error: error.response?.data};
    }
    throw error;
  }
  
}

export const API = {
  authenticate,
  getUser,
  register
};

const unauthenticated = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

const authenticated = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

authenticated.interceptors.request.use(
  (config) => {
    const authString = localStorage.getItem("auth");

    if (authString !== null) {
      try {
        const auth: Auth = JSON.parse(authString);

        if (auth.accessToken) {
            config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }

      } catch (error) {
        console.error("Error setting authorization.", error);
      }
    }
    return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);