<script setup lang="ts">
import { useAsyncState, useConfirmDialog } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Leaderboards } from '../lib/api/Leaderboards'

const router = useRouter()
const props = defineProps<{
	id: number
}>()

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
	await leaderboards.deleteLeaderboard(props.id)
	router.go(0)
}

async function confirmRestoreBoard() {
	// TODO: Error-handling
	await leaderboards.restoreLeaderboard(props.id)
	router.go(0)
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

			<div class="table">
				<span class="table-header">ID:</span>
				<span>{{ board?.id }}</span>
				<span class="table-header">Name:</span>
				<span>{{ board?.name }}</span>
				<span class="table-header">Slug:</span>
				<span>{{ board?.slug }}</span>
				<span class="table-header">Created:</span>
				<span>{{ board?.createdAt }}</span>
				<span class="table-header">Deleted:</span>
				<span>{{ board?.deletedAt ?? 'Not deleted' }}</span>
				<span class="table-header">Categories:</span>
				<span>{{ board?.categories }}</span>
				<span class="table-header">Info:</span>
				<span>{{ board?.info ?? '-' }}</span>
			</div>
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

.table {
	grid-column: span 2 / span 2;
	display: grid;
	column-gap: 1rem;
	grid-template-columns: max-content 1fr;
}

.table-header {
	font-weight: bold;
}
</style>
