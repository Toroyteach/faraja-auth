// pages/admin/dashboard.tsx
import React from "react";
import withAuth from "../../middleware/withAuth";
import { useAuth } from "../../components/AuthProvider";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  logoutButton: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#ff4b4b",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default withAuth(AdminDashboard, ["ADMIN"]);