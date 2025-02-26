import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "../conf/ax";
import { useSetState } from "react-use";
import { AuthContext } from "../context/Auth.context";
import loginpic from "../Images/loginpic.jpg";

export default function Login() {
  const { state: ContextState, login } = useContext(AuthContext);
  const { isLoginPending, isLoggedIn, loginError } = ContextState;
  const [formState, setFormState] = useSetState({ username: "", password: "" });
  const { setUserRole } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formState;
    login(username, password);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/Home");
      console.log("islogin", isLoggedIn);
      const fetchRole = async () => {
        //เอา role ออกมาเช็ค
        try {
          const result = await ax.get("users/me?populate=role");
          const role = result.data.role.type;
          setUserRole(role);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      };

      fetchRole();
    }
  }, [isLoggedIn, setUserRole, navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <form className="login-form" onSubmit={onSubmit}>
            <h2>เข้าสู่ระบบ</h2>
            <div className="form-group">
              <label htmlFor="username">username</label>
              <input
                type="text"
                id="username"
                placeholder="username"
                value={formState.username}
                onChange={(e) => setFormState({ username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="password"
                value={formState.password}
                onChange={(e) => setFormState({ password: e.target.value })}
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
            {isLoggedIn && (
              <div className="alert success">
                You have successfully logged in.
              </div>
            )}

            {loginError && (
              <div className="alert error">ไม่สามารถเข้าสู่ระบบได้</div>
            )}
            <p className="signup-link">
              Don't have an account? <a href="/Register">Sign up</a>
            </p>
          </form>
        </div>
        <div className="login-right">
          <img src={loginpic} alt="ทะเล" className="size-full" />
        </div>
      </div>
    </div>
  );
}
