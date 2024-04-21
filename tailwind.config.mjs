/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      container: {
        padding: `1rem`,
        center: true,
      },
      boxShadow: {
        'solig': `3px 3px 0 #000`
      }
    },
	},
	plugins: [],
}
