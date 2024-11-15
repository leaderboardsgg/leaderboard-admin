/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Represents a `Category` tied to a `Leaderboard`. */
export interface CategoryViewModel {
	/**
	 * The unique identifier of the `Category`.
	 * @format int64
	 */
	id: number
	/**
	 * The display name of the `Category`.
	 * @example "Foo Bar Baz%"
	 */
	name: string
	/**
	 * The URL-scoped unique identifier of the `Category`.
	 * @example "foo-bar-baz"
	 */
	slug: string
	/**
	 * Information pertaining to the `Category`.
	 * @example "Video proof is required."
	 */
	info: string | null
	type: RunType
	sortDirection: SortDirection
	/**
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	createdAt: string
	/**
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	updatedAt: string | null
	/**
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	deletedAt: string | null
}

export interface ChangePasswordRequest {
	/** @minLength 1 */
	password: string
}

/** This request object is sent when creating a `Category`. */
export interface CreateCategoryRequest {
	/**
	 * The display name of the `Category`.
	 * @example "Foo Bar Baz%"
	 */
	name: string
	/**
	 * The URL-scoped unique identifier of the `Category`.
	 *
	 * Must be [2, 25] in length and consist only of alphanumeric characters and hyphens.
	 * @example "foo-bar-baz"
	 */
	slug: string
	/**
	 * Information pertaining to the `Category`.
	 * @example "Video proof is required."
	 */
	info: string | null
	/**
	 * The ID of the `Leaderboard` the `Category` is a part of.
	 * @format int64
	 */
	leaderboardId: number
	sortDirection: SortDirection
	type: RunType
}

/** This request object is sent when creating a `Leaderboard`. */
export interface CreateLeaderboardRequest {
	/**
	 * The display name of the `Leaderboard` to create.
	 * @minLength 1
	 * @example "Foo Bar"
	 */
	name: string
	/**
	 * The URL-scoped unique identifier of the `Leaderboard`.
	 *
	 * Must be [2, 80] in length and consist only of alphanumeric characters and hyphens.
	 * @minLength 1
	 * @example "foo-bar"
	 */
	slug: string
	info?: string
}

/** This request object is sent when creating a `Run`. */
export interface CreateRunRequest {
	info: string | null
	/**
	 * The date the `Run` was played on.
	 * @format date
	 * @example "2000-01-01"
	 */
	playedOn: string
	/**
	 * The ID of the `Category` for the `Run`.
	 * @format int64
	 */
	categoryId: number
	/** @format int64 */
	timeOrScore: number
}

/** Represents a collection of `Leaderboard` entities. */
export interface LeaderboardViewModel {
	/**
	 * The unique identifier of the `Leaderboard`.
	 *
	 * Generated on creation.
	 * @format int64
	 */
	id: number
	/**
	 * The display name of the `Leaderboard` to create.
	 * @example "Foo Bar"
	 */
	name: string
	/**
	 * The URL-scoped unique identifier of the `Leaderboard`.
	 *
	 * Must be [2, 80] in length and consist only of alphanumeric characters and hyphens.
	 * @example "foo-bar"
	 */
	slug: string
	/**
	 * The general information for the Leaderboard.
	 * @example "Timer starts on selecting New Game and ends when the final boss is beaten."
	 */
	info: string
	/**
	 * The time the Leaderboard was created.
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	createdAt: string
	/**
	 * The last time the Leaderboard was updated or null.
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	updatedAt: string | null
	/**
	 * The time at which the Leaderboard was deleted, or null if the Leaderboard has not been deleted.
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	deletedAt: string | null
	/** A collection of `Category` entities for the `Leaderboard`. */
	categories: CategoryViewModel[]
}

/** This request object is sent when a `User` is attempting to log in. */
export interface LoginRequest {
	/**
	 * The `User`'s email address.
	 * @format email
	 * @minLength 1
	 * @example "john.doe@example.com"
	 */
	email: string
	/**
	 * The `User`'s password. It:
	 * <ul><li>supports Unicode;</li><li>must be [8, 80] in length;</li><li>must have at least:</li><ul><li>one uppercase letter;</li><li>one lowercase letter; and</li><li>one number.</li></ul></ul>
	 * @minLength 1
	 * @example "P4ssword"
	 */
	password: string
}

/** This response object is received upon a successful log-in request. */
export interface LoginResponse {
	/**
	 * A JSON Web Token to authenticate and authorize queries with.
	 * @minLength 1
	 */
	token: string
}

export interface ProblemDetails {
	type?: string | null
	title?: string | null
	/** @format int32 */
	status?: number | null
	detail?: string | null
	instance?: string | null
	[key: string]: any
}

