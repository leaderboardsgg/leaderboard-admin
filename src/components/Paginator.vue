<script setup lang="ts">
import { clamp } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
	total: number
}>()

const page = defineModel<number>('page', { required: true })
const limits = [25, 50, 100]
const limit = defineModel('limit', { default: 25 })
const totalPages = computed(() =>
	Math.max(Math.ceil(props.total / limit.value), 1)
)
page.value = clamp(page.value, 1, totalPages.value)

const leftmost = page.value - 3
const vacantLeft = Math.max(leftmost, 1) - leftmost
const rightmost = page.value + 3
const vacantRight = rightmost - Math.min(rightmost, totalPages.value)
const shifted = page.value + vacantLeft - vacantRight
const first = Math.max(shifted - 3, 1)
const end = Math.min(shifted + 3, totalPages.value)
const length = end - first + 1
</script>

<template>
	<div class="container">
		<div class="resultsPerPageContainer">
			<label for="resultsPerPage">Show</label>
			<select
				v-model="limit"
				id="resultsPerPage"
				name="resultsPerPage"
				class="resultsPerPage"
			>
				<option v-for="l in limits" :value="l" :selected="l === limit" :key="l">
					{{ l }}
				</option>
			</select>
			<span>per page</span>
		</div>
		<slot></slot>
		<div class="pageContainer">
			<button v-if="page > 1" class="button" @click="page -= 1">
				&laquo; Prev
			</button>
			<button
				v-for="i in length"
				class="button"
				@click="page = first + i - 1"
				:disabled="first + i - 1 === page"
				:key="i"
			>
				{{ first + i - 1 }}
			</button>
			<button v-if="page < totalPages" class="button" @click="page += 1">
				Next &raquo;
			</button>
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
