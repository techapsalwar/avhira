import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Avhira Brand Colors
                'avhira-red': '#be1e2d',
                'avhira-bg': '#faf5f6',
                'avhira-dark-red': '#9a1824',
                'avhira-light-red': '#d94452',
            },
        },
    },

    plugins: [forms],
};
