<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { Leaderboards } from '../../lib/api/Leaderboards'
import { StatusFilter } from '../../lib/api/data-contracts'

const limit = 256;
const status = ref<StatusFilter>('Published')
const query = ref<string>('')
const searchedQuery = ref<string>('')
const searchedStatus = ref<StatusFilter>()

const leaderboardClient = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const {
	state: boards,
	error,
	isLoading,
	execute
} = useAsyncState(async () => {
	const resp = query.value ? await leaderboardClient.searchLeaderboards({
		q: query.value,
		status: status.value,
		limit: limit
	}) : await leaderboardClient.listLeaderboards({
		status: status.value,
		limit: limit
	})

	return resp.data.data
}, [])

function search() {
	execute()
	searchedQuery.value = query.value
	searchedStatus.value = status.value
}

function clear() {
	query.value = ''
	searchedQuery.value = ''
	execute()
}

function filterChanged() {
	if (!query.value){
		search()
	}
}
</script>

<template>
	<div class="container">
		<h1>Leaderboards</h1>
		<div class="input-container">
			<RouterLink :to="{ name: 'leaderboardCreate' }">
				<button class="button create-new">Create New</button>
			</RouterLink>
			<form @submit.prevent="search" class="form">
				<input v-model="query" placeholder="Search" class="input" type="search"/>
				<select v-model="status" class="input" @change="filterChanged">
					<option value="" disabled>Please select one</option>
					<option value="Published">Published</option>
					<option value="Deleted">Deleted</option>
					<option value="Any">All</option>
				</select>
			</form>
		</div>

		<div v-if="searchedQuery" class="results-text" >
			Displaying results for: "{{ searchedQuery }}" ({{ searchedStatus }}).&nbsp;<a href="" @click.prevent="clear">clear</a>
		</div>

		<div v-if="isLoading">Loading...</div>

		<div v-else-if="error" class="error-container">
			<p>An error occurred.</p>
			<button @click="search" class="retry-button">Retry</button>
		</div>

		<ul v-else>
			<li v-for="board in boards" :key="board.id">
				<RouterLink
					:to="{ name: 'leaderboardView', params: { id: board.id } }"
					:class="{ dull: board.deletedAt !== null }"
				>
					{{ board.name }}
				</RouterLink>
				({{ board.slug }})
			</li>
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

.results-text {
	align-self: flex-start;
	display: flex;
}

.input-container {
	align-self: flex-end;
	display: flex;
	gap: 1rem;
}

.form {
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

.retry-button {
	align-self: start;
	padding: 1rem;
}

.dull {
	color: grey;
}
</style>
