import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "../conf/ax";
import { useSetState } from "react-use";
import { AuthContext } from "../context/Auth.context";
import loginpic from "../Images/loginpic.jpg";
import {
  useNotification,
  NotificationContainer,
} from "../Admin/Component/notification"; // เพิ่มการ import

export default function Login() {
  const { state: ContextState, login, setUserRole } = useContext(AuthContext); // ตรวจสอบว่า setUserRole ถูกส่งมาจาก context
  const { isLoginPending, isLoggedIn, loginError } = ContextState;
  const [formState, setFormState] = useSetState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);

  const { notifications, removeNotification, showSuccess, showError } =
    useNotification();

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasShownSuccess(false);
    setHasShownError(false);
    const { username, password } = formState;

    try {
      await login(username, password);
    } catch (error) {
      showError("ไม่สามารถเข้าสู่ระบบได้");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ตรวจสอบสถานะอย่างชัดเจนและป้องกันการ trigger ซ้ำ
    if (
      isLoggedIn === true &&
      (!loginError || loginError === null) &&
      !hasShownSuccess
    ) {
      // ใช้ === true เพื่อความชัดเจน
      showSuccess("เข้าสู่ระบบสำเร็จ");
      setHasShownSuccess(true);
      setIsLoading(false);

      const fetchRole = async () => {
        try {
          const result = await ax.get("users/me?populate=role");
          const role = result.data.role?.type; // ใช้ optional chaining
          if (setUserRole && typeof setUserRole === "function") {
            // ตรวจสอบว่า setUserRole เป็น function
            setUserRole(role);
          } else {
            console.error("setUserRole is not a function or undefined");
          }
          navigate("/Home", { replace: true });
        } catch (error) {
          console.error("Error fetching role:", error);
          showError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
        }
      };

      fetchRole();
    } else if (isLoggedIn === false && loginError && !hasShownError) {
      // ใช้ === false เพื่อความชัดเจน
      showError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      setHasShownError(true);
      setIsLoading(false);
    }
  }, [
    isLoggedIn,
    loginError,
    hasShownSuccess,
    hasShownError,
    setUserRole,
    navigate,
    showSuccess,
    showError,
  ]);

  return (
    <div className="login-wrapper">
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />

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

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

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
