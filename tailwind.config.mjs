const disabledCss = {
	'code::before': false,
	'code::after': false,
	'blockquote p:first-of-type::before': false,
	'blockquote p:last-of-type::after': false,
	pre: false,
	code: false,
	'pre code': false
};

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			typography: {
				DEFAULT: { 
					css: {
						...disabledCss,
						maxWidth: 'none',
						color: 'inherit',
					}
				},
				sm: { css: disabledCss },
				lg: { css: disabledCss },
				xl: { css: disabledCss },
				'2xl': { css: disabledCss }
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			animation: {
				'fade-up': 'fade-up 0.6s ease-out both',
				'fade-in': 'fade-in 0.5s ease-out both',
			},
			keyframes: {
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
