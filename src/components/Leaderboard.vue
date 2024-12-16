<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useSessionToken } from '../composables/useSessionToken'
import { Leaderboards } from '../lib/api/Leaderboards'
import { useApi } from '../composables/useApi'

const props = defineProps<{
	id: number
}>()

const updateError = ref('')

const token = useSessionToken()

const leaderboards = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const {
	state: board,
	error,
	isLoading,
	execute
} = useAsyncState(async () => {
	// TODO: Add param in BE that allows also fetching deleted boards
	const resp = await leaderboards.getLeaderboard(props.id)
	return resp.data
}, null)

async function revealDelete() {
	if (
		confirm('Really delete this leaderboard? (This action can be reversed)')
	) {
		useApi(
			() => leaderboards.deleteLeaderboard(props.id, useAuth(token.value)),
			() => execute(),
			(error) => {
				updateError.value =
					'Failed to delete: ' + (error as Response).status.toString(10)
			}
		)
	}
}

async function revealRestore() {
	if (
		confirm('Really restore this leaderboard? (This action can be reversed)')
	) {
		useApi(
			() => leaderboards.restoreLeaderboard(props.id, useAuth(token.value)),
			() => execute(),
			(error) => {
				updateError.value =
					'Failed to restore: ' + (error as Response).status.toString(10)
			}
		)
	}
}
</script>

<template>
	<div class="container">
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="error" class="error-container">
			<p class="errorText">{{ error }}</p>
			<button @click="execute()" class="button">Reload</button>
		</div>

		<div v-else class="main-content">
			<RouterLink class="back-link" :to="{ name: 'leaderboardsList' }"
				>&lt; Back</RouterLink
			>
			<div class="action-button-container">
				<!-- TODO: Create Edit page, and then add this link to it -->
				<!-- <RouterLink to="/edit"><button class="action-button">✎</button></RouterLink> -->
				<button
					v-if="board?.deletedAt === null"
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
						<td>{{ board?.id }}</td>
					</tr>
					<tr>
						<th>Name:</th>
						<td>{{ board?.name }}</td>
					</tr>
					<tr>
						<th>Slug:</th>
						<!-- TODO: Convert this to a link to the board on the main site -->
						<td>/{{ board?.slug }}</td>
					</tr>
					<tr>
						<th>Created:</th>
						<td>{{ board?.createdAt }}</td>
					</tr>
					<tr>
						<th>Deleted:</th>
						<td v-if="board?.deletedAt">{{ board?.deletedAt }}</td>
						<td v-else class="dim">&lt;Not deleted&gt;</td>
					</tr>
					<tr>
						<th>Info:</th>
						<td v-if="board?.info">{{ board?.info }}</td>
						<td v-else class="dim">&lt;none&gt;</td>
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
	width: 3rem;
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
