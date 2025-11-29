import { createGlobalState, useAsyncState } from '@vueuse/core'
import { watchEffect } from 'vue'
import { Users } from '@/lib/api/Users'
import { useAuth } from '@/composables/useAuth'
import { useSessionToken } from '@/composables/useSessionToken'

export const useUserDetails = createGlobalState(() => {
	const users = new Users({
		baseUrl: import.meta.env.VITE_BACKEND_URL,
	})

	const token = useSessionToken()

	const state = useAsyncState(
		async (authToken: string) => {
			if (!authToken) {
				return null
			}

			const res = await users.me(useAuth(authToken))
			return res.data
		},
		null,
		{
			immediate: false,
			resetOnExecute: false,
			onError: () => {
				token.value = ''
			},
		},
	)

	watchEffect(() => state.execute(0, token.value))

	return state
})
