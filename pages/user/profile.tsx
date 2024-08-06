// pages/user/profile.tsx
import React from "react";
import Link from "next/link"; // Import Link from next/link for navigation
import withAuth from "../../middleware/withAuth";
import { useAuth } from "../../components/AuthProvider";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

        <Link href="/admin/dashboard">
          <button style={styles.button}>Go to Admin Dashboard</button>
        </Link>

      <button onClick={logout} style={styles.button}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    marginRight: "10px", // Add margin for spacing between buttons
  },
};

export default withAuth(Profile, ["USER", "ADMIN"]); // Allow both USER and ADMIN roles