/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Photos ajoutées depuis l'admin (Vercel Blob)
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    // Les assets sont déjà optimisés en webp/avif dans /public/assets.
    // next/image gère le responsive sizing sur ces sources locales.
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
