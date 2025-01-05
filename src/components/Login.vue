<script setup lang="ts">
import { computed, ref } from 'vue'
import { Account } from '../lib/api/Account'
import { LoginRequest } from '../lib/api/data-contracts'
import { useSessionToken } from '../composables/useSessionToken'
import { useUserDetails } from '../composables/useUserDetails'
import { useApi } from '../composables/useApi'

const email = ref('')
const password = ref('')
const loginError = ref(false)
const submitted = ref(false)
const token = useSessionToken()
const { state: user } = useUserDetails()
const loginFailed = computed(
	() =>
		loginError.value ||
		(submitted.value && user.value && user.value.role !== 'Administrator')
)

async function submit() {
	const request: LoginRequest = {
		email: email.value,
		password: password.value
	}

	await useApi(
		() =>
			new Account({
				baseUrl: import.meta.env.VITE_BACKEND_URL
			}).login(request),
		(success) => {
			token.value = success.data.token
			submitted.value = true
		},
		() => {
			submitted.value = false
			loginError.value = true
		}
	)
}
</script>

<template>
	<div class="loginContainer">
		<div>
			<h2>Admin Panel Login</h2>
			<form class="loginForm" @submit.prevent="submit">
				<label for="email">Email</label>
				<input v-model="email" id="email" type="text" autofocus />
				<label for="password">Password</label>
				<input v-model="password" id="password" type="password" />
				<input type="submit" value="Login" />
			</form>
		</div>
		<p class="errorText" v-if="loginFailed">Login failed</p>
	</div>
</template>

<style lang="css" scoped>
.loginContainer {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}

.loginForm {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
}

.loginForm input {
	margin-bottom: 1rem;
}

.errorText {
	color: crimson;
}
</style>
