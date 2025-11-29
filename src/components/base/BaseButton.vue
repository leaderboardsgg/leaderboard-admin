<script setup lang="ts">
const { color = 'primary', variant = 'solid', disabled = false, size = 'sm' } = defineProps<{
	color?: 'primary' | 'secondary' | 'delete'
	variant?: 'solid' | 'outline',
	disabled?: boolean,
	size?: 'sm' | 'full'
}>()
</script>

<template>
	<button
		:class="[color, variant, size]"
		:disabled="disabled"
	>
		<slot />
	</button>
</template>

<style scoped lang="postcss">
button {
	-webkit-appearance: none;
	border-radius: 0;
	text-align: center;
	background: none;
	box-shadow: none;
	padding: .75rem 2rem;
	cursor: pointer;
	border: none;
	color: inherit;
	font: inherit;
	min-width: 3rem;

	--primary-color: #007bff;
	--secondary-color: #6c757d;
	--delete-color: crimson;
}

.primary {
	--button-color: var(--primary-color);
}

.secondary {
	--button-color: var(--secondary-color);
}

.delete {
	--button-color: var(--delete-color);
}

.outline {
	background-color: transparent;
	color: var(--button-color);
	border: 2px solid var(--button-color);
}

.solid {
	background-color: var(--button-color);
	color: white;
}

.sm {
	max-width: 12rem;
}
</style>
