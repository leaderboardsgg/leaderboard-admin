<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { ref, Ref, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useSessionToken } from '../../composables/useSessionToken'
import { UserRole } from '../../lib/api/data-contracts'
import { Users } from '../../lib/api/Users'
import Paginator from '../Paginator.vue'

const rolesQuery = useRouteQuery<string | string[] | undefined>('role')
const pageQuery = useRouteQuery('page', '1', { transform: Number })
const limitQuery = useRouteQuery<number | undefined>('resultsPerPage', undefined, { transform: Number })

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

	return allRoles.filter((r) => roles.includes(r))
}

const roles: Ref<UserRole[]> = ref(parseRolesFromQuery(rolesQuery.value))

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
				role: roles.value.join(',') || undefined,
				limit: limitQuery.value,
				offset: (pageQuery.value - 1) * (limitQuery.value ?? 0)
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
	},
)

const limit = ref(limitQuery.value ?? users.value.limitDefault)

watch(pageQuery, () => execute())
watch(limit, () => {
	limitQuery.value = limit.value
	execute()
})
watch(roles, () => {
	rolesQuery.value = roles.value
	pageQuery.value = 1
	execute()
})
</script>

<template>
	<div class="container">
		<h1>Users</h1>
		<div class="role-change-container">
			<label class="label" for="roles">Filter roles:</label>
			<select id="roles" v-model="roles" name="role" class="input" multiple>
				<option value="Administrator">Admin</option>
				<option value="Registered">Registered</option>
				<option value="Confirmed">Confirmed</option>
				<option value="Banned">Banned</option>
			</select>
		</div>

		<div v-if="isLoading">Loading...</div>

		<div v-else-if="error" class="error-container">
			<p>An error occurred.</p>
			<button @click="() => execute()" class="retry-button">Retry</button>
		</div>

		<div v-else>
			<Paginator
				:total="users.total"
				v-model:limit="limit"
				v-model:page="pageQuery"
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

.role-change-container {
	align-self: flex-end;
	display: flex;
	gap: 1rem;
	align-items: flex-start;
}

.role-change-container .label {
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
