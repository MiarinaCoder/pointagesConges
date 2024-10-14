/** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

export default {
    devIndicators: {
      autoPrerender: false,
    },
    serverRuntimeConfig: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
  