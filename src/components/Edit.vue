<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useSessionToken } from '../composables/useSessionToken'
import { Leaderboards } from '../lib/api/Leaderboards'
import { UpdateLeaderboardRequest } from '../lib/api/data-contracts'

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

const updateRequest = computed<UpdateLeaderboardRequest>(() => ({
	name: board.value?.name,
	info: board.value?.info,
	slug: board.value?.slug
}))

async function submit() {
	useApi(
		() =>
			leaderboards.updateLeaderboard(
				props.id,
				updateRequest.value,
				useAuth(token.value)
			),
		async (data) => {
			console.log(await data.json())
			execute()
		},
		(error) => {
			updateError.value =
				'Failed to update: ' + (error as Response).status.toString(10)
		}
	)
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
			<RouterLink
				class="back-link"
				:to="{ name: 'leaderboardView', params: { id } }"
				title="Changes will not be saved."
				>&lt; Back</RouterLink
			>

			<p v-if="updateError" class="error-text">{{ updateError }}</p>

			<form @submit.prevent="submit" class="edit-form">
				<span>ID:</span>
				<span>{{ board?.id }}</span>
				<label for="name">Name:</label>
				<input v-model="updateRequest.name" id="name" />
				<label for="slug">Slug:</label>
				<input v-model="updateRequest.slug" id="slug" />
				<span>Created:</span>
				<span>{{ board?.createdAt }}</span>
				<span>Deleted:</span>
				<span v-if="board?.deletedAt">{{ board?.deletedAt }}</span>
				<span v-else class="dim">&lt;Not deleted&gt;</span>
				<label for="info">Info:</label>
				<textarea v-model="updateRequest.info" id="info" rows="5" />
				<button>Submit</button>
			</form>
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
	display: flex;
	flex-direction: column;
	margin-top: 1rem;
	row-gap: 1rem;
}

.back-link {
	justify-self: start;
	padding: 0.5rem;
}

.error-text {
	grid-column: span 2 / span 2;
	color: crimson;
}

.edit-form {
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 1rem;
}

.dim {
	color: grey;
	font-style: italic;
}
</style>
