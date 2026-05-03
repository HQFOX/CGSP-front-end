import React from 'react';

import { vi } from 'vitest';

// Mock next-i18next
vi.mock('next-i18next/pages', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: {
			language: 'en',
			changeLanguage: vi.fn()
		}
	})
}));

// Mock next-i18next/pages/serverSideTranslations
vi.mock('next-i18next/pages/serverSideTranslations', () => ({
	serverSideTranslations: vi.fn()
}));

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
	default: (fn: any) => {
		const Component = () => null;
		Component.displayName = 'DynamicComponent';
		return Component;
	}
}));

// Mock next/image
vi.mock('next/image', () => ({
	default: (props: any) => {
		return React.createElement('img', props);
	}
}));

// Mock next/link
vi.mock('next/link', () => ({
	default: ({ children, href }: any) => {
		return React.createElement('a', { href }, children);
	}
}));

// Mock intersection observer
global.IntersectionObserver = class IntersectionObserver {
	constructor() {}
	disconnect() {}
	observe() {}
	takeRecords() {
		return [];
	}
	unobserve() {}
} as any;

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
