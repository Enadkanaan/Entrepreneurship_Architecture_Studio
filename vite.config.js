import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({base:process.env.VITE_BASE_PATH || './',plugins:[tailwindcss()],build:{outDir:'dist',rollupOptions:{onwarn(warn,handler){if(warn.code==='MODULE_LEVEL_DIRECTIVE'&&warn.message.includes('use client'))return;handler(warn);},output:{manualChunks:{react:['react','react-dom'],motion:['framer-motion']}}}}});
