/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)', // Aplica a todas las rutas
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Configuración de compresión (opcional)
  compress: true,

  // Configuración de internacionalización (i18n) (opcional)
  // i18n: {
  //   locales: ['en', 'es','de'], // Idiomas soportados
  //   defaultLocale: 'en', // Idioma por defecto
  // },
  reactStrictMode: true,
};


module.exports = nextConfig;