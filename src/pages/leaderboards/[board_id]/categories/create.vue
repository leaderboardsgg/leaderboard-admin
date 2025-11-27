<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi.ts'
import { useAuth } from '@/composables/useAuth.ts'
import { useSessionToken } from '@/composables/useSessionToken.ts'
import { Categories } from '@/lib/api/Categories.ts'
import {
	CreateCategoryRequest,
	RunType,
	SortDirection
} from '@/lib/api/data-contracts.ts'
import Slug from '@/components/blocks/Slug.vue'

const route = useRoute('/leaderboards/[board_id]/categories/create')
const boardId = Number(route.params.board_id)

const token = useSessionToken()
const createError = ref('')
const router = useRouter()

const categories = new Categories({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const warnBeforeLeave = ref(true)

const createRequest = ref({
	name: '',
	slug: '',
	info: '',
	sortDirection: '',
	type: ''
})

onBeforeRouteLeave(() => {
	if (
		warnBeforeLeave.value &&
		(createRequest.value.name ||
			createRequest.value.slug ||
			createRequest.value.info ||
			createRequest.value.sortDirection ||
			createRequest.value.type)
	) {
		if (!window.confirm('Do you want to leave? You have unsaved changes.')) {
			return false
		}
	}
})

function submit() {
	// Form validation should cover invalid values
	const request: CreateCategoryRequest = {
		...createRequest.value,
		sortDirection: createRequest.value.sortDirection as SortDirection,
		type: createRequest.value.type as RunType
	}
	useApi(
		() => categories.createCategory(boardId, request, useAuth(token.value)),
		({ data }) => {
			warnBeforeLeave.value = false
			router.push({ name: '/leaderboards/[board_id]/categories/[cat_id]', params: { board_id: boardId, cat_id: data.id } })
		},
		(error) => {
			createError.value = 'Failed to create: ' + error.status.toString(10)
		}
	)
}
</script>

<template>
	<div class="container">
		<h1>Create Category</h1>
		<RouterLink
			class="back-link"
			:to="{ name: '/leaderboards/[board_id]', params: { board_id: boardId } }"
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
					<tr>
						<th>
							<label for="sort-direction">Sort Direction*:</label>
						</th>
						<td>
							<select
								id="sort-direction"
								v-model="createRequest.sortDirection"
								required
							>
								<option value="">---</option>
								<option value="Ascending">Ascending</option>
								<option value="Descending">Descending</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>
							<label for="run-type">Type*:</label>
						</th>
						<td>
							<select id="run-type" v-model="createRequest.type" required>
								<option value="">---</option>
								<option value="Score">Score</option>
								<option value="Time">Time</option>
							</select>
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
