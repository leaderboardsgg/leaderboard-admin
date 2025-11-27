<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'
import { useSessionToken } from '@/composables/useSessionToken'
import { Leaderboards } from '@/lib/api/Leaderboards'
import { CreateLeaderboardRequest } from '@/lib/api/data-contracts'
import Slug from '@/components/blocks/Slug.vue'

const token = useSessionToken()
const createError = ref('')
const router = useRouter()

const leaderboards = new Leaderboards({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const warnBeforeLeave = ref(true)

const createRequest = ref<CreateLeaderboardRequest>({
	name: '',
	slug: '',
	info: ''
})

onBeforeRouteLeave(() => {
	if (
		warnBeforeLeave.value &&
		(createRequest.value.name ||
			createRequest.value.slug ||
			createRequest.value.info)
	) {
		if (!window.confirm('Do you want to leave? You have unsaved changes.')) {
			return false
		}
	}
})

function submit() {
	useApi(
		() =>
			leaderboards.createLeaderboard(createRequest.value, useAuth(token.value)),
		({ data }) => {
			warnBeforeLeave.value = false
			router.push({ name: '/leaderboards/[board_id]', params: { board_id: data.id } })
		},
		(error) => {
			createError.value = 'Failed to create: ' + error.status.toString(10)
		}
	)
}
</script>

<template>
	<div class="container">
		<h1>Create Leaderboard</h1>
		<RouterLink
			class="back-link"
			:to="{ name: '/leaderboards/' }"
			title="Changes will not be saved."
		>
			&lt; Back
		</RouterLink>

		<p v-if="createError" class="error-text">{{ createError }}</p>

		<form @submit.prevent="submit">
			<p class="info">Fields marked * are mandatory.</p>
			<table>
				<tbody>
					<tr>
						<th>
							<label for="name">Name*:</label>
						</th>
						<td>
							<input
								required
								v-model="createRequest.name"
								id="name"
								class="input"
							/>
						</td>
					</tr>
					<tr>
						<th>
							<label for="slug">Slug*:</label>
						</th>
						<td>
							<Slug id="slug" class="input" v-model="createRequest.slug" />
						</td>
					</tr>
					<tr>
						<th>
							<label for="info">Info:</label>
						</th>
						<td>
							<textarea v-model="createRequest.info" id="info" rows="10" />
						</td>
					</tr>
				</tbody>
			</table>
			<button class="button">Create</button>
		</form>
	</div>
</template>

<style lang="css" scoped>
.container {
	max-width: 85rem;
	margin: auto;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.back-link {
	justify-self: start;
	padding: 0.5rem;
}

.error-text {
	grid-column: span 2 / span 2;
	color: crimson;
}

.info {
	opacity: 80%;
	font-style: italic;
}

table {
	width: 100%;
}

th {
	text-align: left;
}

td {
	width: 100%;
}

.input {
	width: 40rem;
}

textarea {
	width: 100%;
}
</style>
