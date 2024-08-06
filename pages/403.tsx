// pages/403.tsx
import Link from "next/link";

const Forbidden = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>403 - Forbidden</h1>
      <p style={styles.message}>
        You don't have permission to access this page.
      </p>
      <Link href="/" style={styles.link}>
        Go back to the homepage
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center" as const,
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  link: {
    color: "#0070f3",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Forbidden;