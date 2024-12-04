export function useAuth(token: string) {
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
}
