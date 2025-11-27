import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vueDevTools(), vue(), VueRouter({})],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
