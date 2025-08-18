import axios from "axios";
import { type Auth } from "../context/AuthContext";

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

interface VerificationParameters {
  id: string;
  code: string;
}

export type UserTransaction = {
  transactionId: number;
  merchantName: string;
  transactionDate: Date;
  amount: number;
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
    console.error("Error authenticating user.", error);
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
    console.error("Error registering user.", error);
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
    console.error("Error getting user.", error);
    if (axios.isAxiosError<APIError, Record<string, string>>(error)) {
      return {error: error.response?.data};
    }
    throw error;
  }
}

const verifyUser = async (parameters: VerificationParameters): Promise<UserResponse> => {
  try {
    const response = await unauthenticated.get("/api/registration/email/verify", {params: parameters});
    return {data: response.data};
  } catch (error) {
    console.error("Error verifying user.", error);
    if (axios.isAxiosError<APIError, Record<string, string>>(error)) {
      return {error: error.response?.data};
    }
    throw error;
  }  
}

const logout = async (request: Auth): Promise<UserResponse> => {
  try {
    const response = await authenticated.post(
    "/api/auth/logout",
    request,
    {  
        headers: {
            "Content-type": "application/json"
        }
    });

    return {data: response.data};
  } catch (error) {
    console.error("Error logging out user.", error);
    if (axios.isAxiosError<APIError, Record<string, string>>(error)) {
      return {error: error.response?.data};
    }
    throw error;
  }  
}

const getUserTransaction = async (year: number, month: number): Promise<UserTransaction[]> => {
  try {
    const response = await authenticated.get("/api/user/mailbox-transaction/" + year + "/" + month);
    return response.data;
  } catch (error) {
    console.error("Error getting user transactions.", error);
    throw error;
  }
}

export const API = {
  authenticate,
  getUser,
  register,
  verifyUser,
  logout,
  getUserTransaction
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
      console.error("Interceptor error", error);
      return Promise.reject(error);
  }
);

authenticated.interceptors.response.use(
  (response) => {
    return response;
  }, 
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";      
    }
    return Promise.reject(error);
  }
);