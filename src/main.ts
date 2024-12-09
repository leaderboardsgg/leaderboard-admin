import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Leaderboard from './components/Leaderboard.vue'
import Main from './components/Main.vue'
import './style.css'

const routes = [
	{
		path: '/',
		component: Main,
	},
	{
		path: '/leaderboard/:id',
		name: 'leaderboard',
		component: Leaderboard,
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

createApp(App).use(router).mount('#app')
