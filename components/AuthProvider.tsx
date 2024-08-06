import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "universal-cookie"; // Import universal-cookie

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

const cookies = new Cookies(); // Create an instance of Cookies
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const redirectToDashboard = (role: string, target: string = "user") => {
    if (role === "ADMIN") {
      if (target === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/profile");
      }
    } else {
      router.push("/user/profile");
    }
  };

  useEffect(() => {
    const token = cookies.get("token"); // Get token from cookies
    if (token) {
      const decoded = jwtDecode<{ userId: number; exp: number }>(token);

      // Check if the token has expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        logout(); // If expired, log the user out
      } else {
        axios
          .get(`/api/users/${decoded.userId}`)
          .then((response) => {
            setUser(response.data);
            redirectToDashboard(response.data.role); // Redirect based on role
          })
          .catch(() => logout());
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const token = response.data.token;
      cookies.set("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // Set token in cookies with a 7-day expiry

      const decoded = jwtDecode<{ userId: number }>(token);
      const userResponse = await axios.get(`/api/users/${decoded.userId}`);
      setUser(userResponse.data);
      redirectToDashboard(userResponse.data.role); // Redirect based on role
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    try {
      const response = await axios.post("/api/auth/loginOtp", { phone, otp });
      const token = response.data.token;
      cookies.set("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // Set token in cookies with a 7-day expiry

      const decoded = jwtDecode<{ userId: number }>(token);
      const userResponse = await axios.get(`/api/users/${decoded.userId}`);
      setUser(userResponse.data);
      redirectToDashboard(userResponse.data.role); // Redirect based on role
    } catch (error) {
      console.error("Login with OTP failed:", error);
    }
  };

  const logout = () => {
    cookies.remove("token", {
      path: "/",
      secure: true,
      sameSite: true,
      domain: "localhost",
    });

    setUser(null);
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};