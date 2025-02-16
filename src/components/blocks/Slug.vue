<!-- Input field for slug management. -->
<script setup lang="ts">
const props = defineProps<{
	request: Partial<{ slug: string }>
}>()
</script>

<template>
	<input
		required
		pattern="[a-zA-Z0-9\-_]{2,80}"
		minlength="2"
		maxlength="80"
		v-bind="$attrs"
		v-model="props.request.slug"
	/>
</template>

<style lang="css" scoped>
/*  */
</style>
