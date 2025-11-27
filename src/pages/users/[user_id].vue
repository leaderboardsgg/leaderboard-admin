<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useApi } from '@/composables/useApi.ts'
import { useAuth } from '@/composables/useAuth.ts'
import { useSessionToken } from '@/composables/useSessionToken.ts'
import { ProblemDetails } from '@/lib/api/data-contracts.ts'
import { HttpResponse } from '@/lib/api/http-client.ts'
import { Users } from '@/lib/api/Users.ts'
import BaseButton from '@/components/base/BaseButton.vue'
import { useRoute } from 'vue-router'

const route = useRoute('/users/[user_id]')
const userId = route.params.user_id

const updateError = ref('')

const token = useSessionToken()

const users = new Users({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const {
	state: user,
	error,
	isLoading,
	execute
} = useAsyncState(async () => {
	const resp = await users.getUser(userId)
	return resp.data
}, null)

const errorResponse = computed(
	() => (error.value as HttpResponse<unknown, ProblemDetails>).error
)

async function revealBan() {
	if (confirm('Really ban this user? (This action can be reversed)')) {
		await useApi(
			() =>
				users.updateUser(userId, { role: 'Banned' }, useAuth(token.value)),
			() => execute(),
			(error) => {
				updateError.value = 'Failed to ban: ' + error.status
			}
		)
	}
}

async function revealUnban() {
	if (confirm('Really unban this user? (This action can be reversed)')) {
		await useApi(
			() =>
				users.updateUser(userId, { role: 'Confirmed' }, useAuth(token.value)),
			() => execute(),
			(error) => {
				updateError.value = 'Failed to unban: ' + error.status
			}
		)
	}
}
</script>

<template>
	<div class="container">
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="error" class="error-container">
			<p class="error-text">
				Failed to fetch user: {{ errorResponse.status }}
				{{ errorResponse.title }}
			</p>
			<button @click="execute()" class="button">Retry</button>
		</div>

		<div v-else class="main-content">
			<h1 class="title">Details for {{ user?.username }}</h1>

			<RouterLink class="back-link" :to="{ name: '/users/' }"
				>&lt; Back</RouterLink
			>
			<BaseButton
				v-if="user?.role === 'Confirmed'"
				color="delete"
				@click="revealBan"
			>
				Ban
			</BaseButton>
			<BaseButton
				v-else-if="user?.role === 'Banned'"
				class="secondary"
				@click="revealUnban"
			>
				Unban
			</BaseButton>

			<p v-if="updateError" class="error-text">{{ updateError }}</p>

			<table>
				<tbody>
					<tr>
						<th>ID:</th>
						<td>{{ user?.id }}</td>
					</tr>
					<tr>
						<th>Name:</th>
						<td>{{ user?.username }}</td>
					</tr>
					<tr>
						<th>Created:</th>
						<td>{{ user?.createdAt }}</td>
					</tr>
					<tr>
						<th>Role:</th>
						<td>{{ user?.role }}</td>
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

.error-text {
	grid-column: span 2 / span 2;
	color: crimson;
}
</style>
