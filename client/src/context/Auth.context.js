import React, { useEffect } from "react";
import { useSetState } from "react-use";
import conf from "../conf/main";
import ax, { axData } from "../conf/ax";

export const AuthContext = React.createContext(null);

const initialState = {
  isLoggedIn: false,
  user: null,
  userRole: null, // Add userRole to track the role
  isLoginPending: false,
  loginError: null,
};

const updateJwt = (jwt) => {
  axData.jwt = jwt;
  if (jwt) {
    sessionStorage.setItem(conf.jwtSessionStorageKey, jwt);
  } else {
    sessionStorage.removeItem(conf.jwtSessionStorageKey);
  }
};

export const ContextProvider = (props) => {
  const [state, setState] = useSetState(initialState);

  const setLoginPending = (isLoginPending) => setState({ isLoginPending });
  const setLoginSuccess = (isLoggedIn, user) => setState({ isLoggedIn, user });
  const setLoginError = (loginError) => setState({ loginError });
  const setUserRole = (userRole) => setState({ userRole }); // Add setUserRole function

  const fetchRole = async () => {
    try {
      const response = await ax.get(`/users/me?populate=role`);
      if (response.data) {
        return response.data.role?.name || response.data.role?.type; // Handle both name and type
      }
    } catch (error) {
      console.error("Failed to fetch role:", error);
      return null;
    }
  };

  const handleLoginResult = async (error, result) => {
    setLoginPending(false);

    if (result && result.user) {
      if (result.jwt) {
        updateJwt(result.jwt);
      }
      const role = await fetchRole();
      const user = { ...result.user, role };
      setLoginSuccess(true, user);
      setUserRole(role); // Set the role in context
    } else if (error) {
      setLoginError(error);
    }
  };

  useEffect(() => {
    setLoginPending(true);
    loadPersistedJwt(handleLoginResult);
  }, []);

  const login = (username, password) => {
    setLoginPending(true);
    setLoginSuccess(false);
    setLoginError(null);

    fetchLogin(username, password, handleLoginResult);
  };

  const logout = () => {
    setLoginPending(false);
    updateJwt(null);
    setLoginSuccess(false);
    setLoginError(null);
    setUserRole(null); // Clear role on logout
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        setUserRole, // Provide setUserRole in context
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

// Rest of the code (fetchLogin, loadPersistedJwt) remains unchanged

const fetchLogin = async (username, password, callback) => {
  try {
    const response = await ax.post(conf.loginEndpoint, {
      identifier: username,
      password,
    });
    if (response.data.jwt && response.data.user.id > 0) {
      callback(null, response.data);
    } else {
      callback(new Error("Invalid username and password"));
    }
  } catch (e) {
    callback(new Error("Fail to initiate login"));
  }
};

const loadPersistedJwt = async (callback) => {
  try {
    const persistedJwt = sessionStorage.getItem(conf.jwtSessionStorageKey);
    if (persistedJwt) {
      axData.jwt = persistedJwt;
      const response = await ax.get(conf.jwtUserEndpoint);
      if (response.data.id > 0) {
        callback(null, { user: response.data });
      } else {
        callback(null);
      }
    }
  } catch (e) {
    console.log(e);
    callback(new Error("Fail to initiate auto login"));
  }
};
