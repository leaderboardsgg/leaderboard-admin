<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	total: number
	limit: number
	page: number
}>()

const limits = [25, 50, 100]
	.filter((l) => l < props.limit)
	.concat(props.limit, ...[25, 50, 100].filter((l) => l > props.limit))

const limit = props.limit

const totalPages = computed(() => Math.ceil(props.total / props.limit))

function updateLimits() {
	const search = new URLSearchParams(location.search)
	search.set('resultsPerPage', limit.toString(10))
	location.search = search.toString()
}
</script>

<template>
	<div class="container">
		<form class="pageSelectorContainer">
			<input type="hidden" name="resultsPerPage" :value="props.limit" />
			<label for="goToPage">Go to page:</label>
			<input
				id="goToPage"
				name="page"
				class="goToPage"
				type="number"
				min="1"
				:max="totalPages"
			/>
			<button class="button">Go</button>
		</form>
		<div class="pageContainer">
			<a
				v-if="props.page > 1"
				:href="`?resultsPerPage=${props.limit}&page=${props.page - 1}`"
				tabindex="-1"
			>
				<button class="button">&laquo; Prev</button>
			</a>
			<template v-if="totalPages <= 7">
				<a
					v-for="page in totalPages"
					:href="`?resultsPerPage=${props.limit}&page=${page}`"
					tabindex="-1"
				>
					<button class="button" :disabled="props.page === page">
						{{ page }}
					</button>
				</a>
			</template>
			<template v-else-if="props.page <= 6">
				<a
					v-for="i in 6"
					:href="`?resultsPerPage=${props.limit}&page=${i}`"
					tabindex="-1"
				>
					<button class="button" :disabled="i === props.page">{{ i }}</button>
				</a>
				<a
					:href="`?resultsPerPage=${props.limit}&page=${totalPages}`"
					tabindex="-1"
				>
					<button class="button">{{ totalPages }}</button>
				</a>
			</template>
			<template v-else-if="props.page >= totalPages - 5">
				<a :href="`?resultsPerPage=${props.limit}&page=1`" tabindex="-1">
					<button class="button">1</button>
				</a>
				<a
					v-for="i in 6"
					:href="`?resultsPerPage=${props.limit}&page=${totalPages - 6 + i}`"
					tabindex="-1"
				>
					<button class="button" :disabled="props.page === totalPages - 6 + i">
						{{ totalPages - 6 + i }}
					</button>
				</a>
			</template>
			<template v-else>
				<a :href="`?resultsPerPage=${props.limit}&page=1`" tabindex="-1">
					<button class="button">1</button>
				</a>
				<a
					v-for="i in 5"
					:href="`?resultsPerPage=${props.limit}&page=${props.page + i - 3}`"
					tabindex="-1"
				>
					<button class="button" :disabled="i === 3">
						{{ props.page + i - 3 }}
					</button>
				</a>
				<a
					:href="`?resultsPerPage=${props.limit}&page${totalPages}`"
					tabindex="-1"
				>
					<button class="button">
						{{ totalPages }}
					</button>
				</a>
			</template>
			<a
				v-if="props.page < totalPages"
				:href="`?resultsPerPage=${props.limit}&page=${props.page + 1}`"
				tabindex="-1"
			>
				<button class="button">Next &raquo;</button>
			</a>
		</div>
		<div class="resultsPerPageContainer">
			<label for="resultsPerPage">Show</label>
			<select
				v-model="limit"
				id="resultsPerPage"
				name="resultsPerPage"
				class="resultsPerPage"
				@change="updateLimits"
			>
				<option
					v-for="limit in limits"
					:value="limit"
					:selected="props.limit === limit"
				>
					{{ limit }}
				</option>
			</select>
			<span>per page</span>
		</div>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.pageSelectorContainer {
	display: flex;
	flex-direction: row;
	gap: 1rem;
	justify-content: space-between;
	align-items: center;
}

.pageContainer {
	display: flex;
	flex-direction: row;
	gap: 0.4rem;
	justify-content: space-between;
	align-items: center;
}

.goToPage {
	padding: 0.5rem 0.2rem;
}

.resultsPerPageContainer {
	display: flex;
	align-items: center;
	gap: 0.6rem;
}

.resultsPerPage {
	padding: 0.5rem 0.2rem;
}
</style>
