<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Main from './components/Main.vue'
</script>

<template>
	<div class="root">
		<Navbar />
		<Main />
	</div>
</template>

<style scoped>
.root {
	width: 100%;
}

.main-content {
	margin: 8px;
}
</style>
