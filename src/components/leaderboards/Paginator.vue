<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	total: number
	limit: number
	page: number
}>()

const limits = [25, 50, 100]

const totalPages = computed(() => Math.ceil(props.total / props.limit))
</script>

<template>
	<div class="container">
		<form class="pageSelectorContainer" method="get">
			<input type="hidden" name="resultsPerPage" :value="props.limit" />
			<label for="goToPage">Go to:</label>
			<input
				id="goToPage"
				name="page"
				type="number"
				min="1"
				:max="totalPages"
			/>
			<button>Go</button>
		</form>
		<div class="pageContainer">
			<a
				v-if="props.page > 1"
				:href="`?resultsPerPage=${props.limit}&page=${props.page - 1}`"
			>
				<button>&laquo; Prev</button>
			</a>
			<template v-if="totalPages <= 7">
				<a
					v-for="page in totalPages"
					:href="`?resultsPerPage=${props.limit}&page=${page}`"
				>
					<button :disabled="props.page === page">{{ page }}</button>
				</a>
			</template>
			<template v-else-if="props.page <= 6">
				<a v-for="i in 6" :href="`?resultsPerPage=${props.limit}&page=${i}`">
					<button :disabled="i === props.page">{{ i }}</button>
				</a>
				<a :href="`?resultsPerPage=${props.limit}&page=${totalPages}`">
					<button>{{ totalPages }}</button>
				</a>
			</template>
			<template v-else-if="props.page >= totalPages - 5">
				<a :href="`?resultsPerPage=${props.limit}&page=1`">
					<button>1</button>
				</a>
				<a
					v-for="i in 6"
					:href="`?resultsPerPage=${props.limit}&page=${totalPages - 6 + i}`"
				>
					<button :disabled="props.page === totalPages - 6 + i">
						{{ totalPages - 6 + i }}
					</button>
				</a>
			</template>
			<template v-else>
				<a :href="`?resultsPerPage=${props.limit}&page=1`">
					<button>1</button>
				</a>
				<a
					v-for="i in 5"
					:href="`?resultsPerPage=${props.limit}&page=${props.page + i - 3}`"
				>
					<button :disabled="i === 3">
						{{ props.page + i - 3 }}
					</button>
				</a>
				<a :href="`?resultsPerPage=${props.limit}&page${totalPages}`">
					<button>
						{{ totalPages }}
					</button>
				</a>
			</template>
			<a
				v-if="props.page < totalPages"
				:href="`?resultsPerPage=${props.limit}&page=${props.page + 1}`"
			>
				<button>Next &raquo;</button>
			</a>
		</div>
		<select>
			<option v-for="limit in limits" value="limit">
				{{ limit }} per page
			</option>
		</select>
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
</style>
