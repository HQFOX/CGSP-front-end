/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
	reactStrictMode: true,
	i18n,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: process.env.BUCKET,
				port: ''
			}
		]
	},
	output: 'standalone'
};

module.exports = nextConfig;
