const isProd = process.env.NODE_ENV === "production";

const config = {
  isProd,
  serverUrlPrefix: isProd
    ? "https://w02.pupasoft.com/api"
    : "http://localhost:1337/api",
};

export default config;
