// pages/auth/signin.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../../components/AuthProvider";

const OTP_VALIDITY_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const { login, loginWithOtp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (otpExpiry && Date.now() > otpExpiry) {
      setOtpSent(false);
      setMessage("OTP has expired. Please request a new one.");
    }
  }, [otpExpiry]);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/user/profile");
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("/api/auth/sendOtp", { phone });
      setMessage(response.data.message);
      setOtpSent(true);
      setOtpExpiry(Date.now() + OTP_VALIDITY_TIME); // Set OTP expiry time
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginWithOtp(phone, otp);
      router.push("/user/profile");
    } catch (err) {
      setError("Failed to log in with OTP. Please try again.");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleEmailLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>

      <h2>Or Sign In with Phone</h2>
      <form onSubmit={handleOtpLogin}>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        {otpSent && (
          <>
            <div>
              <label>OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              {otpExpiry && (
                <p>
                  OTP valid until: {new Date(otpExpiry).toLocaleTimeString()}
                </p>
              )}
            </div>
          </>
        )}
        {otpSent ? (
          <button type="submit">Verify OTP</button>
        ) : (
          <button type="button" onClick={handleSendOtp}>
            Send OTP
          </button>
        )}
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account? <a href="/auth/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;