export interface RecoverAccountRequest {
	/**
	 * The user's name.
	 * @minLength 1
	 */
	username: string
	/**
	 * The user's email address.
	 * @format email
	 * @minLength 1
	 */
	email: string
}

/** This request object is sent when a `User` is attempting to register. */
export interface RegisterRequest {
	/**
	 * The username of the `User`. It:
	 * <ul><li>must be [2, 25] in length;</li><li>must be made up of letters sandwiching zero or one of:</li><ul><li>hyphen;</li><li>underscore; or</li><li>apostrophe</li></ul></ul>
	 * Usernames are saved case-sensitively, but matched against case-insensitively.
	 * A `User` may not register with the name 'Cool' when another `User` with the name 'cool'
	 * exists.
	 * @minLength 1
	 * @example "J'on-Doe"
	 */
	username: string
	/**
	 * The `User`'s email address.
	 * @minLength 1
	 * @example "john.doe@example.com"
	 */
	email: string
	/**
	 * The `User`'s password. It:
	 * <ul><li>supports Unicode;</li><li>must be [8, 80] in length;</li><li>must have at least:</li><ul><li>one uppercase letter;</li><li>one lowercase letter; and</li><li>one number.</li></ul></ul>
	 * @minLength 1
	 * @example "P4ssword"
	 */
	password: string
}

export enum RunType {
	Time = 'Time',
	Score = 'Score'
}

export type RunViewModel = BaseRunViewModel &
	(
		| BaseRunViewModelTypeMapping<'Time', TimedRunViewModel>
		| BaseRunViewModelTypeMapping<'Score', ScoredRunViewModel>
	)

export type ScoredRunViewModel = BaseRunViewModel & {
	/**
	 * The score achieved during the run.
	 * @format int64
	 */
	score: number
}

export enum SortDirection {
	Ascending = 'Ascending',
	Descending = 'Descending'
}

export type TimedRunViewModel = BaseRunViewModel & {
	/**
	 * The duration of the run.
	 * @example "25:01:01.001"
	 */
	time: string
}

export interface UpdateLeaderboardRequest {
	name?: string
	slug?: string
	info?: string
}

export enum UserRole {
	Registered = 'Registered',
	Confirmed = 'Confirmed',
	Administrator = 'Administrator',
	Banned = 'Banned'
}

export interface UserViewModel {
	/**
	 * The unique identifier of the `User`.
	 *
	 * Generated on creation.
	 * @pattern ^[a-zA-Z0-9-_]{22}$
	 */
	id: string
	/**
	 * The username of the `User`. It:
	 * <ul><li>must be [2, 25] in length;</li><li>must be made up of alphanumeric characters around zero or one of:</li><ul><li>hyphen;</li><li>underscore; or</li><li>apostrophe</li></ul></ul>
	 * Usernames are saved case-sensitively, but matcehd against case-insensitively.
	 * A `User` may not register with the name 'Cool' when another `User` with the name 'cool'
	 * exists.
	 * @example "J'on-Doe"
	 */
	username: string
	role: UserRole
	/**
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	createdAt: string
}

export interface ValidationProblemDetails {
	type?: string | null
	title?: string | null
	/** @format int32 */
	status?: number | null
	detail?: string | null
	instance?: string | null
	errors?: Record<string, string[]>
	[key: string]: any
}

interface BaseRunViewModel {
	$type: string
	/**
	 * The unique identifier of the `Run`.
	 *
	 * Generated on creation.
	 * @pattern ^[a-zA-Z0-9-_]{22}$
	 */
	id: string
	/** User-provided details about the run. */
	info: string | null
	/**
	 * The time the run was created.
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	createdAt: string
	/**
	 * The last time the run was updated or null.
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	updatedAt: string | null
	/**
	 * The time at which the run was deleted, or null if the run has not been deleted.
	 * @format date-time
	 * @example "1984-01-01T00:00:00Z"
	 */
	deletedAt: string | null
	/**
	 * The ID of the `Category` for `Run`.
	 * @format int64
	 */
	categoryId: number
	/**
	 * The ID of the LeaderboardBackend.Models.Entities.User who submitted this run.
	 * @pattern ^[a-zA-Z0-9-_]{22}$
	 */
	userId: string
}

type BaseRunViewModelTypeMapping<Key, Type> = {
	$type: Key
} & Type

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean
	/** request path */
	path: string
	/** content type of request body */
	type?: ContentType
	/** query params */
	query?: QueryParamsType
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseFormat
	/** request body */
	body?: unknown
	/** base url */
	baseUrl?: string
	/** request cancellation token */
	cancelToken?: CancelToken
}

