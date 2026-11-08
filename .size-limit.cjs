// Turbopack (default bundler in Next 16) emits content-hashed chunk names, so
// we can't glob `.next/static/chunks/pages/*`. Instead, resolve each page's
// chunks from the build manifest.
const fs = require('node:fs');
const path = require('node:path');

const manifestPath = path.join(__dirname, '.next/build-manifest.json');

if (!fs.existsSync(manifestPath)) {
	throw new Error('size-limit: .next/build-manifest.json not found. Run `npm run build` first.');
}

const { pages } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const jsOnly = (files = []) => files.filter((file) => file.endsWith('.js')).map((file) => `.next/${file}`);

const appChunks = new Set(jsOnly(pages['/_app']));

// Page-specific JS only (chunks already loaded by _app are excluded).
const pageEntry = (name, route, limit) => {
	if (!pages[route]) throw new Error(`size-limit: route "${route}" not found in build manifest`);
	const files = jsOnly(pages[route]).filter((file) => !appChunks.has(file));
	return { name, path: files, ...(limit && { limit }) };
};

module.exports = [
	{ name: 'Shared app bundle', path: [...appChunks] },
	pageEntry('Home page', '/'),
	pageEntry('Projects page', '/projects'),
	pageEntry('Updates page', '/updates')
];
