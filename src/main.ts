import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import FourOhFour from './components/404.vue'
import Main from './components/Main.vue'
import CategoryCreate from './components/categories/Create.vue'
import CategoryEdit from './components/categories/Edit.vue'
import CategoryView from './components/categories/View.vue'
import LeaderboardCreate from './components/leaderboards/Create.vue'
import LeaderboardEdit from './components/leaderboards/Edit.vue'
import LeaderboardsList from './components/leaderboards/List.vue'
import LeaderboardView from './components/leaderboards/View.vue'
import UserEdit from './components/users/Edit.vue'
import UsersList from './components/users/List.vue'
import UserView from './components/users/View.vue'
import './style.css'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Main,
		},
		{
			path: '/user/:id',
			name: 'userView',
			component: UserView,
			props: (route) => ({
				id: route.params.id as string,
			}),
		},
		{
			path: '/user/:id/edit',
			name: 'userEdit',
			component: UserEdit,
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
			}),
		},
		{
			path: '/users',
			name: 'usersList',
			component: UsersList,
		},
		{
			path: '/leaderboard/:id(\\d+)',
			name: 'leaderboardView',
			component: LeaderboardView,
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
				// Pagination's for categories
				limit:
					Number.parseInt(route.query.resultsPerPage as string, 10) ||
					undefined,
				page: Number.parseInt(route.query.page as string, 10) || 1,
			}),
		},
		{
			path: '/leaderboard/:id(\\d+)/edit',
			name: 'leaderboardEdit',
			component: LeaderboardEdit,
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
			}),
		},
		{
			path: '/leaderboards/create',
			name: 'leaderboardCreate',
			component: LeaderboardCreate,
		},
		{
			path: '/leaderboards',
			name: 'leaderboardsList',
			component: LeaderboardsList,
			props: (route) => ({
				limit:
					Number.parseInt(route.query.resultsPerPage as string, 10) ||
					undefined,
				page: Number.parseInt(route.query.page as string, 10) || 1,
			}),
		},
		{
			path: '/category/:id(\\d+)',
			name: 'categoryView',
			component: CategoryView,
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
			}),
		},
		{
			path: '/category/:id(\\d+)/edit',
			name: 'categoryEdit',
			component: CategoryEdit,
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
			}),
		},
		{
			path: '/leaderboard/:id(\\d+)/categories/create',
			name: 'categoryCreate',
			component: CategoryCreate,
			props: (route) => ({
				id: Number.parseInt(route.params.id as string, 10),
			}),
		},
		// keep this at the bottom of the array.
		{ path: '/:pathMatch(.*)*', name: '404', component: FourOhFour },
	],
})

createApp(App).use(router).mount('#app')
