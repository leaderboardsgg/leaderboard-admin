<script setup lang="ts">
import { useAsyncState, useConfirmDialog } from '@vueuse/core'
import { Leaderboards } from '../lib/api/Leaderboards'
import { useSessionToken } from '../composables/useSessionToken';
import { useAuth } from '../composables/useAuth';

const props = defineProps<{
	id: number
}>()

const token = useSessionToken()

const leaderboards = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const {state: board, error, isLoading, execute} = useAsyncState(async () => {
	// TODO: Add param in BE that allows also fetching deleted boards
	const resp = await leaderboards.getLeaderboard(props.id)
	return resp.data
}, null)

const {
	reveal: revealDelete,
	isRevealed: isRevealedDelete,
	cancel: cancelDelete
} = useConfirmDialog()

const {
	reveal: revealRestore,
	isRevealed: isRevealedRestore,
	cancel: cancelRestore
} = useConfirmDialog()

async function confirmDeleteBoard() {
	// TODO: Error-handling
	await leaderboards.deleteLeaderboard(props.id, useAuth(token.value))
	execute()
}

async function confirmRestoreBoard() {
	// TODO: Error-handling
	await leaderboards.restoreLeaderboard(props.id, useAuth(token.value))
	execute()
}
</script>

<template>
	<div class="container">
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="error" class="error-container">
			{{ error }}
			<button @click="execute()" class="button">Reload</button>
			<!-- TODO: Add button to go back to the List page -->
		</div>

		<div v-else class="main-content">
			<!-- Deletion confirmation -->
			<div v-if="isRevealedDelete" class="delete-confirmation-container">
				<button @click="cancelDelete">Cancel</button>
				<button @click="confirmDeleteBoard">Confirm</button>
			</div>

			<!-- Restoration confirmation -->
			<div v-if="isRevealedRestore" class="delete-confirmation-container">
				<button @click="cancelRestore">Cancel</button>
				<button @click="confirmRestoreBoard">Confirm</button>
			</div>

			<!-- <RouterLink :to="{ name: 'leaderboards' }">
				<button class="back-button">← Leaderboards</button>
			</RouterLink> -->
			<button class="back-button">Temp</button>
			<div class="action-button-container">
				<!-- TODO: Create Edit page, and then add this link to it -->
				<!-- <RouterLink to="/edit"><button class="action-button">✎</button></RouterLink> -->
				<button v-if="board?.deletedAt === null" class="action-button delete-button" @click="revealDelete">🗑️</button>
				<button v-else class="action-button" @click="revealRestore">Restore</button>
			</div>

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
						<td>/{{ board?.slug }}</td>
					</tr>
					<tr>
						<th>Created:</th>
						<td>{{ board?.createdAt }}</td>
					</tr>
					<tr>
						<th>Deleted:</th>
						<td>{{ board?.deletedAt ?? 'Not deleted' }}</td>
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

.back-button {
	justify-self: start;
	padding: 0.5rem;
}

.delete-confirmation-container {
	display: flex;
	justify-content: space-between;
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

.delete-button:hover {
	background: red;
}

.table-header {
	font-weight: bold;
}

.dim {
	color: grey;
	font-style: italic;
}
</style>
