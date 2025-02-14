<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useAuth } from '../../composables/useAuth'
import { useSessionToken } from '../../composables/useSessionToken'
import { Categories } from '../../lib/api/Categories'
import {
	CreateCategoryRequest,
	RunType,
	SortDirection
} from '../../lib/api/data-contracts'

const props = defineProps<{
	id: number
}>()

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
		() => categories.createCategory(props.id, request, useAuth(token.value)),
		({ data }) => {
			warnBeforeLeave.value = false
			router.push({ name: 'categoryView', params: { id: data.id } })
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
			:to="{ name: 'leaderboardView', params: { id: props.id } }"
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
							<input
								required
								pattern="[a-zA-Z0-9\-_]{2,80}"
								minlength="2"
								maxlength="80"
								v-model="createRequest.slug"
								id="slug"
								class="input"
							/>
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
