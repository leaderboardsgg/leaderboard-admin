<script setup lang="ts">
import { computed, ref } from 'vue'
import { Account } from '../lib/api/Account'
import {
	LoginRequest,
	ValidationProblemDetails
} from '../lib/api/data-contracts'
import { useSessionToken } from '../composables/useSessionToken'
import { useUserDetails } from '../composables/useUserDetails'
import { useApi } from '../composables/useApi'

const email = ref('')
const password = ref('')
const errorText = ref('')
const submitted = ref(false)
const token = useSessionToken()
const user = useUserDetails()
const nonAdminLogin = computed(
	() =>
		submitted.value &&
		token.value &&
		user.value &&
		user.value.role !== 'Administrator'
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
		(error) => {
			submitted.value = false

			switch (error.status) {
				case 401:
					errorText.value = 'Incorrect password'
					break

				case 403:
					errorText.value = 'User banned'
					break

				case 404:
					errorText.value = 'User not found'
					break

				case 422:
					const validationProblemDetails =
						error.error as ValidationProblemDetails
					errorText.value = validationProblemDetails.title || ''
					break

				case 500:
					errorText.value = 'Server error'
					break

				default:
					errorText.value = 'Unknown error'
					break
			}
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
				<input v-model="email" id="email" type="text" />
				<label for="password">Password</label>
				<input v-model="password" id="password" type="password" />
				<input type="submit" value="Login" />
			</form>
		</div>
		<p class="errorText">
			{{ nonAdminLogin ? 'Must be Admin to log in' : errorText }}
		</p>
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
