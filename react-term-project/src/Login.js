import { useState } from "react";
import axios from "axios";
import "./App.css";

const URL_AUTH = "/api/auth/local";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      setIsLoading(true);
      setErrMsg(null);
      const response = await axios.post(URL_AUTH, data);
      const token = response.data.jwt;
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      props.onLoginSuccess();
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>เข้าสู่ระบบ</h2>
            {errMsg && <p className="error-message">{errMsg}</p>}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="identifier"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="signup-link">
              Don't have an account? <a href="/Register">Sign up</a>
            </p>
          </form>
        </div>
        <div className="login-right">
          <img src="./Images/" alt="ทะเล" />
        </div>
      </div>
    </div>
  );
}
