<script setup lang="ts">
const props = defineProps<{
	show: boolean,
}>()
</script>

<template>
	<Teleport to="body" v-if="props.show">
		<div class="container" @click.self="$emit('hide')">
			<slot></slot>
		</div>
	</Teleport>
</template>

<style lang="css" scoped>
	.container {
		position: fixed;
		inset: 0;
		z-index: 999;
		backdrop-filter: blur(5px);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
