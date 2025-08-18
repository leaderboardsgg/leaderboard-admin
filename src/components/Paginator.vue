<script setup lang="ts">
import { clamp } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
	total: number
}>()

const page = defineModel<number>('page', { required: true })
const limit = defineModel('limit', { default: 25 })
const limitOptions = Array.from(new Set([25, 50, 100].concat(limit.value))).sort((a, b) => a - b)
const totalPages = computed(() =>
	Math.max(Math.ceil(props.total / limit.value), 1)
)
page.value = clamp(page.value, 1, totalPages.value)

/**
 * We use arithmetic to calculate the first and last pagination buttons to
 * render that will include the current page, `page`, without also exceeding
 * how many pages we actually have. Also, we want to render the smaller of
 * seven buttons, or all possible pages.
 *
 * We first assume that we have at least seven pages in total, and that `page`
 * is in the middle. I.e. if we have exactly seven pages, `page` is 4.
 *
 * 1. We take 3 from `page` and add 3 to `page` into separate variables,
 *    `leftmost` and `rightmost`.
 * 2. We get the amount each variable exceeds the maximum possible bounds (1
 *    and `totalPages`) and save them to `vacantLeft` and `vacantRight`,
 *    respectively.
 * 3. `vacantLeft` and `vacantRight` are added to our new, biased center,
 *    `shifted`.
 * 4. We repeat step 1 on `shifted` to get `first` and `end`, and clamp
 *    them to 1 to `totalPages`, respectively.
 * 5. We calculate `length` to get the number of buttons we will render.
 *
 * E.g. if `page` is 1 and `totalPages` is 3, then:
 * - `vacantLeft` and `vacantRight` will be 2 and 1:
 * - `shifted` will be 2;
 * - `first` will be 1, after clamping from -1
 * - `end` will be 3, after clamping from 5
 * - `length` will be 3
 * I.e. we will render three buttons, for pages 1 through 3.
 *
 * We get to build the page buttons in constant time this way, instead of O(N)
 * with iterative methods. - zysim, thetedder
 */
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
				<option v-for="l in limitOptions" :value="l" :selected="l === limit" :key="l">
					{{ l }}
				</option>
			</select>
			<span>per page</span>
		</div>
		<slot></slot>
		<div class="pageContainer">
			<button :disabled="page === 1" class="button" @click="page -= 1">
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
			<button :disabled="page === totalPages" class="button" @click="page += 1">
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
