<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useAuth } from '../../composables/useAuth'
import { useSessionToken } from '../../composables/useSessionToken'
import { Users } from '../../lib/api/Users'
import { ProblemDetails, UpdateUserRequest } from '../../lib/api/data-contracts'
import { HttpResponse } from '../../lib/api/http-client'

const props = defineProps<{
	id: string
}>()

const updateError = ref('')

const token = useSessionToken()

const router = useRouter()

const users = new Users({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const warnBeforeLeave = ref(true)

const updateRequest = ref<UpdateUserRequest>({})

const {
	state: user,
	error,
	isLoading,
	execute
} = useAsyncState(async () => {
	const resp = await users.getUser(props.id)
	updateRequest.value.role = resp.data.role
	return resp.data
}, null)

onBeforeRouteLeave(() => {
	if (warnBeforeLeave.value && user.value?.role !== updateRequest.value.role) {
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
			users.updateUser(
				props.id,
				{
					role: updateRequest.value.role
				},
				useAuth(token.value)
			),
		() => {
			warnBeforeLeave.value = false
			router.push({ name: 'userView', params: { id: props.id } })
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
				Failed to fetch user: {{ errorResponse.status }}
				{{ errorResponse.error?.title ?? 'Unexpected error.' }}
			</p>
			<button @click="execute()" class="button">Reload</button>
		</div>

		<div v-else class="main-content">
			<h1>Update {{ user?.username }}</h1>

			<RouterLink
				class="back-link"
				:to="{ name: 'userView', params: { id } }"
				title="Changes will not be saved."
				>&lt; Back</RouterLink
			>

			<p v-if="updateError" class="error-text">{{ updateError }}</p>

			<form @submit.prevent="submit">
				<table>
					<tbody>
						<tr>
							<th>ID:</th>
							<td>{{ user?.id }}</td>
						</tr>
						<tr>
							<th>
								<label for="name">Name:</label>
							</th>
							<td>
								{{ user?.username }}
								<!--TODO: Add ability to update username in backend, then uncomment this line-->
								<!--<input v-model="updateRequest.username" id="name" />-->
							</td>
						</tr>
						<tr>
							<th>Created:</th>
							<td>{{ user?.createdAt }}</td>
						</tr>
						<tr>
							<th>Role:</th>
							<td v-if="user?.role === 'Administrator'">
								{{ user?.role }}
							</td>
							<td v-else>
								<select v-model="updateRequest.role">
									<option value="Banned">Banned</option>
									<option value="Confirmed">Confirmed</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<button
					:disabled="user?.role === 'Administrator'"
					:title="user?.role === 'Administrator' ? 'Can\'t edit admins.' : ''"
				>
					Save Changes
				</button>
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
</style>
