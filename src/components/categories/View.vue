<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { useAuth } from '../../composables/useAuth'
import { useSessionToken } from '../../composables/useSessionToken'
import { Categories } from '../../lib/api/Categories'
import { ProblemDetails } from '../../lib/api/data-contracts'
import { HttpResponse } from '../../lib/api/http-client'
import { Leaderboards } from '../../lib/api/Leaderboards'

const props = defineProps<{
	id: number
}>()

const updateError = ref('')

const token = useSessionToken()

const frontendUrl = import.meta.env.VITE_FRONTEND_URL

const categories = new Categories({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const leaderboards = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const {
	state: category,
	error,
	isLoading,
	execute
} = useAsyncState(async () => {
	const catResp = await categories.getCategory(props.id)
	const resp = await leaderboards.getLeaderboard(catResp.data.leaderboardId)
	return {
		...catResp.data,
		leaderboardSlug: resp.data.slug,
	}
}, null)

const errorResponse = computed(
	() => (error.value as HttpResponse<unknown, ProblemDetails>).error
)

async function revealDelete() {
	if (confirm('Really delete this category? (This action can be reversed)')) {
		useApi(
			() => categories.deleteCategory(props.id, useAuth(token.value)),
			() => execute(),
			(error) => {
				updateError.value = 'Failed to delete: ' + error.status
			}
		)
	}
}

async function revealRestore() {
	if (confirm('Really restore this category? (This action can be reversed)')) {
		useApi(
			() => categories.restoreCategory(props.id, useAuth(token.value)),
			() => execute(),
			(error) => {
				updateError.value = 'Failed to restore: ' + error.status
			}
		)
	}
}
</script>

<template>
	<div class="container">
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="error" class="error-container">
			<p class="errorText">
				Failed to fetch category: {{ errorResponse.status }}
				{{ errorResponse.title }}
			</p>
			<button @click="execute()" class="button">Retry</button>
		</div>

		<div v-else class="main-content">
			<h1 class="title">Details for {{ category?.name }}</h1>
			<RouterLink
				class="back-link"
				:to="{
					name: 'leaderboardView',
					params: { id: category?.leaderboardId }
				}"
				>&lt; Back</RouterLink
			>
			<div class="action-button-container">
				<RouterLink :to="{ name: 'categoryEdit', params: { id: props.id } }">
					<button class="action-button">Edit</button>
				</RouterLink>

				<button
					v-if="category?.deletedAt === null"
					class="action-button delete-button"
					@click="revealDelete"
				>
					Delete
				</button>
				<button v-else class="action-button" @click="revealRestore">
					Restore
				</button>
			</div>

			<p v-if="updateError" class="error-text">{{ updateError }}</p>

			<table>
				<tbody>
					<tr>
						<th>ID:</th>
						<td>{{ category?.id }}</td>
					</tr>
					<tr>
						<th>Name:</th>
						<td>{{ category?.name }}</td>
					</tr>
					<tr>
						<th>Slug:</th>
						<td>
							/<a :href="`${frontendUrl}/board/${category?.leaderboardSlug}/${category?.slug}`">{{
								category?.slug
							}}</a>
						</td>
					</tr>
					<tr>
						<th>Info:</th>
						<td v-if="category?.info">{{ category?.info }}</td>
						<td v-else class="dim">&lt;none&gt;</td>
					</tr>
					<tr>
						<th>Run Type:</th>
						<td>{{ category?.type }}</td>
					</tr>
					<tr>
						<th>Sort Direction:</th>
						<td>{{ category?.sortDirection }}</td>
					</tr>
					<tr>
						<th>Created:</th>
						<td>{{ category?.createdAt }}</td>
					</tr>
					<tr>
						<th>Updated:</th>
						<td v-if="category?.updatedAt">{{ category?.updatedAt }}</td>
						<td v-else>-</td>
					</tr>
					<tr>
						<th>Deleted:</th>
						<td v-if="category?.deletedAt">{{ category?.deletedAt }}</td>
						<td v-else class="dim">&lt;Not deleted&gt;</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<style lang="css" scoped>
.container {
	padding: 1rem;
}

.error-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: start;
}

.main-content {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin-top: 1rem;
	row-gap: 1rem;
}

.title {
	grid-column: span 2 / span 2;
}

.back-link {
	justify-self: start;
	padding: 0.5rem;
}

.action-button-container {
	display: flex;
	gap: 0.5rem;
	justify-self: end;
}

.action-button {
	min-width: 3rem;
	height: 3rem;
}

.delete-button {
	background: crimson;
}

.table-header {
	font-weight: bold;
}

.error-text {
	grid-column: span 2 / span 2;
	color: crimson;
}

.dim {
	color: grey;
	font-style: italic;
}
</style>
