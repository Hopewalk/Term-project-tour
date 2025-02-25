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
    first_name: "",
    last_name: "",
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
        <div className="form-group">
          <label htmlFor="first_name">First name</label>
          <input
            type="text"
            id="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Enter your First name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last name</label>
          <input
            type="text"
            id="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Enter your last_name"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
