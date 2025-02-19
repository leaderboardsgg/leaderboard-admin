<!-- Input field for slug management. -->
<script setup lang="ts">
const slug = defineModel<string | undefined>({ required: true })
</script>

<template>
	<input
		required
		pattern="[a-zA-Z0-9\-_]{2,80}"
		minlength="2"
		maxlength="80"
		v-bind="$attrs"
		v-model="slug"
	/>
</template>

<style lang="css" scoped>
/*  */
</style>
