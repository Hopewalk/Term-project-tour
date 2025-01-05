import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", { email, password });
  };
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <form className="login-form">
            <h2>เข้าสู่ระบบ</h2>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <p className="signup-link">
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </form>
        </div>
        <div className="login-right">
          <img src="./Images/loginpic.jpg" />
        </div>
      </div>
    </div>
  );
};

export default Login;
