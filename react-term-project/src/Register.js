import React, { useState } from "react";
import "./Login.css";

const Register = () => {
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
            <h2>สมัครเพื่อเข้าสู่ระบบ</h2>
            <div className="form-group">
              <label htmlFor="firstname">First name</label>
              <input
                type="firstname"
                id="firstname"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last name</label>
              <input
                type="lastname"
                id="lastname"
                placeholder="Enter your last name"
                required
              />
            </div>
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
            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>
        </div>
        <div className="login-right">
          <img src="./Images/loginpic.jpg" />
        </div>
      </div>
    </div>
  );
};

export default Register;