export type RequestParams = Omit<
	FullRequestParams,
	'body' | 'method' | 'query' | 'path'
>

export interface ApiConfig<SecurityDataType = unknown> {
	baseUrl?: string
	baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<RequestParams | void> | RequestParams | void
	customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
	extends Response {
	data: D
	error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
	public baseUrl: string = ''
	private securityData: SecurityDataType | null = null
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
	private abortControllers = new Map<CancelToken, AbortController>()
	private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
		fetch(...fetchParams)

	private baseApiParams: RequestParams = {
		credentials: 'same-origin',
		headers: {},
		redirect: 'follow',
		referrerPolicy: 'no-referrer'
	}

	constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
		Object.assign(this, apiConfig)
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data
	}

	protected encodeQueryParam(key: string, value: any) {
		const encodedKey = encodeURIComponent(key)
		return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
	}

	protected addQueryParam(query: QueryParamsType, key: string) {
		return this.encodeQueryParam(key, query[key])
	}

	protected addArrayQueryParam(query: QueryParamsType, key: string) {
		const value = query[key]
		return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
	}

	protected toQueryString(rawQuery?: QueryParamsType): string {
		const query = rawQuery || {}
		const keys = Object.keys(query).filter(
			(key) => 'undefined' !== typeof query[key]
		)
		return keys
			.map((key) =>
				Array.isArray(query[key])
					? this.addArrayQueryParam(query, key)
					: this.addQueryParam(query, key)
			)
			.join('&')
	}

	protected addQueryParams(rawQuery?: QueryParamsType): string {
		const queryString = this.toQueryString(rawQuery)
		return queryString ? `?${queryString}` : ''
	}

