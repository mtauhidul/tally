module.exports = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:5080/auth/:path*", // API backend URL
      },
    ];
  },
};
