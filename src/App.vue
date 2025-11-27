<script setup lang="ts">
import { computed } from 'vue'
import Login from '@/components/Login.vue'
import Navbar from '@/components/Navbar.vue'
import { useUserDetails } from '@/composables/useUserDetails'

const { state, isLoading, isReady } = useUserDetails()
const loggedIn = computed(() => state.value?.role === 'Administrator')
</script>

<template>
	<div class="root">
		<Teleport to="body" v-if="isLoading">
			<div class="loader"><p>Loading...</p></div>
		</Teleport>
		<div v-show="isReady">
			<template v-if="loggedIn">
				<Navbar />
				<RouterView />
			</template>
			<Login v-else />
		</div>
	</div>
</template>

<style scoped>
.root {
	width: 100%;
}

.loader {
	position: fixed;
	z-index: 999;
	top: 45%;
	left: 50%;
	padding: 1rem;
	background-color: black;
}
</style>
