import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin/index.html'),
                staff: resolve(__dirname, 'staff/index.html'),
            },
        },
    },
    server: {
        port: 5183, // Matching your current running port or default
        host: 'localhost',
    }
});
