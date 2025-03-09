const isProd = process.env.NODE_ENV === "production";

const conf = {
  apiUrlPrefix: isProd
    ? "https://w02-admin.pupasoft.com/api"
    : "http://localhost:1337/api",
  loginEndpoint: "/auth/local",
  jwtUserEndpoint: "/users/me",
  jwtSessionStorageKey: "auth.jwt",
};

export default conf;
