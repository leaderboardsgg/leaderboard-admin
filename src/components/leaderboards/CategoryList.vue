<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { Categories } from '../../lib/api/Categories'
import { ProblemDetails } from '../../lib/api/data-contracts'
import { HttpResponse } from '../../lib/api/http-client'

const props = defineProps<{
	id: number
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
} = useAsyncState(async () => {
	const resp = await categories.getCategoriesForLeaderboard({ id: props.id })
	return resp.data
}, null)
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
			<span>Categories:</span>
			<ul>
				<li v-for="cat in cats">
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
