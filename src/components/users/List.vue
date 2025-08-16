<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref, Ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useSessionToken } from '../../composables/useSessionToken'
import { Users } from '../../lib/api/Users'
import Paginator from '../leaderboards/Paginator.vue'
import { UserRole } from '../../lib/api/data-contracts'

const props = defineProps<{
	limit: number | undefined
	page: number
	roles: string | string[] | undefined
}>()

const allRoles: UserRole[] = [
	'Administrator',
	'Banned',
	'Confirmed',
	'Registered'
]

function parseRolesFromQuery(roles: string | string[] | undefined): UserRole[] {
	if (roles === undefined) {
		return []
	}

	if (typeof roles === 'string') {
		return allRoles.filter((role) => role === roles)
	}

	const r: Set<UserRole> = new Set(allRoles.filter((r) => roles.includes(r)))

	return Array.from(r.values())
}

const roles: Ref<UserRole[]> = ref(parseRolesFromQuery(props.roles))

const userClient = new Users({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const token = useSessionToken()

const {
	state: users,
	error,
	isLoading,
	execute
} = useAsyncState(
	async () => {
		const resp = await userClient.listUsers(
			{
				// @ts-ignore The query param accepts a comma-separated list of roles,
				// which is something the generated contract can't feasibly make types
				// for - zysim
				role: roles.value.length > 0 ? roles.value.join(',') : undefined,
				limit: props.limit,
				offset: (props.page - 1) * (props.limit ?? 0)
			},
			useAuth(token.value)
		)

		return resp.data
	},
	{
		data: [],
		limitDefault: 0,
		limitMax: 0,
		total: 0
	}
)
</script>

<template>
	<div class="container">
		<h1>Users</h1>
		<form class="input-container">
			<input hidden name="resultsPerPage" :value="props.limit" />
			<input hidden name="page" :value="props.page" />
			<label class="label" for="roles">Filter roles:</label>
			<select id="roles" v-model="roles" name="role" class="input" multiple>
				<option value="Administrator">Admin</option>
				<option value="Registered">Registered</option>
				<option value="Confirmed">Confirmed</option>
				<option value="Banned">Banned</option>
			</select>
			<button class="button">Filter</button>
		</form>

		<div v-if="isLoading">Loading...</div>

		<div v-else-if="error" class="error-container">
			<p>An error occurred.</p>
			<button @click="() => execute()" class="retry-button">Retry</button>
		</div>

		<div v-else>
			<Paginator
				:total="users.total"
				:limit="limit ?? users.limitDefault"
				:page="page"
			/>
			<div v-if="users.total === 0">
				No users found with the applied filters.
			</div>
			<ul v-else>
				<li v-for="user in users.data" :key="user.id">
					<RouterLink
						:to="{ name: 'userView', params: { id: user.id } }"
						:class="{ dull: user.role === 'Banned' }"
					>
						{{ user.username }}
					</RouterLink>
				</li>
			</ul>
			<Paginator
				:total="users.total"
				:limit="limit ?? users.limitDefault"
				:page="page"
			/>
		</div>
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

.input-container {
	align-self: flex-end;
	display: flex;
	gap: 1rem;
	align-items: flex-start;
}

.input-container .label {
	margin-top: 0.4rem;
}

.input {
	padding: 0.5rem;
}

.error-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.retry-button {
	align-self: start;
	padding: 1rem;
}

.dull {
	color: grey;
}
</style>