	private contentFormatters: Record<ContentType, (input: any) => any> = {
		[ContentType.Json]: (input: any) =>
			input !== null && (typeof input === 'object' || typeof input === 'string')
				? JSON.stringify(input)
				: input,
		[ContentType.Text]: (input: any) =>
			input !== null && typeof input !== 'string'
				? JSON.stringify(input)
				: input,
		[ContentType.FormData]: (input: any) =>
			Object.keys(input || {}).reduce((formData, key) => {
				const property = input[key]
				formData.append(
					key,
					property instanceof Blob
						? property
						: typeof property === 'object' && property !== null
							? JSON.stringify(property)
							: `${property}`
				)
				return formData
			}, new FormData()),
		[ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
	}

	protected mergeRequestParams(
		params1: RequestParams,
		params2?: RequestParams
	): RequestParams {
		return {
			...this.baseApiParams,
			...params1,
			...(params2 || {}),
			headers: {
				...(this.baseApiParams.headers || {}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {})
			}
		}
	}

	protected createAbortSignal = (
		cancelToken: CancelToken
	): AbortSignal | undefined => {
		if (this.abortControllers.has(cancelToken)) {
			const abortController = this.abortControllers.get(cancelToken)
			if (abortController) {
				return abortController.signal
			}
			return void 0
		}

		const abortController = new AbortController()
		this.abortControllers.set(cancelToken, abortController)
		return abortController.signal
	}

	public abortRequest = (cancelToken: CancelToken) => {
		const abortController = this.abortControllers.get(cancelToken)

		if (abortController) {
			abortController.abort()
			this.abortControllers.delete(cancelToken)
		}
	}

	public request = async <T = any, E = any>({
		body,
		secure,
		path,
		type,
		query,
		format,
		baseUrl,
		cancelToken,
		...params
	}: FullRequestParams): Promise<HttpResponse<T, E>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{}
		const requestParams = this.mergeRequestParams(params, secureParams)
		const queryString = query && this.toQueryString(query)
		const payloadFormatter = this.contentFormatters[type || ContentType.Json]
		const responseFormat = format || requestParams.format

		return this.customFetch(
			`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
			{
				...requestParams,
				headers: {
					...(requestParams.headers || {}),
					...(type && type !== ContentType.FormData
						? { 'Content-Type': type }
						: {})
				},
				signal:
					(cancelToken
						? this.createAbortSignal(cancelToken)
						: requestParams.signal) || null,
				body:
					typeof body === 'undefined' || body === null
						? null
						: payloadFormatter(body)
			}
		).then(async (response) => {
			const r = response.clone() as HttpResponse<T, E>
			r.data = null as unknown as T
			r.error = null as unknown as E

			const data = !responseFormat
				? r
				: await response[responseFormat]()
						.then((data) => {
							if (r.ok) {
								r.data = data
							} else {
								r.error = data
							}
							return r
						})
						.catch((e) => {
							r.error = e
							return r
						})

			if (cancelToken) {
				this.abortControllers.delete(cancelToken)
			}

			if (!response.ok) throw data
			return data
		})
	}
}

/**
 * @title LeaderboardBackend
 * @version v1
 */
export class Api<
	SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
	account = {
		/**
		 * No description
		 *
		 * @tags Account
		 * @name Register
		 * @summary Registers a new User.
		 * @request POST:/Account/register
		 * @secure
		 */
		register: (data: RegisterRequest, params: RequestParams = {}) =>
			this.request<
				UserViewModel,
				ProblemDetails | ValidationProblemDetails | void
			>({
				path: `/Account/register`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name ResendConfirmationEmail
		 * @summary Resends the account confirmation link.
		 * @request POST:/Account/confirm
		 * @secure
		 */
		resendConfirmationEmail: (params: RequestParams = {}) =>
			this.request<void, ProblemDetails | void>({
				path: `/Account/confirm`,
				method: 'POST',
				secure: true,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name SendRecoveryEmail
		 * @summary Sends an account recovery email.
		 * @request POST:/Account/recover
		 * @secure
		 */
		sendRecoveryEmail: (
			data: RecoverAccountRequest,
			params: RequestParams = {}
		) =>
			this.request<void, ProblemDetails | void>({
				path: `/Account/recover`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name ConfirmAccount
		 * @summary Confirms a user account.
		 * @request PUT:/Account/confirm/{id}
		 * @secure
		 */
		confirmAccount: (id: string, params: RequestParams = {}) =>
			this.request<void, ProblemDetails | void>({
				path: `/Account/confirm/${id}`,
				method: 'PUT',
				secure: true,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name TestRecoveryToken
		 * @summary Tests an account recovery token for validity.
		 * @request GET:/Account/recover/{id}
		 * @secure
		 */
		testRecoveryToken: (id: string, params: RequestParams = {}) =>
			this.request<void, ProblemDetails | void>({
				path: `/Account/recover/${id}`,
				method: 'GET',
				secure: true,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name ChangePassword
		 * @summary Recover the user's account by resetting their password to a new value.
		 * @request POST:/Account/recover/{id}
		 * @secure
		 */
		changePassword: (
			id: string,
			data: ChangePasswordRequest,
			params: RequestParams = {}
		) =>
			this.request<void, ProblemDetails | void | ValidationProblemDetails>({
				path: `/Account/recover/${id}`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				...params
			})
	}
	login = {
		/**
		 * No description
		 *
		 * @tags Account
		 * @name Login
		 * @summary Logs a User in.
		 * @request POST:/login
		 * @secure
		 */
		login: (data: LoginRequest, params: RequestParams = {}) =>
			this.request<
				LoginResponse,
				ProblemDetails | void | ValidationProblemDetails
			>({
				path: `/login`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			})
	}
	api = {
		/**
		 * No description
		 *
		 * @tags Categories
		 * @name GetCategory
		 * @summary Gets a Category by its ID.
		 * @request GET:/api/category/{id}
		 * @secure
		 */
		getCategory: (id: number, params: RequestParams = {}) =>
			this.request<CategoryViewModel, ProblemDetails | void>({
				path: `/api/category/${id}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Leaderboards
		 * @name GetLeaderboard
		 * @summary Gets a leaderboard by its ID.
		 * @request GET:/api/leaderboard/{id}
		 * @secure
		 */
		getLeaderboard: (id: number, params: RequestParams = {}) =>
			this.request<LeaderboardViewModel, ProblemDetails | void>({
				path: `/api/leaderboard/${id}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Leaderboards
		 * @name GetLeaderboardBySlug
		 * @summary Gets a leaderboard by its slug.
		 * @request GET:/api/leaderboard
		 * @secure
		 */
		getLeaderboardBySlug: (
			query: {
				slug: string
			},
			params: RequestParams = {}
		) =>
			this.request<LeaderboardViewModel, ProblemDetails | void>({
				path: `/api/leaderboard`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Leaderboards
		 * @name ListLeaderboards
		 * @summary Gets all leaderboards.
		 * @request GET:/api/leaderboards
		 * @secure
		 */
		listLeaderboards: (
			query?: {
				/** @default false */
				includeDeleted?: boolean
			},
			params: RequestParams = {}
		) =>
			this.request<LeaderboardViewModel[], ProblemDetails | void>({
				path: `/api/leaderboards`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Runs
		 * @name GetRun
		 * @summary Gets a Run by its ID.
		 * @request GET:/api/run/{id}
		 * @secure
		 */
		getRun: (id: string, params: RequestParams = {}) =>
			this.request<
				RunViewModel | TimedRunViewModel | ScoredRunViewModel,
				ProblemDetails | void
			>({
				path: `/api/run/${id}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Runs
		 * @name GetRunCategory
		 * @summary Gets the category a run belongs to.
		 * @request GET:/api/run/{id}/category
		 * @secure
		 */
		getRunCategory: (id: string, params: RequestParams = {}) =>
			this.request<CategoryViewModel, ProblemDetails | void>({
				path: `/api/run/${id}/category`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Users
		 * @name GetUser
		 * @summary Gets a User by their ID.
		 * @request GET:/api/user/{id}
		 * @secure
		 */
		getUser: (id: string, params: RequestParams = {}) =>
			this.request<UserViewModel, ProblemDetails | void>({
				path: `/api/user/${id}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			})
	}
	categories = {
		/**
		 * No description
		 *
		 * @tags Categories
		 * @name CreateCategory
		 * @summary Creates a new Category. This request is restricted to Moderators.
		 * @request POST:/categories/create
		 * @secure
		 */
		createCategory: (data: CreateCategoryRequest, params: RequestParams = {}) =>
			this.request<
				CategoryViewModel,
				ProblemDetails | void | ValidationProblemDetails
			>({
				path: `/categories/create`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			})
	}
	leaderboards = {
		/**
		 * No description
		 *
		 * @tags Leaderboards
		 * @name CreateLeaderboard
		 * @summary Creates a new leaderboard. This request is restricted to Administrators.
		 * @request POST:/leaderboards/create
		 * @secure
		 */
		createLeaderboard: (
			data: CreateLeaderboardRequest,
			params: RequestParams = {}
		) =>
			this.request<
				LeaderboardViewModel,
				ProblemDetails | void | ValidationProblemDetails
			>({
				path: `/leaderboards/create`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			})
	}
	leaderboard = {
		/**
		 * No description
		 *
		 * @tags Leaderboards
		 * @name RestoreLeaderboard
		 * @summary Restores a deleted leaderboard.
		 * @request PUT:/leaderboard/{id}/restore
		 * @secure
		 */
		restoreLeaderboard: (id: number, params: RequestParams = {}) =>
			this.request<
				LeaderboardViewModel,
				ProblemDetails | void | LeaderboardViewModel
			>({
				path: `/leaderboard/${id}/restore`,
				method: 'PUT',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Leaderboards
		 * @name DeleteLeaderboard
		 * @summary Deletes a leaderboard. This request is restricted to Administrators.
		 * @request DELETE:/leaderboard/{id}
		 * @secure
		 */
		deleteLeaderboard: (id: number, params: RequestParams = {}) =>
			this.request<void, ProblemDetails | void>({
				path: `/leaderboard/${id}`,
				method: 'DELETE',
				secure: true,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Leaderboards
		 * @name UpdateLeaderboard
		 * @summary Updates a leaderboard with the specified new fields. This request is restricted to administrators. This operation is atomic; if an error occurs, the leaderboard will not be updated. All fields of the request body are optional but you must specify at least one.
		 * @request PATCH:/leaderboard/{id}
		 * @secure
		 */
		updateLeaderboard: (
			id: number,
			data: UpdateLeaderboardRequest,
			params: RequestParams = {}
		) =>
			this.request<
				void,
				ProblemDetails | void | LeaderboardViewModel | ValidationProblemDetails
			>({
				path: `/leaderboard/${id}`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				...params
			})
	}
	runs = {
		/**
		 * No description
		 *
		 * @tags Runs
		 * @name CreateRun
		 * @summary Creates a new Run.
		 * @request POST:/runs/create
		 * @secure
		 */
		createRun: (data: CreateRunRequest, params: RequestParams = {}) =>
			this.request<void, ProblemDetails | void | ValidationProblemDetails>({
				path: `/runs/create`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				...params
			})
	}
	user = {
		/**
		 * @description Call this method with the 'Authorization' header. A valid JWT bearer token must be passed. Example: `{ 'Authorization': 'Bearer JWT' }`.
		 *
		 * @tags Users
		 * @name Me
		 * @summary Gets the currently logged-in User.
		 * @request GET:/user/me
		 * @secure
		 */
		me: (params: RequestParams = {}) =>
			this.request<UserViewModel, ProblemDetails | void>({
				path: `/user/me`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			})
	}
}
