<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { computed, watch } from 'vue'
import { Categories } from '../../lib/api/Categories'
import { ProblemDetails } from '../../lib/api/data-contracts'
import { HttpResponse } from '../../lib/api/http-client'
import Paginator from '../Paginator.vue'

const props = defineProps<{
	leaderboardId: number
}>()

const pageQuery = useRouteQuery('page', '1', { transform: Number })
const limitQuery = useRouteQuery('resultsPerPage', '25', { transform: Number })

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
			id: props.leaderboardId,
			limit: limitQuery.value,
			offset: (pageQuery.value - 1) * (limitQuery.value ?? 0)
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

watch([limitQuery, pageQuery], () => execute())
</script>

<template>
	<div>
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="error">
			<p class="error-text">
				Failed to fetch categories: {{ errorResponse }}
				{{ errorResponse.title }}
			</p>
			<button @click="execute()" class="button">Retry</button>
		</div>

		<div v-else>
			<Paginator
				v-model:limit="limitQuery"
				:total="cats.total"
				v-model:page="pageQuery"
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
