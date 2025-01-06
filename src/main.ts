import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Edit from './components/Edit.vue'
import Leaderboard from './components/Leaderboard.vue'
import Leaderboards from './components/Leaderboards.vue'
import Main from './components/Main.vue'
import './style.css'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: '/home',
			component: Main,
		},
		{
			path: '/leaderboard/:id(\\d+)',
			name: 'leaderboardView',
			component: Leaderboard,
			props: (route) => ({ id: Number.parseInt(route.params.id as string) }),
		},
		{
			path: '/leaderboard/:id(\\d+)/edit',
			name: 'leaderboardEdit',
			component: Edit,
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
			}),
		},
		{
			path: '/leaderboards',
			name: 'leaderboardsList',
			component: Leaderboards,
		},
	],
})

createApp(App).use(router).mount('#app')
