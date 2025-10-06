import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import GlobalToastProvider from './components/GlobalToastProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Avhira';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <GlobalToastProvider>
                <App {...props} />
            </GlobalToastProvider>
        );
    },
    progress: {
        color: '#be1e2d', // Avhira red color
    },
});
