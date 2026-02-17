import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  // Point explicitly to your i18n configuration file
  "./src/i18n/request.js",
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // If using Turbopack, sometimes adding this helps bypass config errors
  transpilePackages: ["next-intl"],
};

export default withNextIntl(nextConfig);
