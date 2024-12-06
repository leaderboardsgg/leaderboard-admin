<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Leaderboards } from '../lib/api/Leaderboards'

enum Flag {
	Without,
	With,
	All
}

const includeDeleted = ref(Flag.Without)
const search = ref<string | null>(null)

const leaderboardClient = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const { state: allBoards, error, isLoading } = useAsyncState(
	leaderboardClient.listLeaderboards({})
		.then(
			res => res.data || []
		),
	[]
)

const router = useRouter()

function reload() {
	router.go(0)
}

const boards = computed(() =>
	allBoards
		.value
		.filter((board) =>
			search.value
				? board.name
						.toLocaleLowerCase()
						.includes(search.value.trim().toLocaleLowerCase())
				: true
		)
		.filter((board) => {
			switch (includeDeleted.value) {
				case Flag.Without:
					return board.deletedAt === null
				case Flag.With:
					return board.deletedAt !== null
				default:
					return true
			}
		})
)
</script>

<template>
	<div class="container">
		<h1 class="title">Leaderboards</h1>
		<select v-model="includeDeleted" class="input">
			<option value="" disabled>Please select one</option>
			<option :value="Flag.Without">Not Deleted</option>
			<option :value="Flag.With">Deleted</option>
			<option :value="Flag.All">All</option>
		</select>
		<input v-model="search" placeholder="Search" class="input" />

		<div v-if="isLoading" class="main-content">
			Loading...
		</div>

		<div v-else-if="error" class="main-content error-container">
			<span>{{ error }}</span>
			<button @click="reload" class="reload-button">Refresh page</button>
		</div>

		<ul v-else v-for="board in boards ?? []" :key="board.id" class="main-content">
			<!-- TODO: Switch list item to RouterLink -->
			<li>{{ board.name }}</li>
			<!-- <RouterLink :to="{
				name: 'leaderboard',
				params: { slug: board.slug },
			}">{{ board.name }}</RouterLink> -->
		</ul>
	</div>
</template>

<style scoped>
.container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.5rem;
}

.title {
	grid-column: span 2 / span 2;
}

.input {
	padding: 0.5rem;
}

.main-content {
	grid-column: span 2 / span 2;
	padding: 0;
}

.error-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.reload-button {
	align-self: start;
	padding: 1rem;
}
</style>
