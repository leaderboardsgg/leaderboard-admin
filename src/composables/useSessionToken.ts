import { useLocalStorage } from '@vueuse/core'

export function useSessionToken() {
	return useLocalStorage<string>('session', '')
}
