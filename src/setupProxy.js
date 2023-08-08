const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      //target: "http://inssain.com", //AWS 프록시
      target: "http://192.168.0.56:8080", //로컬 프록시
      changeOrigin: true,
    })
  );
};
