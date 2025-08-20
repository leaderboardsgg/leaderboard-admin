<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { ref, watch } from 'vue'
import { Leaderboards } from '../../lib/api/Leaderboards'
import { StatusFilter } from '../../lib/api/data-contracts'
import Paginator from '../Paginator.vue'

const pageQuery = useRouteQuery('page', '1', { transform: Number })
const limitQuery = useRouteQuery('resultsPerPage', '25', { transform: Number })

const status = ref<StatusFilter>('Published')
const query = ref('')
const searchedQuery = ref('')
const searchedStatus = ref<StatusFilter>()

const leaderboardClient = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const {
	state: boards,
	error,
	isLoading,
	execute
} = useAsyncState(
	async (q: string) => {
		const resp = q
			? await leaderboardClient.searchLeaderboards({
					q: q,
					status: status.value,
					limit: limitQuery.value,
					offset: (pageQuery.value - 1) * limitQuery.value
				})
			: await leaderboardClient.listLeaderboards({
					status: status.value,
					limit: limitQuery.value,
					offset: (pageQuery.value - 1) * limitQuery.value
				})

		return resp.data
	},
	{
		data: [],
		limitDefault: 0,
		limitMax: 0,
		total: 0
	}
)

function search(q: string) {
	execute(0, q)
	searchedQuery.value = q
	searchedStatus.value = status.value
}

function clear() {
	execute(0, '')
	searchedQuery.value = ''
}

function filterChanged() {
	execute(0, searchedQuery.value)
	searchedStatus.value = status.value
}

watch([limitQuery, pageQuery], () => execute(0, query.value))
</script>

<template>
	<div class="container">
		<h1>Leaderboards</h1>
		<div class="input-container">
			<RouterLink :to="{ name: 'leaderboardCreate' }" tabindex="-1">
				<button class="button create-new">Create New</button>
			</RouterLink>
			<form @submit.prevent="search(query)" class="form">
				<input
					v-model="query"
					placeholder="Search"
					class="input"
					type="search"
					tabindex="0"
				/>
				<select v-model="status" class="input" @change="filterChanged">
					<option value="" disabled>Please select one</option>
					<option value="Published">Published</option>
					<option value="Deleted">Deleted</option>
					<option value="Any">All</option>
				</select>
			</form>
		</div>

		<div v-if="searchedQuery" class="results-text">
			Displaying {{ boards.data.length }} of {{ boards.total }} results for "{{
				searchedQuery
			}}" ({{ searchedStatus }}).&nbsp;
			<a href="" @click.prevent="clear">clear</a>
		</div>

		<div v-if="isLoading">Loading...</div>

		<div v-else-if="error" class="error-container">
			<p>An error occurred.</p>
			<button @click="search(query)" class="retry-button">Retry</button>
		</div>

		<div v-else>
			<Paginator
				:total="boards.total"
				v-model:limit="limitQuery"
				v-model:page="pageQuery"
			/>
			<ul>
				<li v-for="board in boards.data" :key="board.id">
					<RouterLink
						:to="{ name: 'leaderboardView', params: { id: board.id } }"
						:class="{ dull: board.deletedAt !== null }"
					>
						{{ board.name }}
					</RouterLink>
					({{ board.slug }})
				</li>
			</ul>
			<Paginator
				:total="boards.total"
				v-model:limit="limitQuery"
				v-model:page="pageQuery"
			/>
		</div>
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
