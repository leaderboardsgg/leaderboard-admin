import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import FourOhFour from './components/404.vue'
import Main from './components/Main.vue'
import LeaderboardCreate from './components/leaderboards/Create.vue'
import Edit from './components/leaderboards/Edit.vue'
import Leaderboards from './components/leaderboards/List.vue'
import Leaderboard from './components/leaderboards/View.vue'
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
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
			}),
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
			path: '/leaderboard/create',
			name: 'leaderboardCreate',
			component: LeaderboardCreate,
		},
		{
			path: '/leaderboards',
			name: 'leaderboardsList',
			component: Leaderboards,
		},
		// keep this at the bottom of the array.
		{ path: '/:pathMatch(.*)*', name: '404', component: FourOhFour },
	],
})

createApp(App).use(router).mount('#app')
