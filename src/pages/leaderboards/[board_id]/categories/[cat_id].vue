<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useApi } from '@/composables/useApi.ts'
import { useAuth } from '@/composables/useAuth.ts'
import { useSessionToken } from '@/composables/useSessionToken.ts'
import { Categories } from '@/lib/api/Categories.ts'
import { ProblemDetails } from '@/lib/api/data-contracts.ts'
import { HttpResponse } from '@/lib/api/http-client.ts'
import { Leaderboards } from '@/lib/api/Leaderboards.ts'
import BaseButton from '@/components/base/BaseButton.vue'
import { useRoute } from 'vue-router'

const route = useRoute('/leaderboards/[board_id]/categories/[cat_id]')
const boardId = Number(route.params.board_id)
const categoryId = Number(route.params.cat_id)


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
	const catResp = await categories.getCategory(categoryId)
	const resp = await leaderboards.getLeaderboard(catResp.data.leaderboardId)
	return {
		...catResp.data,
		leaderboardSlug: resp.data.slug
	}
}, null)

const errorResponse = computed(
	() => (error.value as HttpResponse<unknown, ProblemDetails>).error
)

async function revealDelete() {
	if (confirm('Really delete this category? (This action can be reversed)')) {
		await useApi(
			() => categories.deleteCategory(categoryId, useAuth(token.value)),
			() => execute(),
			(error) => {
				updateError.value = 'Failed to delete: ' + error.status
			}
		)
	}
}

async function revealRestore() {
	if (confirm('Really restore this category? (This action can be reversed)')) {
		await useApi(
			() =>
				categories.updateCategory(
					categoryId,
					{
						status: 'Published'
					},
					useAuth(token.value)
				),
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
					name: '/leaderboards/[board_id]',
					params: { board_id: Number(category?.leaderboardId) }
				}"
				>&lt; Back</RouterLink
			>
			<div class="action-button-container">
				<RouterLink
					:to="{ name: '/leaderboards/[board_id]/categories/[cat_id].edit', params: { board_id: boardId, cat_id: categoryId } }"
					tabindex="-1"
				>
					<BaseButton color="secondary">Edit</BaseButton>
				</RouterLink>

				<BaseButton
					v-if="category?.deletedAt === null"
					color="delete"
					@click="revealDelete"
				>
					Delete
				</BaseButton>
				<BaseButton
					v-else
					color="secondary"
					@click="revealRestore">
					Restore
				</BaseButton>
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
							/<a
								:href="`${frontendUrl}/board/${category?.leaderboardSlug}/${category?.slug}`"
								>{{ category?.slug }}</a
							>
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
