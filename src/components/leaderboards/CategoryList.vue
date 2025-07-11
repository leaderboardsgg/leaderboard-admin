<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { Categories } from '../../lib/api/Categories'
import { ProblemDetails } from '../../lib/api/data-contracts'
import { HttpResponse } from '../../lib/api/http-client'
import Paginator from './Paginator.vue'

const props = defineProps<{
	id: number
	limit: number | undefined
	page: number
}>()

const categories = new Categories({
	baseUrl: import.meta.env.VITE_BACKEND_URL
})

const errorResponse = computed(
	() => (error.value as HttpResponse<unknown, ProblemDetails>).error
)

const {
	state: cats,
	error,
	isLoading,
	execute
} = useAsyncState(
	async () => {
		const resp = await categories.getCategoriesForLeaderboard({
			id: props.id,
			limit: props.limit,
			offset: (props.page - 1) * (props.limit ?? 0)
		})
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
	<div>
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="error">
			<p class="error-text">
				Failed to fetch categories: {{ errorResponse.status }}
				{{ errorResponse.title }}
			</p>
			<button @click="execute()" class="button">Retry</button>
		</div>

		<div v-else>
			<Paginator
				:limit="props.limit ?? cats.limitDefault"
				:total="cats.total"
				:page="props.page"
			/>
			<span>Categories:</span>
			<ul>
				<li v-for="cat in cats.data">
					<RouterLink :to="{ name: 'categoryView', params: { id: cat.id } }">{{
						cat.name
					}}</RouterLink>
					({{ cat.slug }})
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="css" scoped>
.container {
	display: flex;
}

.error-text {
	color: crimson;
}
</style>
