import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
 typescript: {
    ignoreBuildErrors: true,
  },
eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, options) => {
    // Es importante añadir la regla al final del array de reglas.
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/, // Buena práctica para no procesar librerías
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
};

export default nextConfig;
