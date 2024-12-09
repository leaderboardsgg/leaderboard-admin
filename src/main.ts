import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Leaderboard from './components/Leaderboard.vue'
import Leaderboards from './components/Leaderboards.vue'
import Main from './components/Main.vue'
import './style.css'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Main,
	},
	{
		path: '/leaderboard/:id',
		name: 'leaderboard',
		component: Leaderboard,
	},
	{
		path: '/leaderboards',
		name: 'leaderboardsList',
		component: Leaderboards,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

createApp(App).use(router).mount('#app')
