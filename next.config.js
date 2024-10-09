/** @type {import('next').NextConfig} */


const { i18n } = require("./next-i18next.config");

const nextConfig = {
	reactStrictMode: true,
	i18n,
	images: {
		remotePatterns: [
			{
			  protocol: "https",
			  hostname: "cgsp-bucket.s3.eu-west-3.amazonaws.com",
			  port: "",
			},
		  ],
	},
	output: "standalone",
};

module.exports = nextConfig;