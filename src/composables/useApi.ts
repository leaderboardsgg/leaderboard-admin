import type { HttpResponse } from '../lib/api/http-client'

type SuccessResponse<T> = Omit<HttpResponse<T, unknown>, 'error'>
type ErrorResponse<T> = Omit<HttpResponse<unknown, T>, 'data'>

export async function useApi<D, E>(
	act: () => Promise<HttpResponse<D, E>>,
	onSuccess: (data: SuccessResponse<D>) => unknown,
	onError: (error: ErrorResponse<E>) => unknown,
) {
	try {
		const response = await act()
		onSuccess(response)
	} catch (error) {
		onError(error as ErrorResponse<E>)
	}
}
