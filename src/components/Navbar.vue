<script setup lang="ts">
import { useSessionToken } from '../composables/useSessionToken'

function logoutClicked() {
	useSessionToken().value = ''
}
</script>

<template>
	<div class="navbar">
		<p class="title select-none">Leaderboards.gg Admin Panel</p>

		<button class="button log-out-button select-none" @click="logoutClicked">
			Log Out
		</button>
	</div>
</template>

<style scoped>
.navbar {
	display: flex;
	height: 48px;
	background-color: green;
	padding: 8px;
	align-items: center;
	justify-content: center;
}

.log-out-button {
	display: flex;
	height: 40px;

	margin-left: auto;
	align-items: center;
	justify-content: center;
}

.title {
	display: flex;
	margin-left: 8px;
	align-items: center;
	justify-content: center;
	line-height: unset;
}
</style>
