import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import './style.css'
import App from './App.vue'
import Main from './components/Main.vue'

const routes = [
	{
		path: '/',
		component: Main,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

createApp(App).use(router).mount('#app')
