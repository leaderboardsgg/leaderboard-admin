<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useAuth } from '../../composables/useAuth'
import { useSessionToken } from '../../composables/useSessionToken'
import { Leaderboards } from '../../lib/api/Leaderboards'
import {
	ProblemDetails,
	UpdateLeaderboardRequest
} from '../../lib/api/data-contracts'
import { HttpResponse } from '../../lib/api/http-client'

const props = defineProps<{
	id: number
}>()

const updateError = ref('')

const token = useSessionToken()

const router = useRouter()

const leaderboards = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const warnBeforeLeave = ref(true)

const updateRequest = ref<UpdateLeaderboardRequest>({
	info: '',
	name: '',
	slug: ''
})

const {
	state: board,
	error,
	isLoading,
	execute
} = useAsyncState(async () => {
	const resp = await leaderboards.getLeaderboard(props.id)
	updateRequest.value.info = resp.data.info
	updateRequest.value.name = resp.data.name
	updateRequest.value.slug = resp.data.slug
	return resp.data
}, null)

onBeforeRouteLeave(() => {
	if (
		warnBeforeLeave.value &&
		(board.value?.name !== updateRequest.value.name ||
			board.value?.slug !== updateRequest.value.slug ||
			board.value?.info !== updateRequest.value.info)
	) {
		if (!window.confirm('Do you want to leave? You have unsaved changes.')) {
			return false
		}
	}
})

const errorResponse = computed(
	() => error.value as HttpResponse<unknown, void | ProblemDetails>
)

async function submit() {
	useApi(
		() =>
			leaderboards.updateLeaderboard(
				props.id,
				{
					name: updateRequest.value.name,
					info: updateRequest.value.info,
					slug: updateRequest.value.slug
				},
				useAuth(token.value)
			),
		() => {
			warnBeforeLeave.value = false
			router.push({ name: 'leaderboardView', params: { id: props.id } })
		},
		(error) => {
			updateError.value = 'Failed to update: ' + error.status.toString(10)
		}
	)
}
</script>

<template>
	<div class="container">
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="error" class="error-container">
			<p class="errorText">
				<!-- For unexpected server errors; fields will be empty, hence the defaults. -->
				Failed to fetch leaderboard: {{ errorResponse.status }}
				{{ errorResponse.error?.title ?? 'Check the console for more info.' }}
			</p>
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

			<form @submit.prevent="submit">
				<table>
					<tbody>
						<tr>
							<th>ID:</th>
							<td>{{ board?.id }}</td>
						</tr>
						<tr>
							<th>
								<label for="name">Name:</label>
							</th>
							<td>
								<input v-model="updateRequest.name" id="name" />
							</td>
						</tr>
						<tr>
							<th>
								<label for="slug">Slug:</label>
							</th>
							<td>
								<input v-model="updateRequest.slug" id="slug" />
							</td>
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
							<th>
								<label for="info">Info:</label>
							</th>
							<td>
								<textarea v-model="updateRequest.info" id="info" rows="5" />
							</td>
						</tr>
					</tbody>
				</table>
				<button>Save Changes</button>
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

.dim {
	color: grey;
	font-style: italic;
}
</style>
