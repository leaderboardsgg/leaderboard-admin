import type { HttpResponse } from '../lib/api/http-client'

export async function useApi<D, E, T extends Promise<HttpResponse<D, E>>>(
	act: () => T,
	onSuccess: (data: Omit<Awaited<T>, 'error'>) => unknown,
	onError: (error: Omit<Awaited<T>, 'data'>) => unknown,
) {
	try {
		const response = await act()
		onSuccess(response)
	} catch (error) {
		onError(error as Omit<Awaited<T>, 'data'>)
	}
}
