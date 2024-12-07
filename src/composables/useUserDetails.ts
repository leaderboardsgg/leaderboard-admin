import { shallowRef, watchEffect } from 'vue'
import { Users } from '../lib/api/Users'
import type { UserViewModel } from '../lib/api/data-contracts'
import { useAuth } from './useAuth'
import { useSessionToken } from './useSessionToken'

export function useUserDetails() {
	const userDetails = shallowRef<UserViewModel | null>(null)
	const token = useSessionToken()

	watchEffect(async () => {
		if (!token.value) {
			userDetails.value = null
			return
		}

		const users = new Users({
			baseUrl: import.meta.env.VITE_BACKEND_URL,
		})

		const me = await users.me(useAuth(token.value))
		userDetails.value = me.data
	})

	return userDetails
}
