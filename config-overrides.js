module.exports = {
  webpack: function (config, env) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const result = `${year}${month}${day}${hours}${minutes}${seconds}`;
    config.output.filename = `static/js/[name].[hash:8].js?ver=${result}`;
    config.output.chunkFilename = `static/js/[name].[hash:8].chunk.js?ver=${result}`;
    return config;
  },
};
