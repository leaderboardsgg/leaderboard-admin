<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { Leaderboards } from '../lib/api/Leaderboards'

enum IncludeDeleted {
	NotDeleted,
	Deleted,
	All
}

const includeDeleted = ref(IncludeDeleted.NotDeleted)
const search = ref<string>('')

const leaderboardClient = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const {
	state: allBoards,
	error,
	isLoading,
	execute
} = useAsyncState(async () => {
	const resp = await leaderboardClient.listLeaderboards({
		includeDeleted: true
	})

	return resp.data
}, [])

const boardsFiltered = computed(() =>
	allBoards.value.filter(
		(board) =>
			includeDeleted.value === IncludeDeleted.All ||
			(includeDeleted.value === IncludeDeleted.NotDeleted) ===
				(board.deletedAt === null)
	)
)

const boardsSearched = computed(() =>
	boardsFiltered.value.filter(
		(board) =>
			!search.value ||
			board.name
				.toLocaleLowerCase()
				.includes(search.value.trim().toLocaleLowerCase())
	)
)
</script>

<template>
	<div class="container">
		<h1>Leaderboards</h1>
		<div class="input-container">
			<input v-model="search" placeholder="Search" class="input" />
			<select v-model="includeDeleted" class="input">
				<option value="" disabled>Please select one</option>
				<option :value="IncludeDeleted.NotDeleted">Not Deleted</option>
				<option :value="IncludeDeleted.Deleted">Deleted</option>
				<option :value="IncludeDeleted.All">All</option>
			</select>
		</div>

		<div v-if="isLoading">Loading...</div>

		<div v-else-if="error" class="error-container">
			<p>An error occurred.</p>
			<button @click="execute()" class="reload-button">Retry</button>
		</div>

		<ul v-else>
			<li v-for="board in boardsSearched" :key="board.id">
				<RouterLink
					:to="`/leaderboard/${board.id}`"
					:class="{ dull: board.deletedAt !== null }"
				>
					{{ board.name }}
				</RouterLink>
				({{ board.slug }})
			</li>
			<!-- TODO: Use a proper named route here. -->
		</ul>
	</div>
</template>

<style scoped>
.container {
	max-width: 85rem;
	margin: auto;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.input-container {
	align-self: flex-end;
	display: flex;
	gap: 1rem;
}

.input {
	padding: 0.5rem;
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

.dull {
	color: grey;
}
</style>
