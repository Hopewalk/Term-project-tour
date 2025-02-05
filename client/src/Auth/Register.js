import React, { useState } from "react";
import "./Login.css";
import ax from "../conf/ax";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ax.post("/auth/local/register", form);
      navigate("/Login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>สมัครเพื่อเข้าสู่ระบบ</h2>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={handleChange}
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
          <img src="./Images/loginpic.jpg" alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Register;
