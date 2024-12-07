<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionToken } from '../composables/useSessionToken'
import { useUserDetails } from '../composables/useUserDetails'

const router = useRouter()
const token = useSessionToken()

function logoutClicked() {
	router.push({ name: 'home' })
	token.value = ''
}

const user = useUserDetails()
</script>

<template>
	<div class="navbar">
		<p class="title select-none">Leaderboards.gg Admin Panel</p>

		<div class="navbar-right">
			<p>Signed in as {{ user?.username }}</p>
			<button class="button log-out-button select-none" @click="logoutClicked">
				Log Out
			</button>
		</div>
	</div>
</template>

<style scoped>
.navbar {
	display: flex;
	height: 48px;
	background-color: green;
	padding: 8px;
	align-items: center;
	justify-content: space-between;
}

.navbar-right {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.log-out-button {
	height: 40px;
	margin-left: 1rem;
	display: flex;
	align-items: center;
}

.title {
	margin-left: 8px;
	line-height: unset;
}
</style>
