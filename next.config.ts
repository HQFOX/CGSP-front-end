/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config.js');
const bundleAnalyzer = require('@next/bundle-analyzer');

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const nextConfig = {
	reactStrictMode: true,
	i18n,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: process.env.BUCKET,
				port: ''
			},
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
				port: ''
			}
		]
	},
	output: 'standalone'
};

module.exports = withBundleAnalyzer(nextConfig);
