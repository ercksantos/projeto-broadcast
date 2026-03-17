/** @type {import('tailwindcss').Config} */
export default {
    corePlugins: {
        preflight: false, // evita conflito de reset CSS com MUI
    },
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: { extend: {} },
    plugins: [],
};
