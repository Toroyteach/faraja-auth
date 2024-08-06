// middleware/withAuth.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/router";
import Cookies from "universal-cookie"; // Import universal-cookie
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure correct import here

const cookies = new Cookies();

const withAuth = (Component: React.ComponentType, allowedRoles: string[]) => {
  return () => {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // State to handle loading state

    useEffect(() => {
      const checkAuth = async () => {
        const token = cookies.get("token");
        if (token) {
          try {
            const decoded = jwtDecode<{ userId: number; exp: number }>(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
              // Token has expired
              cookies.remove("token");
              router.push("/auth/signin");
            } else {
              // Validate the token with the server
              const response = await axios.get(`/api/users/${decoded.userId}`);
              if (response.data && allowedRoles.includes(response.data.role)) {
                // Set user data if validation is successful
                setLoading(false);
              } else {
                // Redirect if the role is not allowed
                router.back();
              }
            }
          } catch (error) {
            cookies.remove("token");
            router.push("/auth/signin");
          }
        } else {
          // No token, redirect to sign-in
          router.push("/auth/signin");
        }
      };

      checkAuth();
    }, [router, allowedRoles]);

    if (loading) {
      return <div>Loading...</div>; // Optional loading spinner or message
    }

    return <Component />;
  };
};

export default withAuth;